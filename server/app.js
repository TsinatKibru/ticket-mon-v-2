import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import departmentRouter from "./routes/department.routes.js";
import authRouter from "./routes/auth.routes.js";
import ticketRouter from "./routes/ticket.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import apiLimiter from "./middlewares/ratelimiter.middleware.js";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http"; // Import HTTP Server
import { Server } from "socket.io"; // Import Socket.IO
import { authenticateSocket } from "./middlewares/socketAuth.middleware.js";

const app = express();
const server = createServer(app);

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://ticket-mon-v-2-n161kzvvl-tsinats-projects.vercel.app"]
    : ["http://localhost:3000"];

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Adjust for frontend
    credentials: true,
  },
});

// Enable CORS
app.use(
  cors({
    origin: allowedOrigins, // Allow requests from your React frontend
    credentials: true, // Allow cookies and credentials
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", apiLimiter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tickets", ticketRouter);
app.use("/api/v1/departments", departmentRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("welcome to your api");
});

io.use(authenticateSocket);
// Socket.IO Connection Handler
io.on("connection", (socket) => {
  // console.log("A user connected:", socket.id);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  if (socket.user && socket.user._id) {
    const userId = socket.user._id.toString(); // Get userId from the authenticated socket
    socket.join(userId); // Join the user to their room
    console.log(
      `[INFO] User ${userId} connected | Socket: ${
        socket.id
      } | Room: ${userId} | ${new Date().toISOString()}`
    );
  } else {
    console.log(
      `[ERROR] Authentication failed | Socket ID: ${
        socket.id
      } | Reason: User not authenticated or missing user ID | ${new Date().toISOString()}`
    );
  }
});

// Start the server
server.listen(PORT, async () => {
  console.log("Ticket Monitoring API running on", PORT);
  await connectToDatabase();
});

// Export Socket.IO instance for use in controllers
export { io };

export default app;

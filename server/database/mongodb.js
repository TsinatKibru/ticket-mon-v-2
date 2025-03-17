// import mongoose from "mongoose";
// import { DB_URI, NODE_ENV } from "../config/env.js";

// if (!DB_URI) {
//   throw new Error(
//     "Please define mongodb uri env variable inside .env.development.local"
//   );
// }

// const connectToDatabase = async () => {
//   try {
//     await mongoose.connect(DB_URI);
//     console.log(`Connected to Database in ${NODE_ENV} mode`);
//   } catch (error) {
//     console.log("Error Connecting to Database:", error);
//     process.exit(1);
//   }
// };

// export default connectToDatabase;
import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error(
    "MongoDB URI is missing. Define DB_URI in your environment variables."
  );
}

const connectToDatabase = async (retries = 5, delay = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(DB_URI);

      console.log(`\x1b[32m✓ Connected to MongoDB (${NODE_ENV} mode)\x1b[0m`);
      return;
    } catch (error) {
      console.error(
        `\x1b[31m✗ Database connection failed (Attempt ${attempt}/${retries})\x1b[0m`
      );
      console.error(`Error: ${error.message}`);

      if (attempt < retries) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error("❌ All retry attempts failed. Exiting...");
        process.exit(1);
      }
    }
  }
};

export default connectToDatabase;

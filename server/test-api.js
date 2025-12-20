import mongoose from "mongoose";
import connectToDatabase from "./database/mongodb.js";
import User from "./models/user.model.js";
import { PORT } from "./config/env.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config/env.js";

async function testApi() {
    await connectToDatabase();
    const user = await User.findOne({ email: "qwerty@gmail.com" });
    if (!user) {
        console.log("User not found");
        process.exit(1);
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
    console.log("Testing API with token for user:", user.email);

    try {
        const url = `http://localhost:${PORT}/api/v1/notifications/unread`;
        console.log("GET", url);
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Response data:", data);
    } catch (error) {
        console.log("Error:", error.message);
    }
    process.exit(0);
}

testApi();


import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/category.model.js";

dotenv.config({ path: "../.env" }); // Assuming running from server/ root
dotenv.config({ path: "../.env.local" }); // Try .env.local as well
if (!process.env.MONGODB_URI) {
    // try loading from root if running from scripts/
    dotenv.config({ path: "../../.env" });
    dotenv.config({ path: "../../.env.local" });
}

const categories = [
    "Technical",
    "Billing",
    "General",
    "Technical Support",
    "Hardware Request",
    "Access Request",
    "Others"
];

const seedCategories = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected.");

        console.log("Seeding categories...");
        for (const name of categories) {
            const exists = await Category.findOne({ name });
            if (!exists) {
                await Category.create({ name });
                console.log(`Created category: ${name}`);
            } else {
                console.log(`Category exists: ${name}`);
            }
        }

        console.log("Seeding complete.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedCategories();

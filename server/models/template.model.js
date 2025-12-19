import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Template name is required"],
            trim: true,
            unique: true,
        },
        title: {
            type: String,
            required: [true, "Default title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Default description is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Default category is required"],
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Urgent"],
            default: "Medium",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Template = mongoose.model("Template", templateSchema);
export default Template;

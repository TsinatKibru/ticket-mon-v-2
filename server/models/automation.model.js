import mongoose from "mongoose";

const automationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Automation name is required"],
            trim: true,
        },
        trigger: {
            type: {
                type: String,
                enum: ["OnCreate", "OnStatusChange", "OnPriorityChange"],
                required: true,
            },
            conditions: {
                category: String,
                priority: String,
                keywords: [String],
            },
        },
        actions: [
            {
                type: {
                    type: String,
                    enum: ["AssignTo", "SetPriority", "SetStatus", "SendNotification"],
                    required: true,
                },
                params: {
                    userId: mongoose.Schema.Types.ObjectId,
                    value: String,
                    message: String,
                },
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Automation = mongoose.model("Automation", automationSchema);
export default Automation;

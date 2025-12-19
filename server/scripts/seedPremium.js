import mongoose from "mongoose";
import User from "../models/user.model.js";
import Ticket from "../models/ticket.model.js";
import Template from "../models/template.model.js";
import { DB_URI } from "../config/env.js";

const seedData = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB for seeding...");

        // Find existing users
        const admin = await User.findOne({ role: "admin" });
        const agent = await User.findOne({ role: "support_agent" });
        const user = await User.findOne({ role: "user" });

        if (!admin || !agent || !user) {
            console.error("Make sure you have at least one admin, one agent, and one user in the DB.");
            process.exit(1);
        }

        console.log(`Using Admin: ${admin.email}, Agent: ${agent.email}, User: ${user.email}`);

        // 1. Create Templates
        const templates = [
            {
                name: "Software Bug Report",
                title: "[BUG] Issue in module...",
                description: "Steps to reproduce:\n1.\n2.\n3.\n\nActual Result:\nExpected Result:",
                category: "Technical Support",
                priority: "High",
                createdBy: admin._id
            },
            {
                name: "New Hardware Request",
                title: "Request for [Device Name]",
                description: "Department: \nReason for request: \nDate needed by:",
                category: "Hardware Request",
                priority: "Medium",
                createdBy: admin._id
            },
            {
                name: "Password Reset",
                title: "Access Issue: Locked Out",
                description: "User ID: \nSystem affected: \nError message (if any):",
                category: "Access Request",
                priority: "Urgent",
                createdBy: admin._id
            }
        ];

        await Template.deleteMany({});
        const createdTemplates = await Template.insertMany(templates);
        console.log(`Successfully seeded ${createdTemplates.length} templates.`);

        // 2. Create Tickets
        const tickets = [
            {
                title: "UI Glitch in Dashboard",
                description: "The sidebar disappears when resizing the window below 800px.",
                status: "Open",
                priority: "Medium",
                category: "Technical Support",
                created_by: user._id,
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
            },
            {
                title: "Printer not responding in Floor 2",
                description: "Offline status since this morning. Tried restarting, no luck.",
                status: "In Progress",
                priority: "High",
                category: "Hardware Request",
                created_by: user._id,
                assigned_to: agent._id,
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            },
            {
                title: "Slow Database Queries in Reports",
                description: "Analytics page takes more than 10 seconds to load data.",
                status: "Resolved",
                priority: "Urgent",
                category: "Technical Support",
                created_by: user._id,
                assigned_to: agent._id,
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
                title: "Access to VPN for new hire",
                description: "John Doe needs VPN access for remote work starting Monday.",
                status: "Resolved",
                priority: "Medium",
                category: "Access Request",
                created_by: user._id,
                assigned_to: agent._id,
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
            }
        ];

        await Ticket.deleteMany({});
        const createdTickets = await Ticket.insertMany(tickets);
        console.log(`Successfully seeded ${createdTickets.length} tickets.`);

        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed humblely:", error);
        process.exit(1);
    }
};

seedData();

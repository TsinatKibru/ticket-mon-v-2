import nodemailer from "nodemailer";
import { htmlToText } from "html-to-text";
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM,
  NODE_ENV,
} from "../config/env.js";

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST || "smtp.mailtrap.io",
  port: SMTP_PORT || 2525,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

/**
 * Send an email using a template
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const text = htmlToText(html);
    const mailOptions = {
      from: EMAIL_FROM || "TaskFlow <noreply@taskflow.com>",
      to,
      subject,
      html,
      text,
    };

    if (NODE_ENV === "development" && (!SMTP_USER || !SMTP_PASS)) {
      console.log("------- EMAIL SIMULATION -------");
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${text}`);
      console.log("--------------------------------");
      return { success: true, message: "Email simulated" };
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Ticket Created Notification
 */
export const sendTicketCreatedEmail = async (ticket, user) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #8b5cf6;">New Ticket Created</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>Your ticket has been successfully created and is being reviewed by our support team.</p>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Ticket ID:</strong> #${ticket._id}</p>
        <p><strong>Title:</strong> ${ticket.title}</p>
        <p><strong>Category:</strong> ${ticket.category}</p>
        <p><strong>Priority:</strong> ${ticket.priority}</p>
      </div>
      <p>You can track the status of your ticket on our portal.</p>
      <a href="${process.env.CLIENT_URL}/app/tickets" style="display: inline-block; background-color: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Ticket</a>
      <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Best regards,<br>TaskFlow Team</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: `Ticket Created: ${ticket.title}`,
    html,
  });
};

/**
 * Ticket Assigned Notification
 */
export const sendTicketAssignedEmail = async (ticket, agent) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #3b82f6;">New Ticket Assigned</h2>
      <p>Hello <strong>${agent.name}</strong>,</p>
      <p>A new ticket has been assigned to you for resolution.</p>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Ticket ID:</strong> #${ticket._id}</p>
        <p><strong>Title:</strong> ${ticket.title}</p>
        <p><strong>Priority:</strong> ${ticket.priority}</p>
      </div>
      <a href="${process.env.CLIENT_URL}/app/tickets" style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Handle Ticket</a>
      <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Best regards,<br>TaskFlow Team</p>
    </div>
  `;

  return sendEmail({
    to: agent.email,
    subject: `New Assignment: ${ticket.title}`,
    html,
  });
};

/**
 * Ticket Status Updated Notification
 */
export const sendTicketStatusUpdatedEmail = async (ticket, user, status) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #10b981;">Ticket Status Updated</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>The status of your ticket has been updated to: <span style="font-weight: bold; color: #10b981;">${status}</span></p>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Ticket ID:</strong> #${ticket._id}</p>
        <p><strong>Title:</strong> ${ticket.title}</p>
      </div>
      <a href="${process.env.CLIENT_URL}/app/tickets" style="display: inline-block; background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Changes</a>
      <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Best regards,<br>TaskFlow Team</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: `Status Update: ${ticket.title} is now ${status}`,
    html,
  });
};

/**
 * New Comment Notification
 */
export const sendNewCommentEmail = async (ticket, user, commentText) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #8b5cf6;">New Comment on Ticket</h2>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>A new comment has been added to your ticket: <strong>${ticket.title}</strong></p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0; font-style: italic; border-left: 4px solid #8b5cf6;">
        "${commentText}"
      </div>
      <a href="${process.env.CLIENT_URL}/app/tickets" style="display: inline-block; background-color: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Reply to Comment</a>
      <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Best regards,<br>TaskFlow Team</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: `New Comment: ${ticket.title}`,
    html,
  });
};

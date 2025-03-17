// notifications.util.js

/**
 * Generates HTML notification messages with subtle Tailwind CSS styling.
 *
 * @param {object} options - Configuration options for the notification.
 * @param {string} options.type - The type of notification ('comment', 'status', 'assign', 'attachment').
 * @param {object} options.reqUser - The user object from the request.
 * @param {object} options.ticket - The ticket object.
 * @param {string} [options.status] - The new status (for status notifications).
 * @param {string} [options.commentText] - The comment text (for comment notifications).
 * @param {string} [options.attachmentUrl] - The attachment URL (for attachment notifications).
 * @returns {string} - The HTML notification message.
 */
export const generateNotificationMessage = (options) => {
  const { type, reqUser, ticket, status, commentText, attachmentUrl } = options;

  switch (type) {
    case "comment":
      return `
          <div class="p-2">
            <p class="text-sm">
              <strong class="font-semibold">${reqUser.name}</strong> added a comment to ticket: 
              <em class="font-italic">"${ticket.title}"</em>.
            </p>
            <p class="text-xs mt-1">
              <strong>Comment:</strong> "${commentText}"
            </p>
          </div>
        `;
    case "status":
      return `
          <div class="p-2">
            <p class="text-sm">
              Ticket <em>"${ticket.title}"</em> status updated to 
              <strong class="font-semibold">${status}</strong>.
            </p>
          </div>
        `;
    case "assign":
      return `
          <div class="p-2">
            <p class="text-sm">
              You've been assigned to ticket: <em>"${ticket.title}"</em>.
            </p>
          </div>
        `;
    case "attachment":
      return `
          <div class="p-2">
            <p class="text-sm">
              Attachment added to ticket: <em>"${ticket.title}"</em>.
            </p>
            <p class="text-xs mt-1">
              <a href="${attachmentUrl}" target="_blank" class="underline">View Attachment</a>
            </p>
          </div>
        `;
    default:
      return ""; // Return an empty string for unknown types.
  }
};

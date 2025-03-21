import React, { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../utils/axiosConfig";
import { updateTicket } from "../../redux/slices/ticketSlice";
import { removeNotification } from "../../redux/slices/notificationSlice";

const ChatDrawerBody = ({ extraObject }) => {
  const { comment, ticketId } = extraObject; // Get the comment and ticketId from extraObject
  const [newMessage, setNewMessage] = useState("");
  const [replies, setReplies] = useState(comment.replies || []); // Initialize replies from the comment
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user); // Assuming you have a current user in your Redux state
  const notifications = useSelector(
    (state) => state.notification.notifications
  );

  // Use a ref to track processed notifications
  const processedNotifications = useRef(new Set());

  // Effect to handle new notifications
  useEffect(() => {
    notifications.forEach((notification) => {
      // Skip if this notification has already been processed
      if (processedNotifications.current.has(notification)) {
        return;
      }

      // Check if the notification belongs to the current comment
      if (notification.parentCommentId === comment._id) {
        console.log("New reply detected:", notification.comment.text);

        // Create a new reply object
        const newReply = {
          text: notification.comment.text,
          created_by: notification.comment.created_by, // Ensure this matches the expected structure
        };

        // Add the new reply to the replies state
        setReplies((prevReplies) => [...prevReplies, newReply]);

        // Mark this notification as processed
        processedNotifications.current.add(notification);

        // Remove the notification from the notifications array
        dispatch(removeNotification(notification));
      }
    });
  }, [notifications, comment._id, dispatch]);

  const handleSendMessage = async () => {
    try {
      if (newMessage.trim() === "") return;

      const response = await axios.post(
        `/api/v1/tickets/${ticketId}/comments`,
        {
          text: newMessage,
          parentCommentId: comment._id,
        }
      );

      dispatch(updateTicket(response.data.data));

      const reply = {
        text: newMessage,
        created_by: {
          _id: currentUser._id,
          name: currentUser.name, // Assuming the user object has a name field
        },
      };

      setReplies([...replies, reply]); // Update the replies state
      setNewMessage("");
      dispatch(updateTicket(response.data.data));
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <div className="h-[calc(90vh)] overflow-auto flex flex-col">
      {/* Comment and Replies */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Display the main comment */}
        <div className="mb-4 text-left">
          <div className="inline-block p-3 rounded-lg bg-base-200 text-base-content">
            <p className="text-sm">{comment.text}</p>
          </div>
          <p className="text-xs mt-1 text-base-content/60">
            {comment.created_by.name} {/* Display the comment author */}
          </p>
        </div>

        {/* Display replies */}
        {replies.map((reply, index) => (
          <div
            key={index}
            className={`mb-4 ml-8 ${
              reply.created_by._id === currentUser._id
                ? "text-right"
                : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                reply.created_by._id === currentUser._id
                  ? "bg-primary text-white"
                  : "bg-base-200 text-base-content"
              }`}
            >
              <p className="text-sm">{reply.text}</p>
            </div>
            <p className="text-xs mt-1 text-base-content/60">
              {reply.created_by.name} {/* Display the reply author */}
            </p>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-4 border-t border-base-300">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a reply..."
            className="input input-bordered w-full"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            className="btn btn-primary"
            onClick={handleSendMessage}
            disabled={newMessage.trim() === ""}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDrawerBody;

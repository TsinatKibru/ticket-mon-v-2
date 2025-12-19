import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { showNotification } from "../redux/slices/headerSlice";
import { addCommentToTicket } from "../redux/slices/ticketSlice";
import { toast } from "sonner";

const AddCommentModalBody = ({ closeModal, extraObject }) => {
  const { ticketId } = extraObject;
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitComment = async () => {
    if (!comment.trim()) {
      dispatch(
        showNotification({ message: "Comment cannot be empty!", status: 0 })
      );
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/v1/tickets/${ticketId}/comments`,
        { text: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newComment =
        response.data.data.comments[response.data.data.comments.length - 1];

      dispatch(addCommentToTicket({ ticketId: ticketId, comment: newComment }));
      toast.success(`Comment Added Successfully!`);

      closeModal();
    } catch (error) {
      dispatch(
        showNotification({
          message: "Failed to add comment. Please try again.",
          status: 0,
        })
      );
      toast.error(`User Adding Failed!`);

      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder="Enter your comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={submitComment}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default AddCommentModalBody;

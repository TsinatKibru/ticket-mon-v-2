import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { showNotification } from "../redux/slices/headerSlice";
import { changeTicketStatus } from "../redux/slices/ticketSlice";
import { toast } from "sonner";

const UpdateTicketStatus = ({ closeModal, extraObject }) => {
  const { ticketId } = extraObject;
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState("");
  const statusoptions = ["Open", "In Progress", "Resolved"];
  const [loading, setLoading] = useState(false);

  const updateticketstatus = async () => {
    if (!selectedStatus) {
      dispatch(
        showNotification({
          message: "Please select a support agent!",
          status: 0,
        })
      );
      toast.info("Please select a support agent!");

      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/v1/tickets/${ticketId}/status`,
        { status: selectedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(
        changeTicketStatus({
          _id: ticketId,
          status: selectedStatus,
        })
      );
      toast.success("Ticket  status changed Sucessfully");

      closeModal();
    } catch (error) {
      dispatch(
        showNotification({
          message: "Failed to assign ticket. Please try again.",
          status: 0,
        })
      );
      toast.error("Failed to change status. Please try again.");
      console.error("Error assigning ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <select
        className="select select-bordered w-full"
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="">Status</option>
        {statusoptions.map((status, index) => (
          <option key={index} value={status}>
            {status}
          </option>
        ))}
      </select>
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={updateticketstatus}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default UpdateTicketStatus;

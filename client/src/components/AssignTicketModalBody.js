import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../redux/slices/headerSlice";
import { assignTicketAction } from "../redux/slices/ticketSlice";
import axios from "../utils/axiosConfig";
import { toast } from "react-toastify";

const AssignTicketModalBody = ({ closeModal, extraObject }) => {
  const { ticketId } = extraObject;
  const dispatch = useDispatch();
  const [selectedAgent, setSelectedAgent] = useState("");
  const [loading, setLoading] = useState(false);
  const users = useSelector((state) => state.user.users);
  const supportAgents = users.filter((user) => user.role === "support_agent");

  const assignTicket = async () => {
    if (!selectedAgent) {
      toast.info(`Please select a support agent!`);

      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(`/api/v1/tickets/${ticketId}/assign`, {
        assigned_to: selectedAgent,
      });

      console.log(response);

      // if (!response.ok) {
      //   throw new Error("Failed to assign ticket");
      // }

      const assignedUser = users.find(
        (user) => user._id === response.data.data.assigned_to
      );

      dispatch(
        assignTicketAction({
          _id: ticketId,
          assigned_to: assignedUser,
        })
      );
      toast.success(`User Assigned Successfully!`);

      closeModal();
    } catch (error) {
      dispatch(
        showNotification({
          message: "Failed to assign ticket. Please try again.",
          status: 0,
        })
      );
      toast.error(`User Assignment Failed!`);

      console.error("Error assigning ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <select
        className="select select-bordered w-full"
        value={selectedAgent}
        onChange={(e) => setSelectedAgent(e.target.value)}
      >
        <option value="">Select a support agent</option>
        {supportAgents.map((agent) => (
          <option key={agent._id} value={agent._id}>
            {agent.name}
          </option>
        ))}
      </select>
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={assignTicket}
          disabled={loading}
        >
          {loading ? "Assigning..." : "Assign"}
        </button>
      </div>
    </div>
  );
};

export default AssignTicketModalBody;

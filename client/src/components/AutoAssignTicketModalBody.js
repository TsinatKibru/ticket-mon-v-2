import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../redux/slices/headerSlice";
import { assignTicketAction } from "../redux/slices/ticketSlice";
import axios from "../utils/axiosConfig";
import { toast } from "react-toastify";

const AutoAssignTicketModalBody = ({ closeModal, extraObject }) => {
  const { ticketId } = extraObject;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const departments = useSelector((state) => state.departments.departments);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const users = useSelector((state) => state.user.users);

  const autoAssignTicket = async () => {
    if (!selectedDepartment) {
      toast.info(`Please select a department!`);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `/api/v1/tickets/${ticketId}/autoassign`,
        { departmentId: selectedDepartment }
      );

      // Update the ticket in the Redux store
      const assignedUser = users.find(
        (user) => user._id === response.data.data.assigned_to
      );
      dispatch(
        assignTicketAction({
          _id: ticketId,
          assigned_to: assignedUser,
        })
      );

      toast.success(`Ticket Auto-Assigned Successfully!`);
      closeModal();
    } catch (error) {
      dispatch(
        showNotification({
          message: "Failed to auto-assign ticket. Please try again.",
          status: 0,
        })
      );
      toast.error(`Auto-Assignment Failed!`);
      console.error("Error auto-assigning ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Auto Assign Ticket</h3>
      <div className="mb-4">
        <label className="label">
          <span className="label-text">Select Department</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="" className="bg-base-100 text-base-content">Select a department</option>
          {departments.map((department) => (
            <option key={department._id} value={department._id} className="bg-base-100 text-base-content">
              {department.name}
            </option>
          ))}
        </select>
      </div>
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={autoAssignTicket}
          disabled={loading}
        >
          {loading ? "Auto-Assigning..." : "Auto Assign"}
        </button>
      </div>
    </div>
  );
};

export default AutoAssignTicketModalBody;

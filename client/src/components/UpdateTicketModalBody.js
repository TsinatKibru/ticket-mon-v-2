import React, { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "./Input/InputText";
import ErrorText from "./ErrorText";
import { updateTicket } from "../redux/slices/ticketSlice";
import { toast } from "react-toastify";

import { updateTicketsAPi } from "../utils/api";

function UpdateTicketModalBody({ closeModal, extraObject }) {
  const { ticket } = extraObject; // The ticket object to be updated
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ticketObj, setTicketObj] = useState({
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    category: ticket.category,
  });

  const saveUpdatedTicket = async () => {
    if (ticketObj.title.trim() === "")
      return setErrorMessage("Title is required!");
    if (ticketObj.description.trim() === "")
      return setErrorMessage("Description is required!");

    setLoading(true);

    try {
      const response = await updateTicketsAPi(ticket._id, ticketObj);
      console.log("response", response);

      dispatch(updateTicket(response));
      toast.success("Ticket  updated Sucessfully");

      closeModal();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          "Failed to update ticket. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setTicketObj({ ...ticketObj, [updateType]: value });
  };

  return (
    <>
      <InputText
        type="text"
        defaultValue={ticketObj.title}
        updateType="title"
        containerStyle="mt-4"
        labelTitle="Title"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={ticketObj.description}
        updateType="description"
        containerStyle="mt-4"
        labelTitle="Description"
        updateFormValue={updateFormValue}
      />

      <div className="form-control w-full mt-4">
        <label className="label">
          <span className="label-text text-base-content">Priority</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={ticketObj.priority}
          onChange={(e) =>
            updateFormValue({ updateType: "priority", value: e.target.value })
          }
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="form-control w-full mt-4">
        <label className="label">
          <span className="label-text text-base-content">Category</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={ticketObj.category}
          onChange={(e) =>
            updateFormValue({ updateType: "category", value: e.target.value })
          }
        >
          <option value="Technical">Technical</option>
          <option value="Billing">Billing</option>
          <option value="General">General</option>
        </select>
      </div>

      <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={saveUpdatedTicket}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </>
  );
}

export default UpdateTicketModalBody;

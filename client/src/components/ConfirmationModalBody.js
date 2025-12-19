import { useDispatch, useSelector } from "react-redux";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_CLOSE_TYPES,
} from "../utils/globalConstantUtil";
import { deleteTicketsAPi, deleteUserById } from "../utils/api";
import { deleteTicket, deleteUserTickets } from "../redux/slices/ticketSlice";
import { deleteUser } from "../redux/slices/userSlice";
import { toast } from "sonner";
import { useState } from "react";
import { deleteDepartment } from "../redux/slices/departmentsSlice";

function ConfirmationModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { status } = useSelector((state) => state.departments);

  const { ticketId, type, message, depId } = extraObject;
  console.log("type", type);
  const proceedWithYes = async () => {
    setLoading(true);

    try {
      if (ticketId && type === CONFIRMATION_MODAL_CLOSE_TYPES.TICKET_DELETE) {
        const response = await deleteTicketsAPi(ticketId);
        if (response.success === true) {
          dispatch(deleteTicket(ticketId));
          toast.success(`Ticket deleted successfully!`);
          closeModal();
        } else {
          toast.error(`Failed to deletjlsde ticket: ${response.message}`);
        }
      }

      if (type === CONFIRMATION_MODAL_CLOSE_TYPES.USER_DELETE) {
        const response = await deleteUserById(ticketId);
        if (response.success === true) {
          dispatch(deleteUser(ticketId));
          // dispatch(deleteUserTickets({ userId: ticketId, tickets: tickets })); // Pass userId and tickets
          dispatch(deleteUserTickets(ticketId)); // Pass userId and tickets

          toast.success(`User deleted successfully!`);
          closeModal();
        } else {
          toast.error(`Failed to delete user: ${response.message}`);
        }
      }
      if (type === CONFIRMATION_MODAL_CLOSE_TYPES.DEP_DELETE) {
        dispatch(deleteDepartment(depId));
        closeModal();
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <p className="text-xl mt-8 text-center">{message}</p>

      <div className="modal-action mt-12">
        <button className="btn btn-outline" onClick={() => closeModal()}>
          Cancel
        </button>

        <button
          className="btn btn-primary w-36"
          disabled={loading}
          onClick={proceedWithYes}
        >
          {loading ? "Deleting..." : "Yes"}
        </button>
      </div>
    </>
  );
}

export default ConfirmationModalBody;

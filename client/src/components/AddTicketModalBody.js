// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import InputText from "./Input/InputText";
// import ErrorText from "./ErrorText";
// import { addTicket } from "../redux/slices/ticketSlice";
// import { addTicketsAPi } from "../utils/api";
// import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
// import "react-toastify/dist/ReactToastify.css";
// const INITIAL_TICKET_OBJ = {
//   title: "",
//   description: "",
//   priority: "Medium", // Default priority
//   category: "Technical", // Default category
// };

// function AddTicketModalBody({ closeModal }) {
//   const dispatch = useDispatch();

//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [ticketObj, setTicketObj] = useState(INITIAL_TICKET_OBJ);

//   const saveNewTicket = async () => {
//     if (ticketObj.title.trim() === "")
//       return setErrorMessage("Title is required!");
//     if (ticketObj.description.trim() === "")
//       return setErrorMessage("Description is required!");

//     setLoading(true);

//     try {
//       const response = await addTicketsAPi(ticketObj);

//       if (response._id != null) {
//         dispatch(addTicket(response));
//         toast.success(`Ticket Created Sucessfully!`);
//         closeModal();
//         setTicketObj(INITIAL_TICKET_OBJ); //reset the form.
//       } else {
//         setErrorMessage(response.message);
//       }
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.error ||
//         "Failed to create ticket. Please try again.";
//       setErrorMessage(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateFormValue = ({ updateType, value }) => {
//     setErrorMessage("");
//     setTicketObj({ ...ticketObj, [updateType]: value });
//   };

//   return (
//     <>
//       <InputText
//         type="text"
//         defaultValue={ticketObj.title}
//         updateType="title"
//         containerStyle="mt-4"
//         labelTitle="Title"
//         updateFormValue={updateFormValue}
//       />

//       <InputText
//         type="text"
//         defaultValue={ticketObj.description}
//         updateType="description"
//         containerStyle="mt-4"
//         labelTitle="Description"
//         updateFormValue={updateFormValue}
//       />

//       <div className="form-control w-full mt-4">
//         <label className="label">
//           <span className="label-text text-base-content">Priority</span>
//         </label>
//         <select
//           className="select select-bordered w-full"
//           value={ticketObj.priority}
//           onChange={(e) =>
//             updateFormValue({ updateType: "priority", value: e.target.value })
//           }
//         >
//           <option value="Low">Low</option>
//           <option value="Medium">Medium</option>
//           <option value="High">High</option>
//         </select>
//       </div>

//       <div className="form-control w-full mt-4">
//         <label className="label">
//           <span className="label-text text-base-content">Category</span>
//         </label>
//         <select
//           className="select select-bordered w-full"
//           value={ticketObj.category}
//           onChange={(e) =>
//             updateFormValue({ updateType: "category", value: e.target.value })
//           }
//         >
//           <option value="Technical">Technical</option>
//           <option value="Billing">Billing</option>
//           <option value="General">General</option>
//         </select>
//       </div>

//       <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>

//       <div className="modal-action">
//         <button className="btn btn-ghost" onClick={closeModal}>
//           Cancel
//         </button>
//         <button
//           className="btn btn-primary px-6"
//           onClick={saveNewTicket}
//           disabled={loading}
//         >
//           {loading ? "Saving..." : "Save"}
//         </button>
//       </div>
//     </>
//   );
// }

// export default AddTicketModalBody;
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "./Input/InputText";
import ErrorText from "./ErrorText";
import { addTicket } from "../redux/slices/ticketSlice";
import { addTicketsAPi } from "../utils/api";
import { toast } from "sonner";

const INITIAL_TICKET_OBJ = {
  title: "",
  description: "",
  priority: "Medium", // Default priority
  category: "Technical Support", // Default category
};

function AddTicketModalBody({ closeModal }) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ticketObj, setTicketObj] = useState(INITIAL_TICKET_OBJ);
  const [attachment, setAttachment] = useState(null); // State for the attachment file
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  React.useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { getTemplates } = await import("../utils/templateApi");
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    }
  };

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    if (templateId) {
      const template = templates.find((t) => t._id === templateId);
      if (template) {
        setTicketObj({
          title: template.title,
          description: template.description,
          priority: template.priority,
          category: template.category,
        });
      }
    } else {
      setTicketObj(INITIAL_TICKET_OBJ);
    }
  };

  const saveNewTicket = async () => {
    if (ticketObj.title.trim() === "")
      return setErrorMessage("Title is required!");
    if (ticketObj.description.trim() === "")
      return setErrorMessage("Description is required!");

    setLoading(true);

    try {
      // Create a FormData object to send the ticket data and file
      const formData = new FormData();
      formData.append("title", ticketObj.title);
      formData.append("description", ticketObj.description);
      formData.append("priority", ticketObj.priority);
      formData.append("category", ticketObj.category);
      if (attachment) {
        formData.append("attachment", attachment); // Append the file if it exists
      }

      // Call the API with the FormData
      const response = await addTicketsAPi(formData);

      if (response._id != null) {
        dispatch(addTicket(response));
        toast.success(`Ticket Created Successfully!`);
        closeModal();
        setTicketObj(INITIAL_TICKET_OBJ); // Reset the form
        setAttachment(null); // Clear the attachment
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Failed to create ticket. Please try again.";
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setTicketObj({ ...ticketObj, [updateType]: value });
  };

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file); // Set the selected file
    }
  };

  return (
    <>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-base-content">Use Template (Optional)</span>
        </label>
        <select
          className="select select-bordered w-full select-sm"
          value={selectedTemplate}
          onChange={handleTemplateChange}
        >
          <option value="">-- No Template --</option>
          {templates.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

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
      {/* File input for attachment */}
      <div className="form-control w-full mt-4">
        <label className="label">
          <span className="label-text text-base-content">Attachment</span>
        </label>
        <input
          type="file"
          className="file-input file-input-bordered w-full"
          onChange={handleAttachmentChange}
        />
      </div>
      <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={saveNewTicket}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export default AddTicketModalBody;

// // AttachmentsPreview.js
// import {
//   PaperClipIcon,
//   DocumentIcon,
//   PhotoIcon,
//   ArchiveBoxIcon,
//   DocumentTextIcon,
//   PresentationChartBarIcon,
// } from "@heroicons/react/24/outline";
// import React from "react";

// function AttachmentsPreview({ attachments }) {
//   const isImage = (url) => {
//     return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
//   };

//   const getFileIcon = (url) => {
//     const fileExtension = url.split(".").pop().toLowerCase();

//     switch (fileExtension) {
//       case "pdf":
//       case "doc":
//       case "docx":
//       case "txt":
//         return <DocumentTextIcon className="max-w-48 max-h-48 mb-2" />;
//       case "ppt":
//       case "pptx":
//         return <PresentationChartBarIcon className="max-w-48 max-h-48 mb-2" />;
//       case "zip":
//       case "rar":
//         return <ArchiveBoxIcon className="max-w-48 max-h-48 mb-2" />;
//       case "jpg":
//       case "jpeg":
//       case "png":
//       case "gif":
//       case "bmp":
//       case "webp":
//         return <PhotoIcon className="max-w-48 max-h-48 mb-2" />;
//       default:
//         return <DocumentIcon className="max-w-48 max-h-48 mb-2" />;
//     }
//   };

//   return (
//     <div className="flex flex-wrap gap-4">
//       {attachments.map((attachment, index) => (
//         <div
//           key={index}
//           className="flex flex-col items-center p-2 bg-white dark:bg-transparent rounded-lg shadow-sm"
//         >
//           {isImage(attachment) ? (
//             <img
//               src={attachment}
//               alt={`Attachment ${index + 1}`}
//               className="max-w-32 max-h-32 object-contain mb-2 rounded-md"
//             />
//           ) : (
//             getFileIcon(attachment)
//           )}
//           <a
//             href={attachment}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-500 hover:underline text-sm"
//           >
//             Attachment {index + 1}
//           </a>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default AttachmentsPreview;
import React, { useState } from "react";
import {
  DocumentIcon,
  PhotoIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
  PresentationChartBarIcon,
  PlusCircleIcon,
  BackspaceIcon,
} from "@heroicons/react/24/outline";
import axios from "./axiosConfig";
import { useDispatch } from "react-redux";
import { updateTicket } from "../redux/slices/ticketSlice";
import { toast } from "react-toastify";
import { deleteAttachment, uploadAttachment } from "./api";

function AttachmentsPreview({ attachments, ticketId, status }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();

  const isImage = (url) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
  };

  const getFileIcon = (url) => {
    const fileExtension = url.split(".").pop().toLowerCase();

    switch (fileExtension) {
      case "pdf":
      case "doc":
      case "docx":
      case "txt":
        return <DocumentTextIcon className="max-w-48 max-h-48 mb-2" />;
      case "ppt":
      case "pptx":
        return <PresentationChartBarIcon className="max-w-48 max-h-48 mb-2" />;
      case "zip":
      case "rar":
        return <ArchiveBoxIcon className="max-w-48 max-h-48 mb-2" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "bmp":
      case "webp":
        return <PhotoIcon className="max-w-48 max-h-48 mb-2" />;
      default:
        return <DocumentIcon className="max-w-48 max-h-48 mb-2" />;
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file.");
      return;
    }

    setIsUploading(true);

    try {
      const response = await uploadAttachment(ticketId, selectedFile);

      dispatch(updateTicket(response));
      toast.success("Attachment uploaded successfully!");
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to upload attachment.");
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  const handleDelete = async (index) => {
    toast.warn(
      <div>
        <p>Are you sure you want to delete this attachment?</p>
        <button
          onClick={async () => {
            toast.dismiss(); // Close the warning toast
            try {
              const response = await deleteAttachment(ticketId, index);
              dispatch(updateTicket(response));
              toast.success("Attachment Deleted successfully!");
            } catch (error) {
              console.error("API Error:", error);
              toast.error("Failed to delete attachment.");
            } finally {
              setIsUploading(false);
              setSelectedFile(null);
            }
          }}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Yes
        </button>
        <button
          onClick={() => {
            toast.dismiss(); // Close the warning toast

            setIsUploading(false);
            setSelectedFile(null);
          }}
          className="mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          No
        </button>
      </div>,
      {
        closeOnClick: false,
        autoClose: false,
        draggable: false,
        hideProgressBar: true,
      }
    );
  };

  return (
    <div className="flex flex-wrap gap-4">
      {attachments.map((attachment, index) => (
        <div
          key={index}
          className="relative group flex flex-col items-center p-2 bg-white dark:bg-transparent rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          {/* Attachment Preview */}
          {isImage(attachment) ? (
            <img
              src={attachment}
              alt={`Attachment ${index + 1}`}
              className="max-w-24 max-h-24 object-contain mb-2 rounded-md"
            />
          ) : (
            getFileIcon(attachment)
          )}

          {/* Attachment Name */}
          <a
            href={attachment}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm"
          >
            Attachment {index + 1}
          </a>

          {/* Delete Button (Visible on Hover) */}
          <button
            onClick={() => handleDelete(index)}
            className="absolute top-1 right-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Delete attachment"
          >
            <BackspaceIcon className="h-8 w-8" />
          </button>
        </div>
      ))}

      {/* Add new attachment button */}
      {status !== "Resolved" && (
        <div className="flex flex-col items-center p-2 bg-white dark:bg-transparent rounded-lg shadow-sm">
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            {/* <PlusCircleIcon className="max-w-48 max-h-48 mb-2 text-gray-400 hover:text-gray-600" /> */}
            {selectedFile ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                className="max-w-24 max-h-24 mb-2 rounded-lg"
              />
            ) : (
              <PlusCircleIcon className="max-w-48 max-h-48 mb-2 text-gray-400 hover:text-gray-600" />
            )}
            <span className="text-sm text-gray-500">Add Attachment</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
          {selectedFile && (
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="mt-2 flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-lg transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AttachmentsPreview;

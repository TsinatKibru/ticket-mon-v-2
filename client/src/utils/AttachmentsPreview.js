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
  ArrowUpTrayIcon
  ,
} from "@heroicons/react/24/outline";
import axios from "./axiosConfig";
import { useDispatch } from "react-redux";
import { updateTicket } from "../redux/slices/ticketSlice";
import { toast } from "sonner";
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
    toast(
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
        duration: Infinity,
      }
    );
  };

  return (
    <div className="flex flex-wrap gap-4">
      {attachments.map((attachment, index) => (
        <div
          key={index}
          className="relative group flex flex-col items-center p-2 bg-base-content/5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
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
        <div className="flex flex-col items-center justify-center p-4 bg-base-100 border-2 border-dashed border-base-300 rounded-lg hover:border-primary cursor-pointer transition-colors duration-200">
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center w-full h-full"
          >
            {selectedFile ? (
              <div className="relative group">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected"
                  className="max-w-24 max-h-24 mb-2 rounded-lg object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-white text-xs">
                  Change
                </div>
              </div>
            ) : (
              <>
                <ArrowUpTrayIcon className="h-8 w-8 text-base-content/50 mb-2" />
                <span className="text-xs font-semibold text-base-content/70">Upload File</span>
              </>
            )}
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
            <div className="flex gap-2 mt-2 w-full">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="btn btn-primary btn-xs flex-1"
              >
                {isUploading ? "..." : "Upload"}
              </button>
              <button
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
                className="btn btn-ghost btn-xs text-error"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AttachmentsPreview;

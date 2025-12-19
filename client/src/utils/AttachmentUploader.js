import React, { useState } from "react";
import axios from "./axiosConfig";
import { useDispatch } from "react-redux";
import { updateTicket } from "../redux/slices/ticketSlice";
import { FolderPlusIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

function AttachmentUploader({ ticketId, status }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Track upload status
  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    setIsUploading(true); // Set uploading state

    const formData = new FormData();
    formData.append("attachment", selectedFile);

    try {
      const response = await uploadAttachment(ticketId, formData);

      console.log("API Response:", response);
      dispatch(updateTicket(response));
      toast.success("Attachment uploaded successfully!");
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to upload attachment.");
    } finally {
      setIsUploading(false); // Reset uploading state
      setSelectedFile(null); // Clear selected file after upload
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center space-x-4">
        {/* File Input */}
        <label
          htmlFor="file-upload"
          className={`flex items-center space-x-2 bg-gray-100 p-2 rounded-lg ${status === "Resolved"
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-gray-200 transition-colors duration-200"
            } `}
        >
          <PaperClipIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
          <span className="text-sm text-gray-700">Choose File</span>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            disabled={status === "Resolved"} // Add the disabled prop here
          />
        </label>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading || status === "resolved"} // Disable button if no file is selected or during upload
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          <FolderPlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
          {isUploading ? "Uploading..." : "Upload"}
        </button>

        {/* Selected File Name */}
        {selectedFile && (
          <span className="text-sm text-gray-600 truncate max-w-[200px]">
            {selectedFile.name}
          </span>
        )}
      </div>

      {/* Upload Status Message */}
      {isUploading && (
        <p className="text-sm text-gray-500 mt-2">
          Uploading file, please wait...
        </p>
      )}
    </div>
  );
}

// Separate API call function
async function uploadAttachment(ticketId, formData) {
  try {
    const response = await axios.post(
      `/api/v1/tickets/${ticketId}/attachments`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export default AttachmentUploader;

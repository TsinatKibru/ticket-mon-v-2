import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function MultiSelectDropdown({ users, formData, setFormData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null); // Ref for the dropdown container

  // Toggle user selection
  const toggleUser = (userId) => {
    const updatedUsers = formData.users.includes(userId)
      ? formData.users.filter((id) => id !== userId) // Remove user
      : [...formData.users, userId]; // Add user

    setFormData({ ...formData, users: updatedUsers });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="w-full" ref={dropdownRef}>
      <label className="label">
        <span className="label-text">Assign Users</span>
      </label>

      {/* Dropdown Trigger */}
      <div
        className="relative w-full cursor-pointer border border-base-300 rounded-lg p-2 flex items-center justify-between bg-base-100 border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Display Selected Users */}
        <div className="flex flex-wrap gap-1 ">
          {formData.users.length > 0 ? (
            formData.users.map((userId) => {
              const user = users.find((u) => u?._id === userId);
              return (
                <span
                  key={user?._id}
                  className="badge badge-primary badge-sm flex items-center gap-1"
                >
                  {user?.name}
                  <XMarkIcon
                    className="w-3 h-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleUser(user?._id);
                    }}
                  />
                </span>
              );
            })
          ) : (
            <span className="text-base-content/60">Select users...</span>
          )}
        </div>
        <ChevronDownIcon className="w-5 h-5 text-base-content/60" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute mt-2 w-1/2 bg-base-100 shadow-lg rounded-lg border border-base-300 z-10 p-2">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search users..."
            className="input input-sm input-bordered w-full mb-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* User List */}
          <ul className="max-h-48 overflow-auto">
            {users
              .filter((user) =>
                user?.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((user) => (
                <li
                  key={user?._id}
                  className="flex items-center justify-between px-3 py-2 hover:bg-base-200 cursor-pointer rounded-md"
                  onClick={() => toggleUser(user?._id)}
                >
                  <span>
                    {user?.name} ({user.email})
                  </span>
                  {formData.users.includes(user?._id) && (
                    <CheckIcon className="w-4 h-4 text-primary" />
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

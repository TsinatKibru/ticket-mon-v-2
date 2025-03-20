// import React, { useState, useRef, useEffect } from "react";
// import {
//   TrashIcon,
//   UserPlusIcon,
//   PencilSquareIcon,
//   CheckCircleIcon,
// } from "@heroicons/react/24/outline";

// const TicketActions = ({
//   ticket,
//   user,
//   openAssignTicketModal,
//   openUpdateTicketModal,
//   openTicketStatusChangeModal,
//   openConfirmTicketDelete,
// }) => {
//   const [showActions, setShowActions] = useState(false);
//   const dropdownRef = useRef(null);

//   const toggleActions = () => {
//     setShowActions(!showActions);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowActions(false);
//       }
//     };

//     if (showActions) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [showActions]);

//   return (
//     <div className="relative inline-block text-left">
//       <button onClick={toggleActions} className="btn btn-ghost btn-sm">
//         ... {/* Or any icon you prefer, like dots or a settings icon */}
//       </button>

//       {showActions && (
//         <div
//           ref={dropdownRef}
//           className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-300 ring-1 ring-black ring-opacity-5 focus:outline-none"
//           role="menu"
//           aria-orientation="vertical"
//           aria-labelledby="menu-button"
//           tabIndex="-1"
//         >
//           <div className="py-1" role="none">
//             {user.role === "admin" && (
//               <button
//                 onClick={() => {
//                   openAssignTicketModal(ticket._id);
//                   toggleActions(); // Close the menu
//                 }}
//                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 role="menuitem"
//               >
//                 <UserPlusIcon className="w-5 h-5 inline mr-2" /> Assign
//               </button>
//             )}
//             {user._id === ticket.created_by._id && (
//               <button
//                 onClick={() => {
//                   openUpdateTicketModal(ticket);
//                   toggleActions(); // Close the menu
//                 }}
//                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 role="menuitem"
//               >
//                 <PencilSquareIcon className="w-5 h-5 inline mr-2" /> Edit
//               </button>
//             )}
//             {user.role === "support_agent" &&
//               ticket.assigned_to != null &&
//               user._id === ticket.assigned_to._id && (
//                 <button
//                   onClick={() => {
//                     openTicketStatusChangeModal(ticket._id);
//                     toggleActions(); // Close the menu
//                   }}
//                   className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   role="menuitem"
//                 >
//                   <CheckCircleIcon className="w-5 h-5 inline mr-2" /> Update
//                   Status
//                 </button>
//               )}
//             {user.role === "admin" && (
//               <button
//                 onClick={() => {
//                   openConfirmTicketDelete(ticket._id);
//                   toggleActions(); // Close the menu
//                 }}
//                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 role="menuitem"
//               >
//                 <TrashIcon className="w-5 h-5 inline mr-2" /> Delete
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TicketActions;
import React, { useState, useRef, useEffect } from "react";
import {
  TrashIcon,
  UserPlusIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  SparklesIcon, // Icon for Auto Assign
} from "@heroicons/react/24/outline";

const TicketActions = ({
  ticket,
  user,
  openAssignTicketModal,
  openUpdateTicketModal,
  openTicketStatusChangeModal,
  openConfirmTicketDelete,
  openAutoAssignTicketModal, // New prop for Auto Assign
}) => {
  const [showActions, setShowActions] = useState(false);
  const dropdownRef = useRef(null);

  const toggleActions = () => {
    setShowActions(!showActions);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActions]);

  return (
    <div className="relative inline-block text-left">
      <button onClick={toggleActions} className="btn btn-ghost btn-sm">
        ... {/* Or any icon you prefer, like dots or a settings icon */}
      </button>

      {showActions && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-300 ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="py-1" role="none">
            {user.role === "admin" && (
              <>
                <button
                  onClick={() => {
                    openAssignTicketModal(ticket._id);
                    toggleActions(); // Close the menu
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  <UserPlusIcon className="w-5 h-5 inline mr-2" /> Assign
                </button>
                <button
                  onClick={() => {
                    openAutoAssignTicketModal(ticket._id); // Trigger Auto Assign
                    toggleActions(); // Close the menu
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  <SparklesIcon className="w-5 h-5 inline mr-2" /> Auto Assign
                </button>
              </>
            )}
            {user._id === ticket.created_by._id && (
              <button
                onClick={() => {
                  openUpdateTicketModal(ticket);
                  toggleActions(); // Close the menu
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                tabIndex="-1"
              >
                <PencilSquareIcon className="w-5 h-5 inline mr-2" /> Edit
              </button>
            )}
            {user.role === "support_agent" &&
              ticket.assigned_to != null &&
              user._id === ticket.assigned_to._id && (
                <button
                  onClick={() => {
                    openTicketStatusChangeModal(ticket._id);
                    toggleActions(); // Close the menu
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  tabIndex="-1"
                >
                  <CheckCircleIcon className="w-5 h-5 inline mr-2" /> Update
                  Status
                </button>
              )}
            {user.role === "admin" && (
              <button
                onClick={() => {
                  openConfirmTicketDelete(ticket._id);
                  toggleActions(); // Close the menu
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                tabIndex="-1"
              >
                <TrashIcon className="w-5 h-5 inline mr-2" /> Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketActions;

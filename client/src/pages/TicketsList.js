// import React, { Component } from "react";
// import { connect } from "react-redux";
// import moment from "moment";
// import TitleCard from "../components/TitleCard";
// import { openModal } from "../redux/slices/modalSlice";
// import { setPageTitle } from "../redux/slices/headerSlice";
// import {
//   getTickets,
//   addCommentToTicket,
//   changeTicketStatus,
//   updateTicket,
//   deleteTicket,
// } from "../redux/slices/ticketSlice";
// import {
//   CONFIRMATION_MODAL_CLOSE_TYPES,
//   MODAL_BODY_TYPES,
// } from "../utils/globalConstantUtil";
// import { getUsersContent } from "../redux/slices/userSlice";
// import { showNotification } from "../redux/slices/headerSlice";
// import {
//   ChatBubbleLeftIcon,
//   ChevronDownIcon,
//   ChevronUpIcon,
// } from "@heroicons/react/24/outline";
// import TicketActions from "../components/TicketActions";

// class TicketsList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       loading: false,
//       error: null,
//       expandedTickets: {}, // Track which tickets are expanded to show comments
//     };
//   }

//   openAddCommentModal = (ticketId) => {
//     this.props.openModal({
//       title: "Add Comment",
//       bodyType: MODAL_BODY_TYPES.ADD_COMMENT,
//       extraObject: { ticketId },
//     });
//   };

//   openAddNewTicketModal = () => {
//     this.props.openModal({
//       title: "Add New Ticket",
//       bodyType: MODAL_BODY_TYPES.TICKET_ADD_NEW,
//     });
//   };

//   openUpdateTicketModal = (ticket) => {
//     this.props.openModal({
//       title: "Update Ticket",
//       bodyType: MODAL_BODY_TYPES.TICKET_UPDATE,
//       extraObject: { ticket },
//     });
//   };

//   openAssignTicketModal = (ticketId) => {
//     this.props.openModal({
//       title: "Assign Ticket",
//       bodyType: MODAL_BODY_TYPES.ASSIGN_TICKET,
//       extraObject: { ticketId },
//     });
//   };

//   openTicketStatusChnageModal = (ticketId) => {
//     this.props.openModal({
//       title: "Status Update",
//       bodyType: MODAL_BODY_TYPES.TICKET_STATUS_UPDATE,
//       extraObject: { ticketId },
//     });
//   };

//   openConfirmTicketDelete = (ticketId) => {
//     this.props.openModal({
//       title: "Confirm Delete!",
//       bodyType: MODAL_BODY_TYPES.CONFIRMATION,
//       extraObject: {
//         ticketId,
//         type: CONFIRMATION_MODAL_CLOSE_TYPES.TICKET_DELETE,
//         message: "Deleting a Ticket,Are You sure? ",
//       },
//     });
//   };

//   toggleComments = (ticketId) => {
//     this.setState((prevState) => ({
//       expandedTickets: {
//         ...prevState.expandedTickets,
//         [ticketId]: !prevState.expandedTickets[ticketId], // Toggle expanded state
//       },
//     }));
//   };

//   render() {
//     const { loading, error, expandedTickets } = this.state;

//     const { tickets } = this.props;

//     const { user } = this.props.auth;

//     if (loading) {
//       return <div>Loading...</div>;
//     }

//     if (error) {
//       return <div className="text-red-500">{error}</div>;
//     }

//     return (
//       <>
//         <TitleCard
//           title="Tickets"
//           topMargin="mt-2"
//           TopSideButtons={
//             <div className="inline-block float-right">
//               <button
//                 className="btn px-6 btn-sm normal-case btn-primary"
//                 onClick={this.openAddNewTicketModal}
//               >
//                 Add New
//               </button>
//             </div>
//           }
//         >
//           <div className="overflow-x-auto w-full">
//             <table className="table w-full">
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Status</th>
//                   <th>Priority</th>
//                   <th>Created By</th>
//                   <th>Created At</th>
//                   <th>Assigned To</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tickets.map((ticket) => (
//                   <React.Fragment key={ticket._id}>
//                     <tr>
//                       <td>{ticket.title}</td>
//                       <td>
//                         <div
//                           className={`badge ${
//                             ticket.status === "Open"
//                               ? "badge-secondary"
//                               : ticket.status === "In Progress"
//                               ? "badge-accent"
//                               : ticket.status === "Resolved"
//                               ? "badge-primary"
//                               : "badge-gray" // Default class for other statuses
//                           }`}
//                         >
//                           {ticket.status}
//                         </div>
//                       </td>
//                       <td>{ticket.priority}</td>
//                       <td>{ticket.created_by?.name}</td>
//                       <td>{moment(ticket.createdAt).format("DD MMM YY")}</td>
//                       <td>{ticket.assigned_to?.name || "None"}</td>
//                       <td>
//                         <div className="flex space-x-2">
//                           <button
//                             className="btn btn-ghost btn-sm"
//                             onClick={() => this.openAddCommentModal(ticket._id)}
//                           >
//                             <ChatBubbleLeftIcon className="w-5" />
//                           </button>

//                           {/* Assign Ticket Button (only for admins) */}
//                           <TicketActions
//                             ticket={ticket}
//                             user={user}
//                             openAssignTicketModal={this.openAssignTicketModal}
//                             openUpdateTicketModal={this.openUpdateTicketModal}
//                             openTicketStatusChnageModal={
//                               this.openTicketStatusChnageModal
//                             }
//                             openConfirmTicketDelete={
//                               this.openConfirmTicketDelete
//                             }
//                           />

//                           {/* Toggle Comments Button */}
//                           <button
//                             className="btn btn-ghost btn-sm"
//                             onClick={() => this.toggleComments(ticket._id)}
//                           >
//                             {expandedTickets[ticket._id] ? (
//                               <ChevronUpIcon className="w-5" />
//                             ) : (
//                               <ChevronDownIcon className="w-5" />
//                             )}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>

//                     {/* Comments Section */}
//                     {expandedTickets[ticket._id] && (
//                       <tr>
//                         <td colSpan="6">
//                           <div className="p-4 bg-gray-50 dark:bg-transparent">
//                             <h3 className="font-semibold mb-2">Description</h3>
//                             <p className="p-3">{ticket.description}</p>

//                             <h3 className="font-semibold mb-2">Comments</h3>
//                             {ticket.comments.length > 0 ? (
//                               ticket.comments.map((comment) => (
//                                 <div
//                                   key={comment._id}
//                                   className="mb-4 p-3 bg-white dark:bg-transparent rounded-lg shadow-sm"
//                                 >
//                                   <p className="text-sm">{comment.text}</p>
//                                   <p className="text-xs text-gray-500 mt-1">
//                                     By:{" "}
//                                     {this.props.users.find(
//                                       (user) => user._id === comment.created_by
//                                     )?.name || "Unknown"}{" "}
//                                     on{" "}
//                                     {moment(comment.createdAt).format(
//                                       "DD MMM YY, h:mm A"
//                                     )}
//                                   </p>
//                                 </div>
//                               ))
//                             ) : (
//                               <p className="text-gray-500">No comments yet.</p>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//             <div className="pt-12"></div>
//           </div>
//         </TitleCard>
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   auth: state.auth,
//   users: state.user.users,
//   tickets: state.ticket.tickets,
// });

// const mapDispatchToProps = {
//   openModal,
//   getUsersContent,
//   setPageTitle,
//   showNotification,
//   getTickets,
//   addCommentToTicket,

//   changeTicketStatus,
//   updateTicket,
//   deleteTicket,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(TicketsList);
// import React, { Component } from "react";
// import { connect } from "react-redux";
// import moment from "moment";
// import TitleCard from "../components/TitleCard";
// import { openModal } from "../redux/slices/modalSlice";
// import { setPageTitle } from "../redux/slices/headerSlice";
// import {
//   getTickets,
//   addCommentToTicket,
//   changeTicketStatus,
//   updateTicket,
//   deleteTicket,
// } from "../redux/slices/ticketSlice";
// import {
//   CONFIRMATION_MODAL_CLOSE_TYPES,
//   MODAL_BODY_TYPES,
// } from "../utils/globalConstantUtil";
// import { getUsersContent } from "../redux/slices/userSlice";
// import { showNotification } from "../redux/slices/headerSlice";
// import {
//   ChatBubbleLeftIcon,
//   ChevronDownIcon,
//   ChevronUpIcon,
// } from "@heroicons/react/24/outline";
// import TicketActions from "../components/TicketActions";
// import AttachmentsPreview from "../utils/AttachmentsPreview";

// class TicketsList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       loading: false,
//       error: null,
//       expandedTickets: {}, // Track which tickets are expanded to show comments
//     };
//   }

//   openAddCommentModal = (ticketId) => {
//     this.props.openModal({
//       title: "Add Comment",
//       bodyType: MODAL_BODY_TYPES.ADD_COMMENT,
//       extraObject: { ticketId },
//     });
//   };

//   openAddNewTicketModal = () => {
//     this.props.openModal({
//       title: "Add New Ticket",
//       bodyType: MODAL_BODY_TYPES.TICKET_ADD_NEW,
//     });
//   };

//   openUpdateTicketModal = (ticket) => {
//     this.props.openModal({
//       title: "Update Ticket",
//       bodyType: MODAL_BODY_TYPES.TICKET_UPDATE,
//       extraObject: { ticket },
//     });
//   };

//   openAssignTicketModal = (ticketId) => {
//     this.props.openModal({
//       title: "Assign Ticket",
//       bodyType: MODAL_BODY_TYPES.ASSIGN_TICKET,
//       extraObject: { ticketId },
//     });
//   };

//   openTicketStatusChangeModal = (ticketId) => {
//     this.props.openModal({
//       title: "Status Update",
//       bodyType: MODAL_BODY_TYPES.TICKET_STATUS_UPDATE,
//       extraObject: { ticketId },
//     });
//   };

//   openConfirmTicketDelete = (ticketId) => {
//     this.props.openModal({
//       title: "Confirm Delete!",
//       bodyType: MODAL_BODY_TYPES.CONFIRMATION,
//       extraObject: {
//         ticketId,
//         type: CONFIRMATION_MODAL_CLOSE_TYPES.TICKET_DELETE,
//         message: "Deleting a Ticket, Are You sure? ",
//       },
//     });
//   };

//   openAddAttachmentModal = (ticketId) => {
//     this.props.openModal({
//       title: "Add Attachment",
//       bodyType: MODAL_BODY_TYPES.ADD_ATTACHMENT,
//       extraObject: { ticketId },
//     });
//   };

//   toggleComments = (ticketId) => {
//     this.setState((prevState) => ({
//       expandedTickets: {
//         ...prevState.expandedTickets,
//         [ticketId]: !prevState.expandedTickets[ticketId], // Toggle expanded state
//       },
//     }));
//   };

//   render() {
//     const { loading, error, expandedTickets } = this.state;

//     const { tickets } = this.props;

//     const { user } = this.props.auth;

//     if (loading) {
//       return <div>Loading...</div>;
//     }

//     if (error) {
//       return <div className="text-red-500">{error}</div>;
//     }

//     return (
//       <>
//         <TitleCard
//           title="Tickets"
//           topMargin="mt-2"
//           TopSideButtons={
//             <div className="inline-block float-right">
//               <button
//                 className="btn px-6 btn-sm normal-case btn-primary"
//                 onClick={this.openAddNewTicketModal}
//               >
//                 Add New
//               </button>
//             </div>
//           }
//         >
//           <div className="overflow-x-auto w-full">
//             <table className="table w-full">
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Status</th>
//                   <th>Priority</th>
//                   <th>Created By</th>
//                   <th>Created At</th>
//                   <th>Assigned To</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tickets.map((ticket) => (
//                   <React.Fragment key={ticket._id}>
//                     <tr>
//                       <td>{ticket.title}</td>
//                       <td>
//                         <div
//                           className={`badge ${
//                             ticket.status === "Open"
//                               ? "badge-secondary"
//                               : ticket.status === "In Progress"
//                               ? "badge-accent"
//                               : ticket.status === "Resolved"
//                               ? "badge-primary"
//                               : "badge-gray" // Default class for other statuses
//                           }`}
//                         >
//                           {ticket.status.replace(" ", "")}
//                         </div>
//                       </td>
//                       <td>{ticket.priority}</td>
//                       <td>{ticket.created_by?.name}</td>
//                       <td>{moment(ticket.createdAt).format("DD MMM YY")}</td>
//                       <td>{ticket.assigned_to?.name || "None"}</td>
//                       <td>
//                         <div className="flex space-x-2">
//                           <button
//                             className="btn btn-ghost btn-sm"
//                             onClick={() => this.openAddCommentModal(ticket._id)}
//                           >
//                             <ChatBubbleLeftIcon className="w-5" />
//                           </button>

//                           {/* Assign Ticket Button (only for admins) */}
//                           <TicketActions
//                             ticket={ticket}
//                             user={user}
//                             openAssignTicketModal={this.openAssignTicketModal}
//                             openUpdateTicketModal={this.openUpdateTicketModal}
//                             openTicketStatusChangeModal={
//                               this.openTicketStatusChangeModal
//                             }
//                             openConfirmTicketDelete={
//                               this.openConfirmTicketDelete
//                             }
//                           />

//                           {/* Toggle Comments Button */}
//                           <button
//                             className="btn btn-ghost btn-sm"
//                             onClick={() => this.toggleComments(ticket._id)}
//                           >
//                             {expandedTickets[ticket._id] ? (
//                               <ChevronUpIcon className="w-5" />
//                             ) : (
//                               <ChevronDownIcon className="w-5" />
//                             )}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>

//                     {/* Expanded Section for Comments and Attachments */}
//                     {expandedTickets[ticket._id] && (
//                       <tr>
//                         <td colSpan="7">
//                           <div className="p-4 bg-gray-50 dark:bg-transparent">
//                             <h3 className="font-semibold mb-2">Description</h3>
//                             <p className="p-3">{ticket.description}</p>

//                             {/* Attachments Section */}
//                             <h3 className="font-semibold mb-2">Attachments</h3>

//                             <AttachmentsPreview
//                               attachments={ticket.attachments}
//                               ticketId={ticket._id}
//                               status={ticket.status}
//                             />

//                             {/* Comments Section */}
//                             <h3 className="font-semibold mt-4 mb-2">
//                               Comments
//                             </h3>
//                             {ticket.comments.length > 0 ? (
//                               ticket.comments.map((comment) => (
//                                 <div
//                                   key={comment._id}
//                                   className="mb-4 p-3 bg-white dark:bg-transparent rounded-lg shadow-sm"
//                                 >
//                                   <p className="text-sm">{comment.text}</p>
//                                   <p className="text-xs text-gray-500 mt-1">
//                                     By:{" "}
//                                     {this.props.users.find(
//                                       (user) => user._id === comment.created_by
//                                     )?.name || "Unknown"}{" "}
//                                     on{" "}
//                                     {moment(comment.createdAt).format(
//                                       "DD MMM YY, h:mm A"
//                                     )}
//                                   </p>
//                                 </div>
//                               ))
//                             ) : (
//                               <p className="text-gray-500">No comments yet.</p>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//             <div className="pt-12"></div>
//           </div>
//         </TitleCard>
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   auth: state.auth,
//   users: state.user.users,
//   tickets: state.ticket.tickets,
// });

// const mapDispatchToProps = {
//   openModal,
//   getUsersContent,
//   setPageTitle,
//   showNotification,
//   getTickets,
//   addCommentToTicket,
//   changeTicketStatus,
//   updateTicket,
//   deleteTicket,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(TicketsList);
// import React, { Component } from "react";
// import { connect } from "react-redux";
// import moment from "moment";
// import TitleCard from "../components/TitleCard";
// import { openModal } from "../redux/slices/modalSlice";
// import { setPageTitle } from "../redux/slices/headerSlice";
// import {
//   getTickets,
//   addCommentToTicket,
//   changeTicketStatus,
//   updateTicket,
//   deleteTicket,
// } from "../redux/slices/ticketSlice";
// import {
//   CONFIRMATION_MODAL_CLOSE_TYPES,
//   MODAL_BODY_TYPES,
// } from "../utils/globalConstantUtil";
// import { getUsersContent } from "../redux/slices/userSlice";
// import { showNotification } from "../redux/slices/headerSlice";
// import {
//   AdjustmentsHorizontalIcon,
//   ArrowUpIcon,
//   BarsArrowDownIcon,
//   BarsArrowUpIcon,
//   ChatBubbleLeftIcon,
//   ChevronDownIcon,
//   ChevronUpIcon,
//   FunnelIcon,
//   MagnifyingGlassIcon,
//   PaperClipIcon,
//   PlusIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";
// import TicketActions from "../components/TicketActions";
// import AttachmentUploader from "../utils/AttachmentUploader";
// import AttachmentsPreview from "../utils/AttachmentsPreview";
// import DatePicker from "react-datepicker"; // For date range filter
// import "react-datepicker/dist/react-datepicker.css"; // Date picker styles

// class TicketsList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       loading: false,
//       error: null,
//       expandedTickets: {}, // Track which tickets are expanded to show comments
//       filters: {
//         status: "",
//         priority: "",
//         category: "",
//         assignedTo: "",
//         startDate: null,
//         endDate: null,
//       },
//       searchQuery: "",
//       sortConfig: {
//         key: null,
//         direction: "asc", // 'asc' or 'desc'
//       },
//     };
//   }

//   // Open modals for various actions
//   openAddCommentModal = (ticketId) => {
//     this.props.openModal({
//       title: "Add Comment",
//       bodyType: MODAL_BODY_TYPES.ADD_COMMENT,
//       extraObject: { ticketId },
//     });
//   };

//   openAddNewTicketModal = () => {
//     this.props.openModal({
//       title: "Add New Ticket",
//       bodyType: MODAL_BODY_TYPES.TICKET_ADD_NEW,
//     });
//   };

//   openUpdateTicketModal = (ticket) => {
//     this.props.openModal({
//       title: "Update Ticket",
//       bodyType: MODAL_BODY_TYPES.TICKET_UPDATE,
//       extraObject: { ticket },
//     });
//   };

//   openAssignTicketModal = (ticketId) => {
//     this.props.openModal({
//       title: "Assign Ticket",
//       bodyType: MODAL_BODY_TYPES.ASSIGN_TICKET,
//       extraObject: { ticketId },
//     });
//   };

//   openTicketStatusChangeModal = (ticketId) => {
//     this.props.openModal({
//       title: "Status Update",
//       bodyType: MODAL_BODY_TYPES.TICKET_STATUS_UPDATE,
//       extraObject: { ticketId },
//     });
//   };

//   openConfirmTicketDelete = (ticketId) => {
//     this.props.openModal({
//       title: "Confirm Delete!",
//       bodyType: MODAL_BODY_TYPES.CONFIRMATION,
//       extraObject: {
//         ticketId,
//         type: CONFIRMATION_MODAL_CLOSE_TYPES.TICKET_DELETE,
//         message: "Deleting a Ticket, Are You sure? ",
//       },
//     });
//   };

//   openAddAttachmentModal = (ticketId) => {
//     this.props.openModal({
//       title: "Add Attachment",
//       bodyType: MODAL_BODY_TYPES.ADD_ATTACHMENT,
//       extraObject: { ticketId },
//     });
//   };

//   // Toggle comments visibility for a ticket
//   toggleComments = (ticketId) => {
//     this.setState((prevState) => ({
//       expandedTickets: {
//         ...prevState.expandedTickets,
//         [ticketId]: !prevState.expandedTickets[ticketId], // Toggle expanded state
//       },
//     }));
//   };

//   // Handle filter changes
//   handleFilterChange = (filterName, value) => {
//     this.setState((prevState) => ({
//       filters: {
//         ...prevState.filters,
//         [filterName]: value,
//       },
//     }));
//   };

//   // Handle search query change
//   handleSearchChange = (e) => {
//     this.setState({ searchQuery: e.target.value });
//   };

//   toggleFilters = () => {
//     this.setState((prevState) => ({
//       showFilters: !prevState.showFilters, // Toggle the value of showFilters
//     }));
//   };

//   // Clear all filters
//   clearFilters = () => {
//     this.setState({
//       filters: {
//         status: "",
//         priority: "",
//         category: "",
//         assignedTo: "",
//         startDate: null,
//         endDate: null,
//       },
//       searchQuery: "",
//       showFilters: false, // Toggle filters dropdown
//     });
//   };

//   // Handle sorting
//   handleSort = (key) => {
//     this.setState((prevState) => ({
//       sortConfig: {
//         key,
//         direction:
//           prevState.sortConfig.key === key &&
//           prevState.sortConfig.direction === "asc"
//             ? "desc"
//             : "asc",
//       },
//     }));
//   };

//   // Apply filters and sorting to tickets
//   getFilteredAndSortedTickets = () => {
//     const { tickets } = this.props;
//     const { filters, searchQuery, sortConfig } = this.state;

//     return tickets
//       .filter((ticket) => {
//         const matchesStatus = filters.status
//           ? ticket.status === filters.status
//           : true;
//         const matchesPriority = filters.priority
//           ? ticket.priority === filters.priority
//           : true;
//         const matchesCategory = filters.category
//           ? ticket.category === filters.category
//           : true;
//         const matchesAssignedTo = filters.assignedTo
//           ? ticket.assigned_to?._id === filters.assignedTo
//           : true;
//         const matchesDateRange =
//           filters.startDate && filters.endDate
//             ? moment(ticket.createdAt).isBetween(
//                 filters.startDate,
//                 filters.endDate,
//                 "day",
//                 "[]"
//               )
//             : true;
//         const matchesSearchQuery = searchQuery
//           ? ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
//           : true;

//         return (
//           matchesStatus &&
//           matchesPriority &&
//           matchesCategory &&
//           matchesAssignedTo &&
//           matchesDateRange &&
//           matchesSearchQuery
//         );
//       })
//       .sort((a, b) => {
//         if (sortConfig.key) {
//           const aValue = a[sortConfig.key];
//           const bValue = b[sortConfig.key];
//           if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
//           if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
//         }
//         return 0;
//       });
//   };

//   render() {
//     const {
//       loading,
//       error,
//       expandedTickets,
//       filters,
//       searchQuery,
//       sortConfig,
//       showFilters,
//     } = this.state;
//     const { tickets, users, auth } = this.props;
//     const { user } = auth;

//     const filteredAndSortedTickets = this.getFilteredAndSortedTickets();

//     if (loading) {
//       return <div>Loading...</div>;
//     }

//     if (error) {
//       return <div className="text-red-500">{error}</div>;
//     }

//     return (
//       <>
//         <TitleCard
//           title="Tickets"
//           topMargin="mt-2"
//           TopSideButtons={
//             <div className="inline-block float-right">
//               <button
//                 className="btn px-6 btn-sm normal-case btn-primary"
//                 onClick={this.openAddNewTicketModal}
//               >
//                 Add New
//               </button>
//             </div>
//           }
//         >
//           <div className="mb-4">
//             {/* Filters Dropdown Toggle */}
//             <div className="flex flex-col sm:flex-row items-center gap-4">
//               <div className="flex items-center gap-4">
//                 <button
//                   className="btn btn-sm btn-ghost flex items-center gap-2"
//                   onClick={this.toggleFilters}
//                 >
//                   <AdjustmentsHorizontalIcon className="w-5 h-5" />
//                   Filters
//                 </button>

//                 {/* Clear Filters Button */}
//                 <button
//                   className="btn btn-sm btn-ghost flex items-center gap-2"
//                   onClick={this.clearFilters}
//                 >
//                   <XMarkIcon className="w-5 h-5" />
//                   Clear Filters
//                 </button>
//               </div>

//               {/* Search Bar */}
//               <div className="relative flex-1 ">
//                 <input
//                   type="text"
//                   placeholder="Search tickets..."
//                   value={searchQuery}
//                   onChange={this.handleSearchChange}
//                   className="input input-bordered input-sm focus:w-full pl-10"
//                 />
//                 <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               </div>
//             </div>

//             {/* Filters Dropdown Content */}
//             {showFilters && ( // Conditionally render based on showFilters
//               <div className="mt-4 p-4 bg-base-200 rounded-lg">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                   {/* Status Filter */}
//                   <div>
//                     <label className="label">
//                       <span className="label-text">Status</span>
//                     </label>
//                     <select
//                       className="select select-bordered select-sm w-full"
//                       value={filters.status}
//                       onChange={(e) =>
//                         this.handleFilterChange("status", e.target.value)
//                       }
//                     >
//                       <option value="">All Statuses</option>
//                       <option value="Open">Open</option>
//                       <option value="In Progress">In Progress</option>
//                       <option value="Resolved">Resolved</option>
//                     </select>
//                   </div>

//                   {/* Priority Filter */}
//                   <div>
//                     <label className="label">
//                       <span className="label-text">Priority</span>
//                     </label>
//                     <select
//                       className="select select-bordered select-sm w-full"
//                       value={filters.priority}
//                       onChange={(e) =>
//                         this.handleFilterChange("priority", e.target.value)
//                       }
//                     >
//                       <option value="">All Priorities</option>
//                       <option value="High">High</option>
//                       <option value="Medium">Medium</option>
//                       <option value="Low">Low</option>
//                     </select>
//                   </div>

//                   {/* Assigned To Filter */}
//                   <div>
//                     <label className="label">
//                       <span className="label-text">Assigned To</span>
//                     </label>
//                     <select
//                       className="select select-bordered select-sm w-full"
//                       value={filters.assignedTo}
//                       onChange={(e) =>
//                         this.handleFilterChange("assignedTo", e.target.value)
//                       }
//                     >
//                       <option value="">All Assignees</option>
//                       {users.map((user) => (
//                         <option key={user._id} value={user._id}>
//                           {user.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Date Range Filter */}
//                   <div>
//                     <label className="label">
//                       <span className="label-text">Date Range</span>
//                     </label>
//                     <div className="flex gap-2">
//                       <DatePicker
//                         selected={filters.startDate}
//                         onChange={(date) =>
//                           this.handleFilterChange("startDate", date)
//                         }
//                         selectsStart
//                         startDate={filters.startDate}
//                         endDate={filters.endDate}
//                         placeholderText="Start Date"
//                         className="input input-bordered input-sm w-full"
//                       />
//                       <DatePicker
//                         selected={filters.endDate}
//                         onChange={(date) =>
//                           this.handleFilterChange("endDate", date)
//                         }
//                         selectsEnd
//                         startDate={filters.startDate}
//                         endDate={filters.endDate}
//                         minDate={filters.startDate}
//                         placeholderText="End Date"
//                         className="input input-bordered input-sm w-full"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Tickets Table */}
//           <div className="overflow-x-auto w-full">
//             <table className="table w-full">
//               <thead>
//                 <tr>
//                   <th onClick={() => this.handleSort("title")}>
//                     Title
//                     {this.state.sortConfig.key === "title" &&
//                       (this.state.sortConfig.direction === "asc" ? (
//                         <BarsArrowUpIcon className="inline-block w-4 h-4 ml-1" />
//                       ) : (
//                         <BarsArrowDownIcon className="inline-block w-4 h-4 ml-1" />
//                       ))}
//                   </th>
//                   <th onClick={() => this.handleSort("status")}>
//                     Status
//                     {this.state.sortConfig.key === "status" &&
//                       (this.state.sortConfig.direction === "asc" ? (
//                         <BarsArrowUpIcon className="inline-block w-4 h-4 ml-1" />
//                       ) : (
//                         <BarsArrowDownIcon className="inline-block w-4 h-4 ml-1" />
//                       ))}
//                   </th>
//                   <th>Priority</th>
//                   <th>Created By</th>
//                   <th onClick={() => this.handleSort("createdAt")}>
//                     Created At
//                     {this.state.sortConfig.key === "createdAt" &&
//                       (this.state.sortConfig.direction === "asc" ? (
//                         <BarsArrowUpIcon className="inline-block w-4 h-4 ml-1" />
//                       ) : (
//                         <BarsArrowDownIcon className="inline-block w-4 h-4 ml-1" />
//                       ))}
//                   </th>
//                   <th>Assigned To</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredAndSortedTickets.map((ticket) => (
//                   <React.Fragment key={ticket._id}>
//                     <tr>
//                       <td>{ticket.title}</td>
//                       <td>
//                         <div
//                           className={`badge ${
//                             ticket.status === "Open"
//                               ? "badge-secondary"
//                               : ticket.status === "In Progress"
//                               ? "badge-accent"
//                               : ticket.status === "Resolved"
//                               ? "badge-primary"
//                               : "badge-gray" // Default class for other statuses
//                           }`}
//                         >
//                           {ticket.status.replace(" ", "")}
//                         </div>
//                       </td>
//                       <td>{ticket.priority}</td>
//                       <td>{ticket.created_by?.name}</td>
//                       <td>{moment(ticket.createdAt).format("DD MMM YY")}</td>
//                       <td>{ticket.assigned_to?.name || "None"}</td>
//                       <td>
//                         <div className="flex space-x-2">
//                           <button
//                             className="btn btn-ghost btn-sm"
//                             onClick={() => this.openAddCommentModal(ticket._id)}
//                           >
//                             <ChatBubbleLeftIcon className="w-5" />
//                           </button>

//                           {/* Assign Ticket Button (only for admins) */}
//                           <TicketActions
//                             ticket={ticket}
//                             user={user}
//                             openAssignTicketModal={this.openAssignTicketModal}
//                             openUpdateTicketModal={this.openUpdateTicketModal}
//                             openTicketStatusChangeModal={
//                               this.openTicketStatusChangeModal
//                             }
//                             openConfirmTicketDelete={
//                               this.openConfirmTicketDelete
//                             }
//                           />

//                           {/* Toggle Comments Button */}
//                           <button
//                             className="btn btn-ghost btn-sm"
//                             onClick={() => this.toggleComments(ticket._id)}
//                           >
//                             {expandedTickets[ticket._id] ? (
//                               <ChevronUpIcon className="w-5" />
//                             ) : (
//                               <ChevronDownIcon className="w-5" />
//                             )}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>

//                     {/* Expanded Section for Comments and Attachments */}
//                     {expandedTickets[ticket._id] && (
//                       <tr>
//                         <td colSpan="7">
//                           <div className="p-4 bg-gray-50 dark:bg-transparent">
//                             <h3 className="font-semibold mb-2">Description</h3>
//                             <p className="p-3">{ticket.description}</p>

//                             {/* Attachments Section */}
//                             <h3 className="font-semibold mb-2">Attachments</h3>

//                             <AttachmentsPreview
//                               attachments={ticket.attachments}
//                               ticketId={ticket._id}
//                               status={ticket.status}
//                             />

//                             {/* Comments Section */}
//                             <h3 className="font-semibold mt-4 mb-2">
//                               Comments
//                             </h3>
//                             {ticket.comments.length > 0 ? (
//                               ticket.comments.map((comment) => (
//                                 <div
//                                   key={comment._id}
//                                   className="mb-4 p-3 bg-white dark:bg-transparent rounded-lg shadow-sm"
//                                 >
//                                   <p className="text-sm">{comment.text}</p>
//                                   <p className="text-xs text-gray-500 mt-1">
//                                     By:{" "}
//                                     {users.find(
//                                       (user) => user._id === comment.created_by
//                                     )?.name || "Unknown"}{" "}
//                                     on{" "}
//                                     {moment(comment.createdAt).format(
//                                       "DD MMM YY, h:mm A"
//                                     )}
//                                   </p>
//                                 </div>
//                               ))
//                             ) : (
//                               <p className="text-gray-500">No comments yet.</p>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//             <div className="pt-12"></div>
//           </div>
//         </TitleCard>
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   auth: state.auth,
//   users: state.user.users,
//   tickets: state.ticket.tickets,
// });

// const mapDispatchToProps = {
//   openModal,
//   getUsersContent,
//   setPageTitle,
//   showNotification,
//   getTickets,
//   addCommentToTicket,
//   changeTicketStatus,
//   updateTicket,
//   deleteTicket,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(TicketsList);
import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import TitleCard from "../components/TitleCard";
import { openModal } from "../redux/slices/modalSlice";
import { setPageTitle } from "../redux/slices/headerSlice";
import {
  getTickets,
  addCommentToTicket,
  changeTicketStatus,
  updateTicket,
  deleteTicket,
} from "../redux/slices/ticketSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../utils/globalConstantUtil";
import { getUsersContent } from "../redux/slices/userSlice";
import { showNotification } from "../redux/slices/headerSlice";
import {
  AdjustmentsHorizontalIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  ChatBubbleLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import TicketActions from "../components/TicketActions";
import AttachmentsPreview from "../utils/AttachmentsPreview";
import DatePicker from "react-datepicker"; // For date range filter
import "react-datepicker/dist/react-datepicker.css"; // Date picker styles

class TicketsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      expandedTickets: {}, // Track which tickets are expanded to show comments
      filters: {
        status: "",
        priority: "",
        category: "",
        assignedTo: "",
        startDate: null,
        endDate: null,
      },
      searchQuery: "",
      sortConfig: {
        key: null,
        direction: "asc", // 'asc' or 'desc'
      },
      showFilters: false, // Toggle filters dropdown
      currentPage: 1, // Current page for pagination
      itemsPerPage: 9, // Number of items to display per page
    };
  }

  // Open modals for various actions
  openAddCommentModal = (ticketId) => {
    this.props.openModal({
      title: "Add Comment",
      bodyType: MODAL_BODY_TYPES.ADD_COMMENT,
      extraObject: { ticketId },
    });
  };

  openAddNewTicketModal = () => {
    this.props.openModal({
      title: "Add New Ticket",
      bodyType: MODAL_BODY_TYPES.TICKET_ADD_NEW,
    });
  };

  openUpdateTicketModal = (ticket) => {
    this.props.openModal({
      title: "Update Ticket",
      bodyType: MODAL_BODY_TYPES.TICKET_UPDATE,
      extraObject: { ticket },
    });
  };

  openAssignTicketModal = (ticketId) => {
    this.props.openModal({
      title: "Assign Ticket",
      bodyType: MODAL_BODY_TYPES.ASSIGN_TICKET,
      extraObject: { ticketId },
    });
  };

  openTicketStatusChangeModal = (ticketId) => {
    this.props.openModal({
      title: "Status Update",
      bodyType: MODAL_BODY_TYPES.TICKET_STATUS_UPDATE,
      extraObject: { ticketId },
    });
  };

  openConfirmTicketDelete = (ticketId) => {
    this.props.openModal({
      title: "Confirm Delete!",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        ticketId,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.TICKET_DELETE,
        message: "Deleting a Ticket, Are You sure? ",
      },
    });
  };

  openAddAttachmentModal = (ticketId) => {
    this.props.openModal({
      title: "Add Attachment",
      bodyType: MODAL_BODY_TYPES.ADD_ATTACHMENT,
      extraObject: { ticketId },
    });
  };

  // Toggle comments visibility for a ticket
  toggleComments = (ticketId) => {
    this.setState((prevState) => ({
      expandedTickets: {
        ...prevState.expandedTickets,
        [ticketId]: !prevState.expandedTickets[ticketId], // Toggle expanded state
      },
    }));
  };

  // Handle filter changes
  handleFilterChange = (filterName, value) => {
    this.setState((prevState) => ({
      filters: {
        ...prevState.filters,
        [filterName]: value,
      },
      currentPage: 1, // Reset to the first page when filters change
    }));
  };

  // Handle search query change
  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value, currentPage: 1 }); // Reset to the first page when search query changes
  };

  toggleFilters = () => {
    this.setState((prevState) => ({
      showFilters: !prevState.showFilters, // Toggle the value of showFilters
    }));
  };

  // Clear all filters
  clearFilters = () => {
    this.setState({
      filters: {
        status: "",
        priority: "",
        category: "",
        assignedTo: "",
        startDate: null,
        endDate: null,
      },
      searchQuery: "",
      showFilters: false, // Toggle filters dropdown
      currentPage: 1, // Reset to the first page when filters are cleared
      sortConfig: {
        key: null,
        direction: "asc", // 'asc' or 'desc'
      },
    });
  };

  // Handle sorting
  handleSort = (key) => {
    this.setState((prevState) => ({
      sortConfig: {
        key,
        direction:
          prevState.sortConfig.key === key &&
          prevState.sortConfig.direction === "asc"
            ? "desc"
            : "asc",
      },
    }));
  };

  // Handle page change
  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  // Apply filters and sorting to tickets
  getFilteredAndSortedTickets = () => {
    const { tickets } = this.props;
    const { filters, searchQuery, sortConfig } = this.state;

    return (
      tickets !== null &&
      tickets
        .filter((ticket) => {
          const matchesStatus = filters.status
            ? ticket.status === filters.status
            : true;
          const matchesPriority = filters.priority
            ? ticket.priority === filters.priority
            : true;
          const matchesCategory = filters.category
            ? ticket.category === filters.category
            : true;
          const matchesAssignedTo = filters.assignedTo
            ? ticket.assigned_to?._id === filters.assignedTo
            : true;
          const matchesDateRange =
            filters.startDate && filters.endDate
              ? moment(ticket.createdAt).isBetween(
                  filters.startDate,
                  filters.endDate,
                  "day",
                  "[]"
                )
              : true;
          const matchesSearchQuery = searchQuery
            ? ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              ticket.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            : true;

          return (
            matchesStatus &&
            matchesPriority &&
            matchesCategory &&
            matchesAssignedTo &&
            matchesDateRange &&
            matchesSearchQuery
          );
        })
        .sort((a, b) => {
          if (sortConfig.key) {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        })
    );
  };

  render() {
    const {
      loading,
      error,
      expandedTickets,
      filters,
      searchQuery,
      sortConfig,
      showFilters,
      currentPage,
      itemsPerPage,
    } = this.state;
    const { tickets, users, auth } = this.props;
    const { user } = auth;

    const filteredAndSortedTickets = this.getFilteredAndSortedTickets();

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTickets =
      filteredAndSortedTickets !== null &&
      filteredAndSortedTickets.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(
      filteredAndSortedTickets.length / itemsPerPage
    );

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    return (
      <>
        <TitleCard
          title="Tickets"
          topMargin="mt-2"
          TopSideButtons={
            <div className="inline-block float-right">
              <button
                className="btn px-6 btn-sm normal-case btn-primary"
                onClick={this.openAddNewTicketModal}
              >
                Add New
              </button>
            </div>
          }
        >
          <div className="mb-4">
            {/* Filters Dropdown Toggle */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-4">
                <button
                  className="btn btn-sm btn-ghost flex items-center gap-2"
                  onClick={this.toggleFilters}
                >
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  Filters
                </button>

                {/* Clear Filters Button */}
                <button
                  className="btn btn-sm btn-ghost flex items-center gap-2"
                  onClick={this.clearFilters}
                >
                  <XMarkIcon className="w-5 h-5" />
                  Clear Filters
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 ">
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={this.handleSearchChange}
                  className="input input-bordered input-sm focus:w-full  pl-10"
                />
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Filters Dropdown Content */}
            {showFilters && ( // Conditionally render based on showFilters
              <div className="mt-4 p-4 bg-base-200 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="label">
                      <span className="label-text">Status</span>
                    </label>
                    <select
                      className="select select-bordered select-sm w-full"
                      value={filters.status}
                      onChange={(e) =>
                        this.handleFilterChange("status", e.target.value)
                      }
                    >
                      <option value="">All Statuses</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <label className="label">
                      <span className="label-text">Priority</span>
                    </label>
                    <select
                      className="select select-bordered select-sm w-full"
                      value={filters.priority}
                      onChange={(e) =>
                        this.handleFilterChange("priority", e.target.value)
                      }
                    >
                      <option value="">All Priorities</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  {/* Assigned To Filter */}
                  <div>
                    <label className="label">
                      <span className="label-text">Assigned To</span>
                    </label>
                    <select
                      className="select select-bordered select-sm w-full"
                      value={filters.assignedTo}
                      onChange={(e) =>
                        this.handleFilterChange("assignedTo", e.target.value)
                      }
                    >
                      <option value="">All Assignees</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="label">
                      <span className="label-text">Date Range</span>
                    </label>
                    <div className="flex gap-2">
                      <DatePicker
                        selected={filters.startDate}
                        onChange={(date) =>
                          this.handleFilterChange("startDate", date)
                        }
                        selectsStart
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        placeholderText="Start Date"
                        className="input input-bordered input-sm w-full"
                      />
                      <DatePicker
                        selected={filters.endDate}
                        onChange={(date) =>
                          this.handleFilterChange("endDate", date)
                        }
                        selectsEnd
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        minDate={filters.startDate}
                        placeholderText="End Date"
                        className="input input-bordered input-sm w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tickets Table */}
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th onClick={() => this.handleSort("title")}>
                    Title
                    {this.state.sortConfig.key === "title" &&
                      (this.state.sortConfig.direction === "asc" ? (
                        <BarsArrowUpIcon className="inline-block w-4 h-4 ml-1" />
                      ) : (
                        <BarsArrowDownIcon className="inline-block w-4 h-4 ml-1" />
                      ))}
                  </th>
                  <th onClick={() => this.handleSort("status")}>
                    Status
                    {this.state.sortConfig.key === "status" &&
                      (this.state.sortConfig.direction === "asc" ? (
                        <BarsArrowUpIcon className="inline-block w-4 h-4 ml-1" />
                      ) : (
                        <BarsArrowDownIcon className="inline-block w-4 h-4 ml-1" />
                      ))}
                  </th>
                  <th>Priority</th>
                  <th>Created By</th>
                  <th onClick={() => this.handleSort("createdAt")}>
                    Created At
                    {this.state.sortConfig.key === "createdAt" &&
                      (this.state.sortConfig.direction === "asc" ? (
                        <BarsArrowUpIcon className="inline-block w-4 h-4 ml-1" />
                      ) : (
                        <BarsArrowDownIcon className="inline-block w-4 h-4 ml-1" />
                      ))}
                  </th>
                  <th>Assigned To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTickets.map((ticket) => (
                  <React.Fragment key={ticket._id}>
                    <tr>
                      <td>{ticket.title}</td>
                      <td>
                        <div
                          className={`badge ${
                            ticket.status === "Open"
                              ? "badge-secondary"
                              : ticket.status === "In Progress"
                              ? "badge-accent"
                              : ticket.status === "Resolved"
                              ? "badge-primary"
                              : "badge-gray" // Default class for other statuses
                          }`}
                        >
                          {ticket.status.replace(" ", "")}
                        </div>
                      </td>
                      <td>{ticket.priority}</td>
                      <td>{ticket.created_by?.name}</td>
                      <td>{moment(ticket.createdAt).format("DD MMM YY")}</td>
                      <td>{ticket.assigned_to?.name || "None"}</td>
                      <td>
                        <div className="flex space-x-2">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => this.openAddCommentModal(ticket._id)}
                          >
                            <ChatBubbleLeftIcon className="w-5" />
                          </button>

                          {/* Assign Ticket Button (only for admins) */}
                          <TicketActions
                            ticket={ticket}
                            user={user}
                            openAssignTicketModal={this.openAssignTicketModal}
                            openUpdateTicketModal={this.openUpdateTicketModal}
                            openTicketStatusChangeModal={
                              this.openTicketStatusChangeModal
                            }
                            openConfirmTicketDelete={
                              this.openConfirmTicketDelete
                            }
                          />

                          {/* Toggle Comments Button */}
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => this.toggleComments(ticket._id)}
                          >
                            {expandedTickets[ticket._id] ? (
                              <ChevronUpIcon className="w-5" />
                            ) : (
                              <ChevronDownIcon className="w-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Section for Comments and Attachments */}
                    {expandedTickets[ticket._id] && (
                      <tr>
                        <td colSpan="7">
                          <div className="p-4 bg-gray-50 dark:bg-transparent">
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="p-3">{ticket.description}</p>

                            {/* Attachments Section */}
                            <h3 className="font-semibold mb-2">Attachments</h3>

                            <AttachmentsPreview
                              attachments={ticket.attachments}
                              ticketId={ticket._id}
                              status={ticket.status}
                            />

                            {/* Comments Section */}
                            <h3 className="font-semibold mt-4 mb-2">
                              Comments
                            </h3>
                            {ticket.comments.length > 0 ? (
                              ticket.comments.map((comment) => (
                                <div
                                  key={comment._id}
                                  className="mb-4 p-3 bg-white dark:bg-transparent rounded-lg shadow-sm"
                                >
                                  <p className="text-sm">{comment.text}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    By:{" "}
                                    {users.find(
                                      (user) => user._id === comment.created_by
                                    )?.name || "Unknown"}{" "}
                                    on{" "}
                                    {moment(comment.createdAt).format(
                                      "DD MMM YY, h:mm A"
                                    )}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500">No comments yet.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
              <div className="join">
                <button
                  className="join-item btn btn-sm btn-outline"
                  onClick={() => this.handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`join-item btn btn-sm ${
                      currentPage === index + 1 ? "btn-primary" : "btn-outline"
                    }`}
                    onClick={() => this.handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="join-item btn btn-sm btn-outline"
                  onClick={() => this.handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </TitleCard>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  users: state.user.users,
  tickets: state.ticket.tickets,
});

const mapDispatchToProps = {
  openModal,
  getUsersContent,
  setPageTitle,
  showNotification,
  getTickets,
  addCommentToTicket,
  changeTicketStatus,
  updateTicket,
  deleteTicket,
};

export default connect(mapStateToProps, mapDispatchToProps)(TicketsList);

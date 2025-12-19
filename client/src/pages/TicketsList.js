import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, parseISO, isWithinInterval } from "date-fns";
import TitleCard from "../components/TitleCard";
import { openModal } from "../redux/slices/modalSlice";
import { setPageTitle } from "../redux/slices/headerSlice";
import { openRightDrawer } from "../redux/slices/rightDrawerSlice";
import {
  getTickets,
  updateTicket,
} from "../redux/slices/ticketSlice";
import { addCommentApi } from "../utils/api";
import { toast } from "react-toastify";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
  RIGHT_DRAWER_TYPES,
} from "../utils/globalConstantUtil";
import {
  BarsArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  BarsArrowDownIcon,
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import TicketActions from "../components/TicketActions";
import AttachmentsPreview from "../utils/AttachmentsPreview";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ReplyIcon, UploadIcon } from "lucide-react";

function TicketsList() {
  const dispatch = useDispatch();
  const { tickets, ticketstatus, error } = useSelector((state) => state.ticket);
  const { users } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const [expandedTickets, setExpandedTickets] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    assignedTo: "",
    startDate: null,
    endDate: null,
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    dispatch(setPageTitle({ title: "Tickets List" }));
    // eslint-disable-next-line
  }, []);

  // Modal Actions
  const openAddNewTicketModal = () => {
    dispatch(openModal({
      title: "Add New Ticket",
      bodyType: MODAL_BODY_TYPES.TICKET_ADD_NEW,
    }));
  };



  const openUpdateTicketModal = (ticket) => {
    dispatch(openModal({
      title: "Update Ticket",
      bodyType: MODAL_BODY_TYPES.TICKET_UPDATE,
      extraObject: { ticket },
    }));
  };

  const openAssignTicketModal = (ticketId) => {
    dispatch(openModal({
      title: "Assign Ticket",
      bodyType: MODAL_BODY_TYPES.ASSIGN_TICKET,
      extraObject: { ticketId },
    }));
  };

  const openTicketStatusChangeModal = (ticketId) => {
    dispatch(openModal({
      title: "Status Update",
      bodyType: MODAL_BODY_TYPES.TICKET_STATUS_UPDATE,
      extraObject: { ticketId },
    }));
  };

  const openConfirmTicketDelete = (ticketId) => {
    dispatch(openModal({
      title: "Confirm Delete!",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        ticketId,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.TICKET_DELETE,
        message: "Deleting a Ticket, Are You sure? ",
      },
    }));
  };

  const openAutoAssignTicketModal = (ticketId) => {
    dispatch(openModal({
      title: "Auto Assign Ticket",
      bodyType: MODAL_BODY_TYPES.AUTO_ASSIGN_TICKET,
      extraObject: { ticketId },
    }));
  };

  const [replyState, setReplyState] = useState({});
  const [commentLoading, setCommentLoading] = useState({});

  const handleReplyClick = (ticketId, comment) => {
    setReplyState(prev => ({
      ...prev,
      [ticketId]: {
        text: "",
        parentCommentId: comment._id,
        replyingToName: comment.created_by?.name
      }
    }));
  };

  const handleCancelReply = (ticketId) => {
    setReplyState(prev => ({
      ...prev,
      [ticketId]: { ...prev[ticketId], parentCommentId: null, replyingToName: null }
    }));
  };

  const handleCommentChange = (ticketId, text) => {
    setReplyState(prev => ({
      ...prev,
      [ticketId]: { ...prev[ticketId], text }
    }));
  };

  const handleSubmitComment = async (ticketId) => {
    const state = replyState[ticketId] || {};
    const text = state.text || "";
    const parentCommentId = state.parentCommentId;

    if (!text.trim()) return toast.error("Comment cannot be empty");

    setCommentLoading(prev => ({ ...prev, [ticketId]: true }));
    try {
      const updatedTicket = await addCommentApi(ticketId, text, parentCommentId);
      dispatch(updateTicket(updatedTicket));
      toast.success("Comment added!");
      setReplyState(prev => ({ ...prev, [ticketId]: { text: "", parentCommentId: null, replyingToName: null } }));
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setCommentLoading(prev => ({ ...prev, [ticketId]: false }));
    }
  };

  // Toggle Handlers
  const toggleComments = (ticketId) => {
    setExpandedTickets(prev => ({ ...prev, [ticketId]: !prev[ticketId] }));
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  // Filter Logic
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      priority: "",
      category: "",
      assignedTo: "",
      startDate: null,
      endDate: null,
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getFilteredAndSortedTickets = () => {
    if (!tickets) return [];

    return tickets.filter(ticket => {
      const matchesStatus = filters.status ? ticket.status === filters.status : true;
      const matchesPriority = filters.priority ? ticket.priority === filters.priority : true;
      const matchesAssignedTo = filters.assignedTo ? ticket.assigned_to?._id === filters.assignedTo : true;
      const matchesSearch = searchQuery ?
        (ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchQuery.toLowerCase())) : true;

      let matchesDate = true;
      if (filters.startDate && filters.endDate) {
        const ticketDate = typeof ticket.createdAt === 'string' ? parseISO(ticket.createdAt) : ticket.createdAt;
        matchesDate = isWithinInterval(ticketDate, {
          start: filters.startDate,
          end: filters.endDate
        });
      }

      return matchesStatus && matchesPriority && matchesAssignedTo && matchesSearch && matchesDate;
    }).sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredTickets = getFilteredAndSortedTickets();
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  if (ticketstatus === 'loading') return <div className="p-4 text-center">Loading tickets...</div>;
  if (error) return <div className="p-4 text-center text-error">{error}</div>;

  return (
    <>
      <TitleCard
        title="Tickets Management"
        topMargin="mt-2"
        TopSideButtons={
          <button className="btn btn-primary btn-sm px-6" onClick={openAddNewTicketModal}>
            <UploadIcon className="w-4 h-4 mr-2" /> New Ticket
          </button>
        }
      >
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center">
          <div className="flex gap-2">
            <button className={`btn btn-sm ${showFilters ? 'btn-neutral' : 'btn-ghost'}`} onClick={toggleFilters}>
              <AdjustmentsHorizontalIcon className="w-4 h-4" /> Filters
            </button>
            {(filters.status || filters.priority || filters.assignedTo || searchQuery) && (
              <button className="btn btn-sm btn-ghost text-error" onClick={clearFilters}>
                <XMarkIcon className="w-4 h-4" /> Clear
              </button>
            )}
          </div>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search tickets..."
              className="input input-bordered input-sm w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-2.5 text-base-content/50" />
          </div>
        </div>

        {/* Filters Drawer */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-base-200 rounded-lg mb-6 animate-fade-in-down">
            <div className="form-control">
              <label className="label"><span className="label-text">Status</span></label>
              <select className="select select-bordered select-sm" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                <option value="">All</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Priority</span></label>
              <select className="select select-bordered select-sm" value={filters.priority} onChange={(e) => handleFilterChange('priority', e.target.value)}>
                <option value="">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Assigned To</span></label>
              <select className="select select-bordered select-sm" value={filters.assignedTo} onChange={(e) => handleFilterChange('assignedTo', e.target.value)}>
                <option value="">All</option>
                {users?.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Date Range</span></label>
              <div className="flex gap-2">
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  selectsStart startDate={filters.startDate} endDate={filters.endDate}
                  className="input input-bordered input-sm w-full"
                  placeholderText="Start"
                />
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  selectsEnd startDate={filters.startDate} endDate={filters.endDate}
                  className="input input-bordered input-sm w-full"
                  placeholderText="End"
                />
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200">
                <th className="cursor-pointer" onClick={() => handleSort('title')}>Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? <BarsArrowUpIcon className="inline w-3 h-3" /> : <BarsArrowDownIcon className="inline w-3 h-3" />)}</th>
                <th className="cursor-pointer" onClick={() => handleSort('status')}>Status</th>
                <th>Priority</th>
                <th>Created By</th>
                <th className="cursor-pointer" onClick={() => handleSort('createdAt')}>Created At</th>
                <th>Assigned To</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTickets.map(ticket => (
                <React.Fragment key={ticket._id}>
                  <tr className="hover:bg-base-200/50 transition-colors">
                    <td className="font-medium">{ticket.title}</td>
                    <td>
                      <div className={`badge badge-sm font-semibold ${ticket.status === 'Open' ? 'badge-error badge-outline' :
                        ticket.status === 'In Progress' ? 'badge-warning badge-outline' :
                          'badge-success badge-outline'
                        }`}>
                        {ticket.status}
                      </div>
                    </td>
                    <td>
                      <div className={`badge badge-sm ${ticket.priority === 'High' ? 'badge-error' :
                        ticket.priority === 'Medium' ? 'badge-warning' :
                          'badge-info'
                        } text-white`}>
                        {ticket.priority}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                          <div className="bg-neutral-focus text-neutral-content rounded-full w-6">
                            <span className="text-xs">{ticket.created_by?.name?.charAt(0)}</span>
                          </div>
                        </div>
                        <span className="text-sm">{ticket.created_by?.name}</span>
                      </div>
                    </td>
                    <td className="text-sm text-base-content/70">
                      {format(parseISO(ticket.createdAt), "dd MMM yyyy")}
                    </td>
                    <td className="text-sm">
                      {ticket.assigned_to ? ticket.assigned_to.name : <span className="opacity-50 italic">Unassigned</span>}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button className="btn btn-ghost btn-xs tooltip" data-tip="Comments" onClick={() => toggleComments(ticket._id)}>
                          <ChatBubbleLeftIcon className="w-4 h-4" />
                        </button>
                        <TicketActions
                          ticket={ticket}
                          user={user}
                          openAssignTicketModal={openAssignTicketModal}
                          openUpdateTicketModal={openUpdateTicketModal}
                          openTicketStatusChangeModal={openTicketStatusChangeModal}
                          openConfirmTicketDelete={openConfirmTicketDelete}
                          openAutoAssignTicketModal={openAutoAssignTicketModal}
                        />
                        <button className="btn btn-ghost btn-xs" onClick={() => toggleComments(ticket._id)}>
                          {expandedTickets[ticket._id] ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Details */}
                  {expandedTickets[ticket._id] && (
                    <tr className="bg-base-200/30">
                      <td colSpan="7" className="p-0">
                        <div className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Description & Attachments */}
                            <div>
                              <h4 className="font-bold mb-2 text-sm text-base-content/70 uppercase">Description</h4>
                              <p className="text-sm mb-4 bg-base-100 p-3 rounded-lg border border-base-200">
                                {ticket.description}
                              </p>

                              <h4 className="font-bold mb-2 text-sm text-base-content/70 uppercase">Attachments</h4>
                              <AttachmentsPreview
                                attachments={ticket.attachments}
                                ticketId={ticket._id}
                                status={ticket.status}
                              />
                            </div>

                            {/* Comments */}
                            <div>
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="font-bold text-sm text-base-content/70 uppercase">Discussion</h4>
                              </div>

                              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                {ticket.comments?.length > 0 ? ticket.comments.map(comment => (
                                  <div key={comment._id} className="chat chat-start">
                                    <div className="chat-header text-xs opacity-50 mb-1">
                                      {comment.created_by?.name} • {format(parseISO(comment.createdAt), "MMM d, HH:mm")}
                                    </div>
                                    <div className="chat-bubble chat-bubble-secondary chat-bubble-sm">
                                      {comment.text}
                                    </div>
                                    <div className="chat-footer opacity-50 text-xs flex gap-2 mt-1">
                                      <button className="hover:text-primary flex items-center gap-1" onClick={() => handleReplyClick(ticket._id, comment)}>
                                        <ReplyIcon className="w-3 h-3" /> Reply
                                      </button>
                                      {comment.replies?.length > 0 && (
                                        <button className="hover:text-primary" onClick={() => toggleReplies(comment._id)}>
                                          {expandedReplies[comment._id] ? "Hide Replies" : `${comment.replies.length} Replies`}
                                        </button>
                                      )}
                                    </div>

                                    {/* Replies */}
                                    {expandedReplies[comment._id] && comment.replies?.length > 0 && (
                                      <div className="ml-4 mt-2 space-y-2 border-l-2 border-base-300 pl-3">
                                        {(comment.replies || []).map(reply => (
                                          <div key={reply._id} className="text-sm bg-base-100 p-2 rounded">
                                            <div className="font-bold text-xs">{reply.created_by?.name}</div>
                                            <div className="text-xs opacity-70 mb-1">{format(parseISO(reply.createdAt), "MMM d, HH:mm")}</div>
                                            <div>{reply.text}</div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )) : (
                                  <div className="text-center py-4 text-base-content/30 italic">No comments yet</div>
                                )}

                              </div>

                              {/* Inline Comment Input */}
                              <div className="mt-4 p-4 bg-base-100 rounded-lg border border-base-200">
                                {replyState[ticket._id]?.parentCommentId && (
                                  <div className="flex justify-between items-center mb-2 text-xs bg-base-200 p-2 rounded">
                                    <span>Replying to <b>{replyState[ticket._id].replyingToName}</b></span>
                                    <button onClick={() => handleCancelReply(ticket._id)} className="btn btn-ghost btn-xs text-error">Cancel</button>
                                  </div>
                                )}
                                <div className="flex gap-2 items-start">
                                  <textarea
                                    className="textarea textarea-bordered w-full h-20 resize-none focus:outline-none"
                                    placeholder={replyState[ticket._id]?.parentCommentId ? "Write a reply..." : "Write a comment..."}
                                    value={replyState[ticket._id]?.text || ""}
                                    onChange={(e) => handleCommentChange(ticket._id, e.target.value)}
                                  />
                                  <button
                                    className="btn btn-primary h-20"
                                    disabled={commentLoading[ticket._id]}
                                    onClick={() => handleSubmitComment(ticket._id)}
                                  >
                                    {commentLoading[ticket._id] ? <span className="loading loading-spinner"></span> : <PaperAirplaneIcon className="w-6 h-6 -rotate-45" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 btn-group">
          <button className="btn btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>«</button>
          <button className="btn btn-sm">Page {currentPage}</button>
          <button className="btn btn-sm" disabled={paginatedTickets.length < itemsPerPage} onClick={() => setCurrentPage(p => p + 1)}>»</button>
        </div>
      </TitleCard>
    </>
  );
}

export default TicketsList;

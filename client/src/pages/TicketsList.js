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
import { toast } from "sonner";
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
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-0">
        <div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight text-base-content flex items-center gap-3">
            <span className="w-2 h-8 bg-primary rounded-full hidden md:block" />
            Tickets Management
          </h1>
          <p className="text-base-content opacity-40 text-sm font-medium mt-1">Review and manage support requests</p>
        </div>
        <button
          className="btn btn-primary h-12 px-6 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold"
          onClick={openAddNewTicketModal}
        >
          <UploadIcon className="w-4 h-4 mr-2" /> New Ticket
        </button>
      </div>

      <div className="minimal-card rounded-3xl overflow-hidden border border-base-content/5">
        {/* Toolbar */}
        <div className="p-4 md:p-6 border-b border-base-content/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-base-content/[0.01]">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              className={`btn btn-sm h-10 px-4 rounded-xl border-base-content/10 hover:bg-base-content/10 transition-all ${showFilters ? 'bg-primary/20 text-primary border-primary/20 shadow-lg shadow-primary/10' : 'bg-transparent text-base-content'}`}
              onClick={toggleFilters}
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" /> Filters
            </button>
            {(filters.status || filters.priority || filters.assignedTo || searchQuery) && (
              <button className="btn btn-sm h-10 px-4 rounded-xl btn-ghost text-error/80 hover:bg-error/10" onClick={clearFilters}>
                <XMarkIcon className="w-4 h-4 mr-2" /> Clear
              </button>
            )}
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by title or description..."
              className="w-full h-11 bg-base-200 border border-base-content/10 rounded-xl pl-11 pr-4 text-sm focus:border-primary/40 focus:bg-base-200/80 transition-all outline-none text-base-content font-medium placeholder:text-base-content/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/20" />
          </div>
        </div>

        {/* Filters Drawer */}
        {showFilters && (
          <div className="p-6 bg-base-content/[0.02] border-b border-base-content/5 grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top duration-300">
            <div className="form-control w-full">
              <label className="label py-1"><span className="label-text text-[10px] font-bold uppercase tracking-widest text-base-content/30">Status</span></label>
              <select className="select select-bordered select-sm bg-base-200 border-base-content/10 h-10 rounded-xl" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label py-1"><span className="label-text text-[10px] font-bold uppercase tracking-widest text-base-content/30">Priority</span></label>
              <select className="select select-bordered select-sm bg-base-200 border-base-content/10 h-10 rounded-xl" value={filters.priority} onChange={(e) => handleFilterChange('priority', e.target.value)}>
                <option value="">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label py-1"><span className="label-text text-[10px] font-bold uppercase tracking-widest text-base-content/30">Assignee</span></label>
              <select className="select select-bordered select-sm bg-base-200 border-base-content/10 h-10 rounded-xl" value={filters.assignedTo} onChange={(e) => handleFilterChange('assignedTo', e.target.value)}>
                <option value="">Anyone</option>
                {users?.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label py-1"><span className="label-text text-[10px] font-bold uppercase tracking-widest text-base-content/30">Date Range</span></label>
              <div className="flex gap-2">
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  selectsStart startDate={filters.startDate} endDate={filters.endDate}
                  className="w-full h-10 bg-base-200 border border-base-content/10 rounded-xl px-3 text-xs text-base-content focus:border-primary/40 transition-all outline-none"
                  placeholderText="Start"
                />
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  selectsEnd startDate={filters.startDate} endDate={filters.endDate}
                  className="w-full h-10 bg-base-200 border border-base-content/10 rounded-xl px-3 text-xs text-base-content focus:border-primary/40 transition-all outline-none"
                  placeholderText="End"
                />
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto w-full">
          <table className="table w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-base-content/[0.01] border-b border-base-content/5">
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-[0.1em] text-base-content/30 border-b border-base-content/5 cursor-pointer hover:text-base-content transition-colors" onClick={() => handleSort('title')}>
                  Ticket Information {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? <ChevronUpIcon className="inline w-3 h-3 ml-1" /> : <ChevronDownIcon className="inline w-3 h-3 ml-1" />)}
                </th>
                <th className="py-4 px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-base-content/30 border-b border-base-content/5">Status</th>
                <th className="py-4 px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-base-content/30 border-b border-base-content/5">Priority</th>
                <th className="py-4 px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-base-content/30 border-b border-base-content/5">Reporter</th>
                <th className="py-4 px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-base-content/30 border-b border-base-content/5 cursor-pointer hover:text-base-content transition-colors" onClick={() => handleSort('createdAt')}>
                  Creation Date {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? <ChevronUpIcon className="inline w-3 h-3 ml-1" /> : <ChevronDownIcon className="inline w-3 h-3 ml-1" />)}
                </th>
                <th className="py-4 px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-base-content/30 border-b border-base-content/5">Assignee</th>
                <th className="py-4 px-6 text-right text-[11px] font-bold uppercase tracking-[0.1em] text-base-content/30 border-b border-base-content/5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-content/5">
              {paginatedTickets.map(ticket => (
                <React.Fragment key={ticket._id}>
                  <tr className={`group transition-all duration-300 hover:bg-base-content/[0.03] ${expandedTickets[ticket._id] ? 'bg-base-content/[0.02]' : ''}`}>
                    <td className="py-5 px-6">
                      <div className="font-bold text-sm text-base-content/90 group-hover:text-base-content transition-colors">{ticket.title}</div>
                      <div className="text-[11px] text-base-content/30 mt-1 line-clamp-1 max-w-xs">{ticket.description}</div>
                    </td>
                    <td className="py-5 px-4">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${ticket.status === 'Open' ? 'bg-rose-500/5 border-rose-500/20 text-rose-400' :
                        ticket.status === 'In Progress' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
                          'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${ticket.status === 'Open' ? 'bg-rose-500' :
                          ticket.status === 'In Progress' ? 'bg-amber-500' :
                            'bg-emerald-500'
                          }`} />
                        {ticket.status}
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${ticket.priority === 'High' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' :
                        ticket.priority === 'Medium' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                          'bg-sky-500/10 border-sky-500/30 text-sky-400'
                        }`}>
                        {ticket.priority}
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-base-content/5 flex items-center justify-center border border-base-content/5 text-[10px] font-bold text-base-content/60">
                          {ticket.created_by?.name?.charAt(0)}
                        </div>
                        <span className="text-xs text-base-content/60 font-medium">{ticket.created_by?.name}</span>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <div className="text-xs text-base-content/40 font-medium">
                        {format(parseISO(ticket.createdAt), "MMM d, yyyy")}
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      {ticket.assigned_to ? (
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                          <span className="text-xs text-base-content/70 font-medium">{ticket.assigned_to.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-base-content/20 italic font-medium">Unassigned</span>
                      )}
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          className={`p-2 rounded-xl transition-all duration-300 ${expandedTickets[ticket._id] ? 'bg-primary/20 text-primary shadow-lg shadow-primary/10' : 'text-base-content/40 hover:text-base-content hover:bg-base-content/10'}`}
                          onClick={() => toggleComments(ticket._id)}
                          title="View Discussion"
                        >
                          <ChatBubbleLeftIcon className="w-5 h-5" />
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
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Content: Native Detail View */}
                  {expandedTickets[ticket._id] && (
                    <tr className="bg-base-content/[0.01]">
                      <td colSpan="7" className="p-0 border-b border-base-content/5 overflow-hidden">
                        <div className="p-8 animate-in slide-in-from-top-2 duration-500">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                            {/* Detailed Info */}
                            <div className="lg:col-span-7 space-y-8">
                              <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-base-content/20 mb-3">Ticket Information</h4>
                                <div className="bg-base-content/[0.02] border border-base-content/5 rounded-2xl p-6">
                                  <h3 className="text-lg font-bold text-base-content mb-2">{ticket.title}</h3>
                                  <p className="text-sm text-base-content/60 leading-relaxed font-medium">
                                    {ticket.description}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-base-content/20 mb-3">Supporting Material</h4>
                                <div className="bg-base-content/[0.02] border border-base-content/5 rounded-2xl p-2">
                                  <AttachmentsPreview
                                    attachments={ticket.attachments}
                                    ticketId={ticket._id}
                                    status={ticket.status}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Discussion Sidebar */}
                            <div className="lg:col-span-5 border-l border-base-content/5 pl-0 lg:pl-10">
                              <div className="flex items-center justify-between mb-6">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-base-content/20">Communication Activity</h4>
                                <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full">{ticket.comments?.length || 0} Comments</span>
                              </div>

                              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar mb-8">
                                {ticket.comments?.length > 0 ? ticket.comments.map(comment => (
                                  <div key={comment._id} className="space-y-3">
                                    <div className="flex gap-4">
                                      <div className="w-8 h-8 rounded-xl bg-base-content/5 border border-base-content/10 flex items-center justify-center text-[10px] font-bold text-base-content/40 shrink-0">
                                        {comment.created_by?.name?.charAt(0)}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-baseline justify-between mb-1">
                                          <span className="text-xs font-bold text-base-content/80">{comment.created_by?.name}</span>
                                          <span className="text-[10px] font-medium text-base-content/20">{format(parseISO(comment.createdAt), "MMM d, HH:mm")}</span>
                                        </div>
                                        <div className="text-sm text-base-content/60 leading-snug font-medium">
                                          {comment.text}
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                          <button className="text-[10px] font-bold text-base-content/20 hover:text-primary transition-colors uppercase tracking-widest" onClick={() => handleReplyClick(ticket._id, comment)}>Reply</button>
                                          {comment.replies?.length > 0 && (
                                            <button className="text-[10px] font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-widest" onClick={() => toggleReplies(comment._id)}>
                                              {expandedReplies[comment._id] ? "Hide Thread" : `View Thread (${comment.replies.length})`}
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Threaded Replies */}
                                    {expandedReplies[comment._id] && comment.replies?.length > 0 && (
                                      <div className="ml-12 pl-4 border-l border-base-content/10 space-y-4 pt-1">
                                        {(comment.replies || []).map(reply => (
                                          <div key={reply._id} className="flex gap-3">
                                            <div className="w-6 h-6 rounded-lg bg-base-content/5 flex items-center justify-center text-[8px] font-bold text-base-content/30 shrink-0">
                                              {reply.created_by?.name?.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                              <div className="flex items-baseline justify-between mb-0.5">
                                                <span className="text-[11px] font-bold text-base-content/60">{reply.created_by?.name}</span>
                                                <span className="text-[9px] font-medium text-base-content/20">{format(parseISO(reply.createdAt), "HH:mm")}</span>
                                              </div>
                                              <p className="text-xs text-base-content/40 leading-relaxed font-medium">{reply.text}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )) : (
                                  <div className="py-12 text-center">
                                    <div className="w-12 h-12 rounded-2xl bg-base-content/[0.02] border border-base-content/5 flex items-center justify-center mx-auto mb-4">
                                      <ChatBubbleLeftIcon className="w-6 h-6 text-base-content/10" />
                                    </div>
                                    <p className="text-xs text-base-content/20 font-medium italic">No comments have been recorded for this ticket.</p>
                                  </div>
                                )}
                              </div>

                              {/* Action Bar */}
                              <div className="relative group">
                                {replyState[ticket._id]?.parentCommentId && (
                                  <div className="absolute -top-10 left-0 right-0 p-2 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
                                    <span className="text-[10px] font-bold text-primary ml-2 uppercase tracking-wide">Replying to {replyState[ticket._id].replyingToName}</span>
                                    <button onClick={() => handleCancelReply(ticket._id)}><XMarkIcon className="w-4 h-4 text-primary" /></button>
                                  </div>
                                )}
                                <div className="flex flex-col gap-3 bg-base-content/[0.03] border border-base-content/5 rounded-2xl p-4 group-focus-within:border-base-content/20 transition-all">
                                  <textarea
                                    className="bg-transparent w-full h-24 resize-none text-sm text-base-content placeholder:text-base-content/20 focus:outline-none custom-scrollbar font-medium"
                                    placeholder={replyState[ticket._id]?.parentCommentId ? "Compose your reply..." : "Add your thoughts..."}
                                    value={replyState[ticket._id]?.text || ""}
                                    onChange={(e) => handleCommentChange(ticket._id, e.target.value)}
                                  />
                                  <div className="flex justify-end pt-2 border-t border-base-content/5">
                                    <button
                                      className="btn btn-primary btn-sm h-10 px-5 rounded-xl font-bold transition-all shadow-lg shadow-primary/10"
                                      disabled={commentLoading[ticket._id] || !replyState[ticket._id]?.text?.trim()}
                                      onClick={() => handleSubmitComment(ticket._id)}
                                    >
                                      {commentLoading[ticket._id] ? <span className="loading loading-spinner loading-xs mr-2"></span> : <PaperAirplaneIcon className="w-4 h-4 mr-2" />}
                                      Post Comment
                                    </button>
                                  </div>
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

        {/* Improved Pagination */}
        <div className="p-6 border-t border-base-content/5 bg-base-content/[0.01] flex items-center justify-between">
          <p className="text-xs text-base-content/20 font-bold uppercase tracking-widest px-2">
            Showing <span className="text-base-content/60">{Math.min(filteredTickets.length, (currentPage - 1) * itemsPerPage + 1)}</span> to <span className="text-base-content/60">{Math.min(filteredTickets.length, currentPage * itemsPerPage)}</span> of {filteredTickets.length} results
          </p>
          <div className="flex gap-2">
            <button className="btn btn-sm h-10 px-4 rounded-xl border-base-content/10 bg-transparent text-base-content/60 hover:bg-base-content/5 disabled:opacity-20" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              Previous
            </button>
            <div className="flex items-center justify-center px-4 bg-base-content/5 rounded-xl text-xs font-bold text-base-content/80 border border-base-content/10">
              {currentPage}
            </div>
            <button className="btn btn-sm h-10 px-4 rounded-xl border-base-content/10 bg-transparent text-base-content/60 hover:bg-base-content/5 disabled:opacity-20" disabled={paginatedTickets.length < itemsPerPage} onClick={() => setCurrentPage(p => p + 1)}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketsList;

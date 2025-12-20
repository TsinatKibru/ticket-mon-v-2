import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tickets: [],
  ticketstatus: "idle",
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    getTickets: (state, action) => {
      state.tickets = action.payload;
      state.ticketstatus = "loaded";
    },
    addTicket: (state, action) => {
      state.tickets.push(action.payload);
    },
    deleteTicket: (state, action) => {
      state.tickets = state.tickets.filter(
        (ticket) => ticket._id !== action.payload
      );
    },
    deleteUserTickets: (state, action) => {
      state.tickets = state.tickets.filter((ticket) => {
        return ticket.created_by?._id !== action.payload;
      });
    },
    // deleteUserTickets: (state, action) => {
    //   const { userId, tickets } = action.payload;
    //   console.log("userandtickets", state);
    //   if (tickets && Array.isArray(tickets)) {
    //     state.tickets = tickets.filter(
    //       (ticket) => ticket.created_by._id !== userId
    //     );
    //   }
    // },
    updateTicket: (state, action) => {
      if (!action.payload?._id) return;
      const index = state.tickets.findIndex(
        (ticket) => ticket._id === action.payload._id
      );
      if (index !== -1) {
        state.tickets[index] = { ...state.tickets[index], ...action.payload };
      }
    },
    changeTicketStatus: (state, action) => {
      const index = state.tickets.findIndex(
        (ticket) => ticket._id === action.payload._id
      );
      if (index !== -1) {
        state.tickets[index].status = action.payload.status;
      }
    },
    assignTicketAction: (state, action) => {
      const index = state.tickets.findIndex(
        (ticket) => ticket._id === action.payload._id
      );
      if (index !== -1) {
        state.tickets[index].assigned_to = action.payload.assigned_to;
      }
    },
    addCommentToTicket: (state, action) => {
      const { ticketId, comment } = action.payload;

      const ticket = state.tickets.find((ticket) => ticket._id === ticketId);
      if (ticket) {
        ticket.comments = ticket.comments
          ? [...ticket.comments, comment]
          : [comment];
      }
    },
  },
});

export const {
  getTickets,
  addTicket,
  deleteTicket,
  deleteUserTickets,
  updateTicket,
  changeTicketStatus,
  assignTicketAction,
  addCommentToTicket,
} = ticketSlice.actions;

export default ticketSlice.reducer;

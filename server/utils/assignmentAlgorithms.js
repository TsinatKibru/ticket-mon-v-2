// utils/assignmentAlgorithms.js
import Ticket from "../models/ticket.model.js";

// Round Robin: Assign tickets in a cyclic order
export const roundRobin = (users, lastAssignedUserId) => {
  if (users.length === 0) return null;

  const lastAssignedIndex = users.findIndex(
    (user) => user._id.toString() === lastAssignedUserId?.toString()
  );
  const nextIndex = (lastAssignedIndex + 1) % users.length;
  return users[nextIndex]._id;
};

// Least Recently Assigned: Assign to the user who hasn't been assigned a ticket for the longest time
export const leastRecentlyAssigned = async (users) => {
  if (users.length === 0) return null;

  const userAssignmentTimes = await Promise.all(
    users.map(async (user) => {
      const lastAssignedTicket = await Ticket.findOne({ assigned_to: user._id })
        .sort({ createdAt: -1 })
        .exec();
      return {
        userId: user._id,
        lastAssignedTime: lastAssignedTicket
          ? lastAssignedTicket.createdAt
          : new Date(0),
      };
    })
  );

  userAssignmentTimes.sort((a, b) => a.lastAssignedTime - b.lastAssignedTime);
  return userAssignmentTimes[0].userId;
};

// Load Balancing: Assign to the user with the fewest open tickets
export const loadBalancing = async (users) => {
  if (users.length === 0) return null;

  const userTicketCounts = await Promise.all(
    users.map(async (user) => {
      const openTicketCount = await Ticket.countDocuments({
        assigned_to: user._id,
        status: { $in: ["Open", "In Progress"] },
      });
      return {
        userId: user._id,
        openTicketCount,
      };
    })
  );

  userTicketCounts.sort((a, b) => a.openTicketCount - b.openTicketCount);
  return userTicketCounts[0].userId;
};

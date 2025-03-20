import TitleCard from "./TitleCard";
import { format } from "date-fns";

function RecentTickets({ tickets }) {
  // Sort tickets by createdAt in descending order (most recent first)
  const sortedTickets = tickets
    ? [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  // Take only the first 5 tickets
  const recentTickets = sortedTickets.slice(0, 5);

  return (
    <TitleCard title={"Recent Tickets"}>
      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th className="normal-case">Title</th>
              <th className="normal-case">Status</th>
              <th className="normal-case">Priority</th>
              <th className="normal-case">Created By</th>
              <th className="normal-case">Created At</th>
            </tr>
          </thead>
          <tbody>
            {recentTickets.map((ticket, k) => (
              <tr key={ticket._id}>
                <th>{k + 1}</th>
                <td>{ticket.title}</td>
                <td>{ticket.status}</td>
                <td>{ticket.priority}</td>
                <td>{ticket.created_by?.name}</td>
                <td>{format(ticket.createdAt, "yyyy-MM-dd")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TitleCard>
  );
}

export default RecentTickets;

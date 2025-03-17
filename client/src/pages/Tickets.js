import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

class Tickets extends Component {
  state = {
    tickets: [],
  };

  componentDidMount() {
    this.fetchTickets();
  }

  fetchTickets = async () => {
    try {
      const response = await axios.get("/api/v1/tickets", {});
      this.setState({ tickets: response.data.data });
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    }
  };

  render() {
    const { tickets } = this.state;

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Tickets</h1>
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{ticket.title}</h2>
              <p className="text-gray-600">{ticket.status}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Tickets);

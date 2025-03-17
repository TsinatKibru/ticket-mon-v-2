import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";

class TicketDetails extends Component {
  state = {
    ticket: null,
  };

  componentDidMount() {
    this.fetchTicketDetails();
  }

  fetchTicketDetails = async () => {
    try {
      // const { id } = this.props.params; // Get the ticket ID from props
      const { id } = this.props.params; // Get the ticket ID from props
      const response = await axios.get(`/api/v1/tickets/${id}`);
      this.setState({ ticket: response.data.data });
    } catch (error) {
      console.error("Failed to fetch ticket details:", error);
    }
  };

  render() {
    const { ticket } = this.state;

    if (!ticket) {
      return <div>Loading...</div>;
    }

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{ticket.title}</h1>
        <p className="text-gray-600">{ticket.description}</p>
        <p className="text-gray-600">Status: {ticket.status}</p>
      </div>
    );
  }
}

// Function to wrap class component with route params
const withRouter = (Component) => {
  return (props) => {
    const params = useParams();
    return <Component {...props} params={params} />;
  };
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(TicketDetails));

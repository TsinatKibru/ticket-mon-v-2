import React, { Component } from "react";
import { connect } from "react-redux";
import { login } from "../redux/slices/authSlice"; // Optional: If you want to log in after registration
import axios from "../utils/axiosConfig";
import withNavigate from "../utils/withNavigate";
import ErrorText from "../components/ErrorText";
import InputText from "../components/Input/InputText";
import { Link } from "react-router-dom";
import LandingIntro from "../components/LandingIntro";

class Register extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    error: "",
    loading: false,
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = this.state;

    this.setState({ error: "", loading: true });

    try {
      // API request to register the user
      const response = await axios.post("/api/v1/auth/sign-up", {
        name,
        email,
        password,
      });

      // Optional: Log in the user after registration
      const { token, user } = response.data.data;
      this.props.login({ token, user }); // Dispatch login action

      // Redirect to dashboard
      this.props.navigate("/app/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Registration failed. Please try again";
      let friendlyErrorMessage = errorMessage; // Initialize with the original error message

      if (
        errorMessage.includes("ENOTFOUND") ||
        errorMessage.includes("ETIMEDOUT") ||
        errorMessage.includes("ECONNREFUSED")
      ) {
        friendlyErrorMessage =
          "A network error occurred. Please check your internet connection and try again.";
      }

      this.setState({ error: friendlyErrorMessage, loading: false });
    }
  };

  render() {
    const { name, email, password, error, loading } = this.state;

    return (
      <div className="min-h-screen bg-base-200 flex items-center">
        <div className="card mx-auto w-full max-w-5xl shadow-xl">
          <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
            <div className="">
              <LandingIntro />
            </div>
            <div className="py-24 px-10">
              <h2 className="text-2xl font-semibold mb-2 text-center">
                Register
              </h2>
              <form onSubmit={this.handleSubmit}>
                <div className="mb-4">
                  <InputText
                    type="text"
                    defaultValue={name}
                    updateType="name"
                    containerStyle="mt-4"
                    labelTitle="Name"
                    updateFormValue={({ value }) =>
                      this.setState({ name: value })
                    }
                  />

                  <InputText
                    type="email"
                    defaultValue={email}
                    updateType="email"
                    containerStyle="mt-4"
                    labelTitle="Email"
                    updateFormValue={({ value }) =>
                      this.setState({ email: value })
                    }
                  />

                  <InputText
                    defaultValue={password}
                    type="password"
                    updateType="password"
                    containerStyle="mt-4"
                    labelTitle="Password"
                    updateFormValue={({ value }) =>
                      this.setState({ password: value })
                    }
                  />
                </div>

                <ErrorText styleClass="mt-8">{error}</ErrorText>

                <button
                  type="submit"
                  className={`w-full p-2 rounded ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "btn btn-primary text-white"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>

                <div className="text-center mt-4">
                  Already have an account?{" "}
                  <Link to="/login">
                    <span className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                      Login
                    </span>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  login, // Optional: If you want to log in after registration
};

export default connect(null, mapDispatchToProps)(withNavigate(Register));

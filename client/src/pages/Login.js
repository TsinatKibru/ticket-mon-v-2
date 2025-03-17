import React, { Component } from "react";
import { connect } from "react-redux";
import { login } from "../redux/slices/authSlice";
import axios from "../utils/axiosConfig";
import withNavigate from "../utils/withNavigate";
import ErrorText from "../components/ErrorText";
import InputText from "../components/Input/InputText";
import { Link } from "react-router-dom";
import LandingIntro from "../components/LandingIntro";

class Login extends Component {
  state = {
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

    const { email, password } = this.state;

    this.setState({ error: "", loading: true });

    try {
      const response = await axios.post("/api/v1/auth/sign-in", {
        email,
        password,
      });

      const { token, user } = response.data.data;

      // Dispatch the login action to store token and user
      this.props.login({ token, user });

      this.props.navigate("/app/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Invalid email or password";
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
    const { email, password, error, loading } = this.state;

    return (
      <div className="min-h-screen bg-base-200 flex items-center">
        <div className="card mx-auto w-full max-w-5xl shadow-xl">
          <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
            <div className="">
              <LandingIntro />
            </div>
            <div className="py-24 px-10">
              <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>
              <form onSubmit={this.handleSubmit}>
                <div className="mb-4">
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
                  data-set-theme="light"
                  data-act-class="ACTIVECLASS"
                  type="submit"
                  className={`w-full p-2 rounded ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "btn btn-primary text-white"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                <div className="text-center mt-4">
                  Don't have an account yet?{" "}
                  <Link to="/register">
                    <span className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                      Register
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
  login,
};

export default connect(null, mapDispatchToProps)(withNavigate(Login));

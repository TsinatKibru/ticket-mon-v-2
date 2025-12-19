import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/slices/authSlice";
import axios from "../utils/axiosConfig";
import ErrorText from "../components/ErrorText";
import InputText from "../components/Input/InputText";
import LandingIntro from "../components/LandingIntro";

function Login() {
  const INITIAL_LOGIN_OBJ = {
    password: "",
    email: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (loginObj.email.trim() === "")
      return setErrorMessage("Email Id is required!");
    if (loginObj.password.trim() === "")
      return setErrorMessage("Password is required!");

    setLoading(true);

    try {
      const response = await axios.post("/api/v1/auth/sign-in", loginObj);
      const { token, user } = response.data.data;

      // Store in Redux
      dispatch(login({ token, user }));

      // Navigate to app
      navigate("/app/dashboard");
    } catch (error) {
      const msg =
        error.response?.data?.error ||
        error.message ||
        "Invalid email or password";

      let friendlyMessage = msg;

      if (
        msg.includes("ENOTFOUND") ||
        msg.includes("ETIMEDOUT") ||
        msg.includes("ECONNREFUSED")
      ) {
        friendlyMessage =
          "A network error occurred. Please check your internet connection.";
      }
      setErrorMessage(friendlyMessage);
      setLoading(false);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300">
      <div className="card mx-auto w-full max-w-5xl shadow-2xl">
        <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl overflow-hidden">
          <div className="">
            <LandingIntro />
          </div>
          <div className="py-24 px-10">
            <h2 className="text-3xl font-bold mb-2 text-center text-primary">Login</h2>
            <p className="text-center mb-8 text-base-content/60">Welcome back, please login to continue</p>

            <form onSubmit={submitForm}>
              <div className="mb-4">
                <InputText
                  type="email"
                  defaultValue={loginObj.email}
                  updateType="email"
                  containerStyle="mt-4"
                  labelTitle="Email"
                  updateFormValue={updateFormValue}
                />

                <InputText
                  defaultValue={loginObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Password"
                  updateFormValue={updateFormValue}
                />
              </div>

              <div className="text-right text-primary hover:underline text-sm mb-4 cursor-pointer">
                Forgot Password?
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>

              <button
                type="submit"
                className={`btn mt-2 w-full btn-primary text-white font-bold transition-all duration-300 ${loading ? "loading" : ""
                  }`}
                disabled={loading}
              >
                {loading ? "Logging In..." : "Login"}
              </button>

              <div className="text-center mt-6">
                Don't have an account yet?{" "}
                <Link to="/register">
                  <span className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200 font-semibold">
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

export default Login;

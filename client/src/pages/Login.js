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
      navigate("/app/");
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
    <div className="min-h-screen minimal-bg flex items-center justify-center p-6 lg:p-12" data-theme="business">
      <div className="w-full max-w-[1100px] minimal-card rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in-95 duration-1000">

        {/* Left Side: Minimal Branding */}
        <div className="w-full md:w-[45%] border-b md:border-b-0 md:border-r border-base-content/5 bg-base-content/[0.01]">
          <LandingIntro />
        </div>

        {/* Right Side: Clean Login Form */}
        <div className="flex-1 py-16 px-8 md:px-20 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <header className="mb-12">
              <h2 className="text-4xl font-bold mono-gradient-text font-outfit tracking-tighter mb-3">
                Sign In
              </h2>
              <p className="text-base-content/40 font-medium text-sm">
                Enter your credentials to access your dashboard.
              </p>
            </header>

            <form onSubmit={submitForm} className="space-y-8">
              <div className="space-y-6">
                <InputText
                  type="email"
                  defaultValue={loginObj.email}
                  updateType="email"
                  labelTitle="Professional Email"
                  updateFormValue={updateFormValue}
                />

                <div className="space-y-2">
                  <InputText
                    defaultValue={loginObj.password}
                    type="password"
                    updateType="password"
                    labelTitle="Password"
                    updateFormValue={updateFormValue}
                  />
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-base-content/30 hover:text-base-content/60 transition-colors uppercase tracking-widest cursor-pointer">
                      Forgot Password?
                    </span>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-error/5 border border-error/20 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2">
                  <ErrorText styleClass="text-sm text-center">{errorMessage}</ErrorText>
                </div>
              )}

              <button
                type="submit"
                className={`w-full h-14 bg-base-content text-base-100 font-bold rounded-2xl hover:bg-base-content/90 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-wait" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  "Continue"
                )}
              </button>

              <div className="text-center">
                <p className="text-base-content/30 text-sm font-medium">
                  New member?{" "}
                  <Link to="/register">
                    <span className="text-base-content hover:underline transition-all">
                      Create an account
                    </span>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

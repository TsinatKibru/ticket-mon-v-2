import React, { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "./Input/InputText";
import ErrorText from "./ErrorText";
import { addNewUser as addNewUserAction } from "../redux/slices/userSlice";
import { addNewUser } from "../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const INITIAL_USER_OBJ = {
  name: "",
  email: "",
  role: "user",
};

// Email validation regex
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Role validation
const validateRole = (role) => {
  const allowedRoles = ["user", "admin", "support_agent"];
  return allowedRoles.includes(role);
};

function AddUserModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [userObj, setUserObj] = useState(INITIAL_USER_OBJ);

  const saveNewUser = async () => {
    // Name validation
    if (userObj.name.trim().length < 2) {
      return setErrorMessage("Name must be at least 2 characters long!");
    }

    // Email validation
    if (!validateEmail(userObj.email.trim())) {
      return setErrorMessage("Please enter a valid email address!");
    }

    // Role validation
    if (!validateRole(userObj.role)) {
      return setErrorMessage("Invalid role selected!");
    }
    setLoading(true);

    // If all validations pass, proceed to save the user
    const newUserObj = {
      ...userObj,
      password: "1qaz2wsx", // You might want to handle this differently
    };

    const response = await addNewUser(newUserObj);

    if (response.success === true) {
      setLoading(false);
      dispatch(addNewUserAction({ newUserObj: response.data.user }));
      toast.success(`User Added Successfully!`);
      closeModal();
    } else {
      setLoading(true);
      setErrorMessage(response.message);
      toast.error(`User Adding Failed!`);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage(""); // Clear error message on input change
    setUserObj({ ...userObj, [updateType]: value });
  };

  return (
    <>
      <InputText
        type="text"
        defaultValue={userObj.name}
        updateType="name"
        containerStyle="mt-4"
        labelTitle="Name"
        updateFormValue={updateFormValue}
      />
      <InputText
        type="email"
        defaultValue={userObj.email}
        updateType="email"
        containerStyle="mt-4"
        labelTitle="Email Id"
        updateFormValue={updateFormValue}
      />
      <div className="mt-4">
        <label className="label">
          <span className="label-text">Role</span>
        </label>
        <select
          className="select select-bordered w-full" // DaisyUI-styled dropdown
          value={userObj.role}
          onChange={(e) =>
            updateFormValue({ updateType: "role", value: e.target.value })
          }
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="support_agent">Support Agent</option>
        </select>
      </div>

      <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          disabled={loading}
          onClick={() => saveNewUser()}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );
}

export default AddUserModalBody;

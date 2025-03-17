import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { fetchUsers, deleteUserById, updateUserRole } from "../utils/api"; // Add updateUserRole
import {
  getUsersContent,
  deleteUser,
  updateUserRoleAction, // Add updateUserRoleAction
} from "../redux/slices/userSlice";
import TitleCard from "../components/TitleCard";
import TopSideButtons from "../components/TopSideButtons";
import { openModal } from "../redux/slices/modalSlice";
import { setPageTitle } from "../redux/slices/headerSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { showNotification } from "../redux/slices/headerSlice";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class UserList extends Component {
  async componentDidMount() {
    const response = await fetchUsers();
    if (response._id != null) {
      this.props.getUsersContent(response);
    }
    this.props.setPageTitle({
      title: "/app/users/",
    });
  }

  deleteCurrentUser = (index) => {
    const { token } = this.props.auth;
    const userId = this.props.users[index]._id;
    deleteUserById(userId, token).then(() => {
      this.props.deleteUser(index);
      this.props.showNotification({ message: "User Deleted!", status: 1 });
    });
  };

  openAddNewUserModal = () => {
    this.props.openModal({
      title: "Add New User",
      bodyType: MODAL_BODY_TYPES.USER_ADD_NEW,
    });
  };

  openConfirmUserDelete = (index) => {
    const userId = this.props.users[index]._id;
    this.props.openModal({
      title: "Confirm Delete!",
      bodyType: MODAL_BODY_TYPES.CONFIRMATION,
      extraObject: {
        ticketId: userId,
        type: CONFIRMATION_MODAL_CLOSE_TYPES.USER_DELETE,
        message: "Deleting a User,Are You sure? ",
      },
    });
  };

  handleRoleChange = async (userId, newRole) => {
    const { token } = this.props.auth;

    try {
      const updatedUser = await updateUserRole(userId, newRole, token);

      this.props.updateUserRoleAction({ userId, newRole });

      toast.success(`User role updated to ${newRole}!`); // Use
    } catch (error) {
      toast.error(`User role update Failed!`);
      console.error("Error updating user role:", error);
    }
  };

  render() {
    const { users } = this.props;
    const { user } = this.props.auth;
    const currentUser = user;

    return (
      <>
        <TitleCard
          title="Current Users"
          topMargin="mt-2"
          TopSideButtons={
            <div className="inline-block float-right">
              <button
                className="btn px-6 btn-sm normal-case btn-primary"
                onClick={this.openAddNewUserModal}
              >
                Add New
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email Id</th>
                  <th>Created At</th>

                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users != null &&
                  users.map((user, k) => (
                    <tr key={k}>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img
                                src={
                                  user.profileImage ||
                                  "https://reqres.in/img/faces/1-image.jpg"
                                }
                                alt="Avatar"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{user.name}</div>
                            <div className="text-sm opacity-50">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{moment(user.createdAt).format("DD MMM YY")}</td>

                      <td>
                        <select
                          disabled={user._id === currentUser._id}
                          className="select select-bordered select-sm"
                          value={user.role}
                          onChange={(e) =>
                            this.handleRoleChange(user._id, e.target.value)
                          }
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="support_agent">Support Agent</option>
                        </select>
                      </td>

                      <td>
                        <button
                          disabled={user._id === currentUser._id}
                          className="btn btn-square btn-ghost"
                          onClick={() => this.openConfirmUserDelete(k)}
                        >
                          <TrashIcon className="w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </TitleCard>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  users: state.user.users,
  auth: state.auth,
});

const mapDispatchToProps = {
  getUsersContent,
  deleteUser,
  updateUserRoleAction, // Add updateUserRoleAction
  openModal,
  setPageTitle,
  showNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);

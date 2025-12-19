import React, { Component } from "react";
import { connect } from "react-redux";
// import moment from "moment";
import { format } from "date-fns";

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
import { AlertCircle, Plus } from "lucide-react";
import { fixImageUrl } from "../utils/imageUtils";

class UserList extends Component {
  async componentDidMount() {
    const response = await fetchUsers();
    if (response._id != null) {
      this.props.getUsersContent(response);
    }
    this.props.setPageTitle({
      title: "Users List",
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
    const { users, userstatus } = this.props;
    const { user } = this.props.auth;
    const currentUser = user;

    return (
      <div className="p-4 md:p-6 space-y-6 min-h-screen">
        <div className="flex justify-between items-center ml-1">
          <div>
            <h1 className="text-3xl font-bold text-white font-outfit tracking-tight">Active Members</h1>
            <p className="text-neutral-content/60 text-sm">Manage roles and permissions across the platform</p>
          </div>
          <button
            className="btn btn-primary px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-outfit"
            onClick={this.openAddNewUserModal}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New User
          </button>
        </div>

        <div className="glass-effect rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="table w-full custom-table">
              <thead>
                <tr className="text-neutral-content/40 uppercase text-[11px] font-bold tracking-widest border-b border-white/5 bg-white/[0.02]">
                  <th className="py-5 px-8">Member</th>
                  <th>Joined Date</th>
                  <th>Role</th>
                  <th className="text-right px-8">Actions</th>
                </tr>
              </thead>
              <tbody className="text-white">
                {userstatus === "idle"
                  ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse border-b border-white/5">
                      <td className="py-6 px-8 flex items-center gap-4">
                        <div className="skeleton h-12 w-12 rounded-xl"></div>
                        <div className="space-y-2">
                          <div className="skeleton h-4 w-32"></div>
                          <div className="skeleton h-3 w-40 opacity-50"></div>
                        </div>
                      </td>
                      <td><div className="skeleton h-4 w-24"></div></td>
                      <td><div className="skeleton h-8 w-32 rounded-lg"></div></td>
                      <td className="text-right px-8"><div className="skeleton h-10 w-10 rounded-xl ml-auto"></div></td>
                    </tr>
                  ))
                  : users != null &&
                  users.map((user, k) => (
                    <tr key={k} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={fixImageUrl(user.profileImage) || "/intro.png"}
                              className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/5 group-hover:ring-primary/40 transition-all"
                              alt="avatar"
                            />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#1a1c23] rounded-full"></div>
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-base truncate">{user.name}</p>
                            <p className="text-xs text-neutral-content/50 truncate tracking-wide">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-neutral-content/60 font-medium">
                        {format(new Date(user.createdAt), "MMM dd, yyyy")}
                      </td>
                      <td>
                        <select
                          disabled={user._id === currentUser._id}
                          className={`select select-sm rounded-lg glass-effect border-white/10 font-semibold text-xs tracking-wide min-w-[140px] appearance-none focus:ring-1 focus:ring-primary/40 ${user.role === 'admin' ? 'text-primary' : 'text-neutral-content'
                            }`}
                          value={user.role}
                          onChange={(e) =>
                            this.handleRoleChange(user._id, e.target.value)
                          }
                        >
                          <option value="user" className="bg-[#1a1c23] text-white">USER</option>
                          <option value="admin" className="bg-[#1a1c23] text-white">ADMIN</option>
                          <option value="support_agent" className="bg-[#1a1c23] text-white">SUPPORT AGENT</option>
                        </select>
                      </td>
                      <td className="text-right px-8">
                        <button
                          disabled={user._id === currentUser._id}
                          className="btn btn-square btn-ghost btn-sm text-neutral-content/40 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                          onClick={() => this.openConfirmUserDelete(k)}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {users.length === 0 && userstatus !== "idle" && (
              <div className="p-20 text-center">
                <AlertCircle className="mx-auto h-16 w-16 text-neutral-content/10" />
                <h3 className="mt-6 text-xl font-bold text-white font-outfit">
                  No Members Found
                </h3>
                <p className="mt-2 text-neutral-content/40 text-sm max-w-xs mx-auto">
                  It seems there are no users matching your criteria or the database is currently empty.
                </p>
                <button
                  onClick={this.openAddNewUserModal}
                  className="mt-8 btn btn-primary px-10 rounded-xl"
                >
                  <Plus className="w-5 h-5 mr-2" /> Invite Member
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  users: state.user.users,
  userstatus: state.user.userstatus,
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

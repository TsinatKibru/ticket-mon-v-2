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

import { toast } from "sonner";
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
            <h1 className="text-3xl font-bold font-outfit tracking-tight">Active Members</h1>
            <p className="text-base-content/60 text-sm">Manage roles and permissions across the platform</p>
          </div>
          <button
            className="btn btn-primary px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-outfit"
            onClick={this.openAddNewUserModal}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New User
          </button>
        </div>

        <div className="glass-effect rounded-3xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="table w-full custom-table">
              <thead>
                <tr className="text-neutral-content/40 uppercase text-[10px] font-bold tracking-[0.15em] border-b border-white/5 bg-white/[0.01]">
                  <th className="py-4 px-8 font-outfit">Member</th>
                  <th className="font-outfit">Joined</th>
                  <th className="font-outfit">Access Role</th>
                  <th className="text-right px-8 font-outfit">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {userstatus === "idle"
                  ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-3 px-8 flex items-center gap-3">
                        <div className="skeleton h-10 w-10 rounded-xl"></div>
                        <div className="space-y-1.5">
                          <div className="skeleton h-3 w-28"></div>
                          <div className="skeleton h-2 w-36 opacity-50"></div>
                        </div>
                      </td>
                      <td><div className="skeleton h-3 w-20"></div></td>
                      <td><div className="skeleton h-6 w-24 rounded-lg"></div></td>
                      <td className="text-right px-8"><div className="skeleton h-8 w-8 rounded-xl ml-auto"></div></td>
                    </tr>
                  ))
                  : users != null &&
                  users.map((user, k) => (
                    <tr key={k} className="hover:bg-white/[0.02] transition-all duration-200 group">
                      <td className="py-3 px-8">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={fixImageUrl(user.profileImage) || "/intro.png"}
                              className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-primary/40 transition-all shadow-md"
                              alt="avatar"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#1a1c23] rounded-full"></div>
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-white/90 truncate group-hover:text-white transition-colors capitalize">{user.name}</p>
                            <p className="text-[11px] text-base-content/40 truncate tracking-tight">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-xs text-base-content/50 font-medium">
                        {format(new Date(user.createdAt), "MMM dd, yy")}
                      </td>
                      <td>
                        <div className="flex gap-1.5">
                          {['user', 'support_agent', 'admin'].map((role) => (
                            <button
                              key={role}
                              disabled={user._id === currentUser._id || userstatus === 'updating'}
                              onClick={() => this.handleRoleChange(user._id, role)}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border transition-all duration-300 ${user.role === role
                                ? role === 'admin'
                                  ? 'bg-primary/20 border-primary/40 text-primary shadow-lg shadow-primary/10'
                                  : role === 'support_agent'
                                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                                    : 'bg-white/10 border-white/20 text-white'
                                : 'bg-transparent border-transparent text-base-content/30 hover:text-base-content/60 hover:bg-white/5 opacity-40 hover:opacity-100'
                                }`}
                            >
                              {role.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="text-right px-8">
                        <button
                          disabled={user._id === currentUser._id}
                          className="p-2 text-base-content/30 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          onClick={() => this.openConfirmUserDelete(k)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {users.length === 0 && userstatus !== "idle" && (
              <div className="p-20 text-center">
                <AlertCircle className="mx-auto h-16 w-16 text-base-content/10" />
                <h3 className="mt-6 text-xl font-bold font-outfit">
                  No Members Found
                </h3>
                <p className="mt-2 text-base-content/40 text-sm max-w-xs mx-auto">
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

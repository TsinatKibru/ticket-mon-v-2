import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, AlertCircle, Users } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setStatus } from "../../redux/slices/departmentsSlice";
import { MemberListModal } from "./MemberListModal";

export function DepartmentList({
  departments,
  status,
  error,
  onAddDepartment,
  onEditDepartment,
  onDeleteDepartment,
  currentUser,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const dispatch = useDispatch();

  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    if (status === "depaddsucceeded") {
      toast.success(`Success: Department Added!`);
      dispatch(setStatus("idle"));
    }
    if (status === "deletesucceeded") {
      toast.success(`Success: Department Deleted!`);
      dispatch(setStatus("idle"));
    }
    if (status === "depupdatesucceeded") {
      toast.success(`Success: Department Updated!`);
      dispatch(setStatus("idle"));
    }
  }, [status, error, dispatch]);

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 ml-1">
        <div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight">Departments</h1>
          <p className="text-base-content/60 text-sm mt-1">
            Manage your organization's departments and settings
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={onAddDepartment}
            className="btn btn-primary px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-outfit"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Department
          </button>
        )}
      </div>

      {error && (
        <div className=" mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative glass-effect rounded-2xl p-4 shadow-lg">
        <input
          type="text"
          placeholder="Search departments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-base-100/50 input input-bordered rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 border-white/10"
        />
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-8 top-1/2 transform -translate-y-1/2 text-base-content/40" />
      </div>

      <div className="glass-effect rounded-3xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="table w-full custom-table">
            <thead>
              <tr className="text-neutral-content/40 uppercase text-[10px] font-bold tracking-[0.15em] border-b border-white/5 bg-white/[0.01]">
                <th className="py-4 px-8 font-outfit">Name</th>
                <th className="font-outfit">Description</th>
                <th className="font-outfit">Members</th>
                <th className="font-outfit">Algorithm</th>
                {isAdmin && <th className="text-right px-8 font-outfit">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {status === "idle" || status === "loading"
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3 px-8">
                      <div className="skeleton h-5 w-32 rounded-lg bg-white/5"></div>
                    </td>
                    <td className="py-3">
                      <div className="skeleton h-4 w-48 rounded-lg bg-white/5"></div>
                    </td>
                    <td className="py-3">
                      <div className="skeleton h-4 w-20 rounded-lg bg-white/5"></div>
                    </td>
                    <td className="py-3">
                      <div className="skeleton h-4 w-24 rounded-lg bg-white/5"></div>
                    </td>
                    {isAdmin && (
                      <td className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          <div className="skeleton h-8 w-8 rounded-xl bg-white/5"></div>
                          <div className="skeleton h-8 w-8 rounded-xl bg-white/5"></div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
                : filteredDepartments.map((department) => (
                  <tr key={department._id} className="hover:bg-white/[0.02] transition-all duration-200 group">
                    <td className="py-4 px-8 font-medium text-base-content/90 font-outfit">
                      {department.name}
                    </td>
                    <td className="text-base-content/60 text-sm max-w-sm truncate">
                      {department.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedDepartment(department)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-xs font-medium text-base-content/70"
                      >
                        <Users size={14} className="text-primary/70" />
                        <span>{department.users.length} members</span>
                      </button>
                    </td>
                    <td className="text-base-content/60 text-sm">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border bg-white/10 border-white/20 text-base-content/60">
                        {department.assignmentAlgorithm?.replace(/([A-Z])/g, ' $1').trim() || "Round Robin"}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="text-right px-8">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditDepartment(department)}
                            className="p-2 text-base-content/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                            title="Edit Department"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => onDeleteDepartment(department._id)}
                            className="p-2 text-base-content/40 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                            title="Delete Department"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Empty State */}
          {filteredDepartments.length === 0 && status === "succeeded" && (
            <div className="p-20 text-center">
              <AlertCircle className="mx-auto h-16 w-16 text-base-content/10" />
              <h3 className="mt-6 text-xl font-bold font-outfit">
                No Departments Found
              </h3>
              <p className="mt-2 text-base-content/40 text-sm max-w-xs mx-auto">
                {departments.length === 0
                  ? "Get started by creating your first department to organize your team."
                  : "No departments match your current search."}
              </p>
              {departments.length === 0 && isAdmin && (
                <button
                  onClick={onAddDepartment}
                  className="mt-8 btn btn-primary px-10 rounded-xl shadow-lg shadow-primary/20"
                >
                  <Plus className="w-5 h-5 mr-2" /> Create Department
                </button>
              )}
            </div>
          )}

        </div>
      </div>
      {selectedDepartment && (
        <MemberListModal
          departmentName={selectedDepartment.name}
          members={selectedDepartment.users}
          onClose={() => setSelectedDepartment(null)}
        />
      )}
    </>
  );
}

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
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // if (status === "failed" && error) {
    //   toast.error(`Error: ${error}`);
    // }
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

    console.log("status", status);

    // return () => {
    //   dispatch(setStatus("idle"));
    // };
  }, [status, error, dispatch]);

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  return (
    <>
      <div className="bg-base-100 rounded-lg shadow">
        {/* Header */}
        <div className="p-6 border-b border-base-300">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-base-content">
                Departments
              </h1>
              <p className="text-base-content/60 mt-1 text-sm sm:text-base">
                Manage your departments here
              </p>
            </div>
            <button
              onClick={onAddDepartment}
              className="btn btn-primary gap-2 w-full sm:w-auto"
            >
              <Plus size={20} /> <span>Create Department</span>
            </button>
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
          <div className="mt-4 relative flex-1">
            <input
              type="text"
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 input input-bordered focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Members</th>
                <th>Algorithm</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {status === "idle" || status === "loading"
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3">
                      <div className="skeleton h-4 w-24"></div>
                    </td>
                    <td className="py-3">
                      <div className="skeleton h-4 w-40"></div>
                    </td>
                    <td className="py-3">
                      <div className="skeleton h-4 w-16"></div>
                    </td>
                    <td className="py-3">
                      <div className="skeleton h-4 w-20"></div>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <div className="skeleton h-8 w-8 rounded-full"></div>
                        <div className="skeleton h-8 w-8 rounded-full"></div>
                      </div>
                    </td>
                  </tr>
                ))
                : filteredDepartments.map((department) => (
                  <tr key={department._id} className="hover:bg-base-200">
                    <td className="font-medium text-base-content">
                      {department.name}
                    </td>
                    <td className="text-base-content/60 line-clamp-2">
                      {department.description}
                    </td>
                    {/* <td className="text-base-content/60">
                      {department.users.length} members
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedDepartment(department)}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        <Users size={16} />
                        <span>{department.users.length} members</span>
                      </button>
                    </td>
                    <td className="text-base-content/60">
                      {department.assignmentAlgorithm || "Round Robin"}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEditDepartment(department)}
                          className="btn btn-ghost btn-sm text-primary"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => onDeleteDepartment(department._id)}
                          className="btn btn-ghost btn-sm text-error"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredDepartments.length === 0 && status === "succeeded" && (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-base-content/40" />
            <h3 className="mt-4 text-lg font-semibold text-base-content">
              No departments found
            </h3>
            <p className="mt-2 text-base-content/60">
              {departments.length === 0
                ? "Get started by creating your first department!"
                : "No departments match your search criteria."}
            </p>
            {departments.length === 0 && (
              <button
                onClick={onAddDepartment}
                className="mt-4 btn btn-primary gap-2"
              >
                <Plus size={20} /> Create Department
              </button>
            )}
          </div>
        )}
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

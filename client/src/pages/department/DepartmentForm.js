import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import MultiSelectDropdown from "./MultiSelectDropdown";

export function DepartmentForm({ department, users, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    assignmentAlgorithm: "roundRobin",
    users: [],
  });
  const supportAgents = users.filter((user) => user.role === "support_agent");

  useEffect(() => {
    if (department) {
      const users = department.users.map((user) => user._id);
      setFormData({
        ...department,
        users,
      });
    }
  }, [department]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  return (
    <div className="bg-base-100 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-base-content">
          {department ? "Edit Department" : "Create Department"}
        </h2>
        <button
          onClick={onCancel}
          className="btn btn-ghost btn-sm text-base-content/40 hover:text-base-content"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter department name"
            required
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
            placeholder="Enter department description"
            required
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Assignment Algorithm</span>
          </label>
          <select
            value={formData.assignmentAlgorithm}
            onChange={(e) =>
              setFormData({ ...formData, assignmentAlgorithm: e.target.value })
            }
            className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="roundRobin">Round Robin</option>
            <option value="leastRecentlyAssigned">
              Least Recently Assigned
            </option>
            <option value="loadBalancing">Load Balancing</option>
          </select>
        </div>

        <MultiSelectDropdown
          users={supportAgents}
          formData={formData}
          setFormData={setFormData}
        />

        <div className="flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="btn btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {department ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

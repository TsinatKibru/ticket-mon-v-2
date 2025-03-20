import React, { useState } from "react";
import { ClipboardList } from "lucide-react";

export function TaskAssignment({ departments, onAssignTask }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    departmentId: "",
    priority: "medium",
    status: "pending",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.title && task.departmentId) {
      onAssignTask({
        ...task,
        id: Math.random().toString(36).substr(2, 9),
      });
      setTask({
        title: "",
        description: "",
        departmentId: "",
        priority: "medium",
        status: "pending",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList size={24} className="text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          New Task Assignment
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <input
            type="text"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <select
            value={task.departmentId}
            onChange={(e) => setTask({ ...task, departmentId: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={task.priority}
            onChange={(e) => setTask({ ...task, priority: e.target.value })}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Assign Task
        </button>
      </form>
    </div>
  );
}

import React from "react";
import { UserPlus, User } from "lucide-react";

export function MemberList({ department, onAddMember, onUpdateMember }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Members</h2>
        <button
          onClick={() => onAddMember(department.id)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          <UserPlus size={20} />
          Add Member
        </button>
      </div>
      <div className="space-y-4">
        {department.members.map((member) => (
          <div
            key={member.id}
            className="p-4 border rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <User size={24} className="text-gray-400" />
              <div>
                <h3 className="font-semibold text-gray-800">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.email}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={member.availability ? "available" : "unavailable"}
                onChange={(e) =>
                  onUpdateMember({
                    ...member,
                    availability: e.target.value === "available",
                  })
                }
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

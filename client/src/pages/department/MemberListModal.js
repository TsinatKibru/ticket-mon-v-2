import React from "react";
import { X, User, CheckCircle, XCircle } from "lucide-react";

export function MemberListModal({ departmentName, members, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {departmentName} Members
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {members.length} {members.length === 1 ? "member" : "members"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {members.length === 0 ? (
            <div className="text-center py-8">
              <User
                size={48}
                className="mx-auto text-gray-400 dark:text-gray-500"
              />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                No members in this department
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {member.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-300 text-sm">
                        {member.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                          {member.role}
                        </span>
                        {member.availability ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
                            <CheckCircle size={14} />
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-red-700 dark:text-red-400">
                            <XCircle size={14} />
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500 dark:text-gray-300">
                    {member.lastAssignment && (
                      <div>
                        Last Assignment:
                        <br />
                        {new Date(member.lastAssignment).toLocaleDateString()}
                      </div>
                    )}
                    {typeof member.currentLoad === "number" && (
                      <div className="mt-1">
                        Current Load: {member.currentLoad}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

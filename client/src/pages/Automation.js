import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPageTitle } from "../redux/slices/headerSlice";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    PlayIcon,
    XMarkIcon,
    BoltIcon,
} from "@heroicons/react/24/outline";
import {
    getAutomations,
    deleteAutomation,
    createAutomation,
    updateAutomation,
} from "../utils/automationApi";
import { getCategories } from "../utils/categoryApi";
import { toast } from "sonner";
import { fetchUsers } from "../utils/api";

function Automation() {
    const dispatch = useDispatch();
    const [automations, setAutomations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [users, setUsers] = useState([]); // For assignment
    const [categories, setCategories] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        trigger: {
            type: "OnCreate",
            conditions: { category: "", priority: "", keywords: [] },
        },
        actions: [{ type: "AssignTo", params: { userId: "", value: "" } }],
        isActive: true,
    });

    const [keywordInput, setKeywordInput] = useState("");

    useEffect(() => {
        dispatch(setPageTitle({ title: "Workflow Automation" }));
        loadData();
    }, [dispatch]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [rulesData, usersData, categoriesData] = await Promise.all([
                getAutomations(),
                fetchUsers(),
                getCategories(true),
            ]);
            setAutomations(rulesData || []);
            setUsers(usersData || []);
            setCategories(categoriesData || []);
        } catch (error) {
            console.error("Failed to load automation data:", error);
            toast.error("Failed to load automation rules");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (rule = null) => {
        if (rule) {
            setEditingId(rule._id);
            setFormData({
                name: rule.name,
                trigger: {
                    type: rule.trigger.type,
                    conditions: {
                        category: rule.trigger.conditions?.category || "",
                        priority: rule.trigger.conditions?.priority || "",
                        keywords: rule.trigger.conditions?.keywords || [],
                    },
                },
                actions: rule.actions.map((a) => ({
                    type: a.type,
                    params: { ...a.params },
                })),
                isActive: rule.isActive,
            });
        } else {
            setEditingId(null);
            setFormData({
                name: "",
                trigger: {
                    type: "OnCreate",
                    conditions: { category: "", priority: "", keywords: [] },
                },
                actions: [{ type: "AssignTo", params: { userId: "", value: "" } }],
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateAutomation(editingId, formData);
                toast.success("Rule updated successfully");
            } else {
                await createAutomation(formData);
                toast.success("Rule created successfully");
            }
            handleCloseModal();
            loadData();
        } catch (error) {
            toast.error("Failed to save rule");
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this rule?")) {
            try {
                await deleteAutomation(id);
                toast.success("Rule deleted");
                loadData();
            } catch (error) {
                toast.error("Failed to delete rule");
            }
        }
    };

    const handleAddKeyword = (e) => {
        e.preventDefault();
        if (keywordInput.trim()) {
            setFormData({
                ...formData,
                trigger: {
                    ...formData.trigger,
                    conditions: {
                        ...formData.trigger.conditions,
                        keywords: [
                            ...formData.trigger.conditions.keywords,
                            keywordInput.trim(),
                        ],
                    },
                },
            });
            setKeywordInput("");
        }
    };

    const removeKeyword = (index) => {
        const newKeywords = [...formData.trigger.conditions.keywords];
        newKeywords.splice(index, 1);
        setFormData({
            ...formData,
            trigger: {
                ...formData.trigger,
                conditions: { ...formData.trigger.conditions, keywords: newKeywords },
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Automation Rules</h1>
                    <p className="text-base-content/60 text-sm mt-1">
                        Create rules to automate ticket assignments and updates
                    </p>
                </div>
                <button
                    className="btn btn-primary btn-sm gap-2"
                    onClick={() => handleOpenModal()}
                >
                    <PlusIcon className="w-4 h-4" />
                    New Rule
                </button>
            </div>

            {/* Info Alert */}
            <div className="alert bg-base-100 shadow-sm border border-base-200">
                <BoltIcon className="w-5 h-5 text-warning" />
                <div className="text-sm">
                    <span className="font-semibold">How it works:</span> Automation rules
                    run immediately when their trigger event occurs. Use them to route
                    tickets or escalate priorities.
                </div>
            </div>

            {/* Rules List */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center py-10 opacity-50">Loading rules...</div>
                ) : automations.length === 0 ? (
                    <div className="text-center py-16 bg-base-100 rounded-lg border border-dashed border-base-300">
                        <PlayIcon className="w-12 h-12 mx-auto text-base-content/20 mb-4" />
                        <h3 className="text-lg font-semibold">No active rules</h3>
                        <p className="text-base-content/60 text-sm mb-6">
                            Get started by creating your first automation rule.
                        </p>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleOpenModal()}
                        >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Create Rule
                        </button>
                    </div>
                ) : (
                    automations.map((rule) => (
                        <div
                            key={rule._id}
                            className={`card bg-base-100 shadow-sm border border-base-200 transition-all hover:shadow-md ${!rule.isActive ? "opacity-60" : ""
                                }`}
                        >
                            <div className="card-body p-6 flex-row items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-lg">{rule.name}</h3>
                                        {!rule.isActive && (
                                            <span className="badge badge-ghost text-xs">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-base-content/70 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-xs uppercase tracking-wide bg-base-200 px-2 py-0.5 rounded">
                                                Trigger:
                                            </span>
                                            <span>
                                                When{" "}
                                                {rule.trigger.type === "OnCreate"
                                                    ? "Ticket Created"
                                                    : rule.trigger.type === "OnStatusChange"
                                                        ? "Status Changes"
                                                        : "Priority Changes"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-xs uppercase tracking-wide bg-base-200 px-2 py-0.5 rounded">
                                                Action:
                                            </span>
                                            <span>
                                                {rule.actions[0].type === "AssignTo"
                                                    ? "Auto Assign Agent"
                                                    : rule.actions[0].type === "SetPriority"
                                                        ? "Update Priority"
                                                        : "Update Status"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleOpenModal(rule)}
                                        className="btn btn-ghost btn-sm btn-square text-primary"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(rule._id)}
                                        className="btn btn-ghost btn-sm btn-square text-error"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal / Drawer */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-base-100 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-base-200 flex justify-between items-center sticky top-0 bg-base-100 z-10">
                            <h2 className="text-xl font-bold">
                                {editingId ? "Edit Rule" : "Create New Rule"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="btn btn-ghost btn-sm btn-square rounded-full"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Rule Name & Active Status */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Rule Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Auto-assign Urgent Hardware Issues"
                                        className="input input-bordered w-full"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Status</span>
                                    </label>
                                    <label className="cursor-pointer label justify-start gap-4 p-3 border rounded-lg bg-base-50">
                                        <span className="label-text">Active</span>
                                        <input
                                            type="checkbox"
                                            className="toggle toggle-primary toggle-sm"
                                            checked={formData.isActive}
                                            onChange={(e) =>
                                                setFormData({ ...formData, isActive: e.target.checked })
                                            }
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="divider">WHEN</div>

                            {/* Trigger Configuration */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Trigger Event</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={formData.trigger.type}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            trigger: { ...formData.trigger, type: e.target.value },
                                        })
                                    }
                                >
                                    <option value="OnCreate">Ticket is Created</option>
                                    <option value="OnStatusChange">Status is Updated</option>
                                    <option value="OnPriorityChange">Priority is Updated</option>
                                </select>
                            </div>

                            {/* Conditions */}
                            <div className="space-y-4 bg-base-200/50 p-4 rounded-xl border border-base-200">
                                <h3 className="text-sm font-bold uppercase text-base-content/50 tracking-wider">
                                    IF Conditions Match...
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-xs">Category Is</span>
                                        </label>
                                        <select
                                            className="select select-bordered select-sm w-full"
                                            value={formData.trigger.conditions.category}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    trigger: {
                                                        ...formData.trigger,
                                                        conditions: {
                                                            ...formData.trigger.conditions,
                                                            category: e.target.value,
                                                        },
                                                    },
                                                })
                                            }
                                        >
                                            <option value="">Any Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat.name}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-xs">Priority Is</span>
                                        </label>
                                        <select
                                            className="select select-bordered select-sm w-full"
                                            value={formData.trigger.conditions.priority}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    trigger: {
                                                        ...formData.trigger,
                                                        conditions: {
                                                            ...formData.trigger.conditions,
                                                            priority: e.target.value,
                                                        },
                                                    },
                                                })
                                            }
                                        >
                                            <option value="">Any Priority</option>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                            <option value="Urgent">Urgent</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-xs">
                                            Subject contains keywords
                                        </span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="input input-bordered input-sm flex-1"
                                            placeholder="Type keyword and press Enter"
                                            value={keywordInput}
                                            onChange={(e) => setKeywordInput(e.target.value)}
                                            onKeyDown={(e) =>
                                                e.key === "Enter" && handleAddKeyword(e)
                                            }
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm"
                                            onClick={handleAddKeyword}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.trigger.conditions.keywords.map(
                                            (keyword, idx) => (
                                                <div key={idx} className="badge badge-neutral gap-2">
                                                    {keyword}
                                                    <XMarkIcon
                                                        className="w-3 h-3 cursor-pointer"
                                                        onClick={() => removeKeyword(idx)}
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="divider">THEN</div>

                            {/* Actions */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Perform Action
                                    </span>
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select
                                        className="select select-bordered"
                                        value={formData.actions[0].type}
                                        onChange={(e) => {
                                            const newType = e.target.value;
                                            setFormData({
                                                ...formData,
                                                actions: [
                                                    {
                                                        type: newType,
                                                        params: { userId: "", value: "" },
                                                    },
                                                ],
                                            });
                                        }}
                                    >
                                        <option value="AssignTo">Assign Ticket To...</option>
                                        <option value="SetPriority">Set Priority To...</option>
                                        <option value="SetStatus">Set Status To...</option>
                                    </select>

                                    {/* Dynamic Action Parameter Input */}
                                    {formData.actions[0].type === "AssignTo" && (
                                        <select
                                            className="select select-bordered"
                                            value={formData.actions[0].params.userId}
                                            required
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    actions: [
                                                        {
                                                            ...formData.actions[0],
                                                            params: {
                                                                ...formData.actions[0].params,
                                                                userId: e.target.value,
                                                            },
                                                        },
                                                    ],
                                                })
                                            }
                                        >
                                            <option value="">Select Agent</option>
                                            {users.length > 0 ? (
                                                users.map((u) => (
                                                    <option key={u._id} value={u._id}>
                                                        {u.name} ({u.role})
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>Loading users...</option>
                                            )}
                                        </select>
                                    )}

                                    {(formData.actions[0].type === "SetPriority" ||
                                        formData.actions[0].type === "SetStatus") && (
                                            <select
                                                className="select select-bordered"
                                                value={formData.actions[0].params.value}
                                                required
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        actions: [
                                                            {
                                                                ...formData.actions[0],
                                                                params: {
                                                                    ...formData.actions[0].params,
                                                                    value: e.target.value,
                                                                },
                                                            },
                                                        ],
                                                    })
                                                }
                                            >
                                                <option value="">Select value...</option>
                                                {formData.actions[0].type === "SetPriority" ? (
                                                    <>
                                                        <option value="Low">Low</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="High">High</option>
                                                        <option value="Urgent">Urgent</option>
                                                    </>
                                                ) : (
                                                    <>
                                                        <option value="Open">Open</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Resolved">Resolved</option>
                                                    </>
                                                )}
                                            </select>
                                        )}
                                </div>
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingId ? "Update Rule" : "Create Rule"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Automation;

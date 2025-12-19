import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../redux/slices/headerSlice";
import TitleCard from "../components/TitleCard";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getTemplates, deleteTemplate, createTemplate, updateTemplate } from "../utils/templateApi";
import { toast } from "sonner";

function Templates() {
    const dispatch = useDispatch();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        description: "",
        category: "Technical Support",
        priority: "Medium",
        isActive: true,
    });

    useEffect(() => {
        dispatch(setPageTitle({ title: "Ticket Templates" }));
        fetchTemplates();
    }, [dispatch]);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const data = await getTemplates(true);
            setTemplates(data);
        } catch (error) {
            toast.error("Failed to fetch templates");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (template = null) => {
        if (template) {
            setEditingTemplate(template);
            setFormData({
                name: template.name,
                title: template.title,
                description: template.description,
                category: template.category,
                priority: template.priority,
                isActive: template.isActive,
            });
        } else {
            setEditingTemplate(null);
            setFormData({
                name: "",
                title: "",
                description: "",
                category: "Technical Support",
                priority: "Medium",
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTemplate) {
                await updateTemplate(editingTemplate._id, formData);
                toast.success("Template updated successfully");
            } else {
                await createTemplate(formData);
                toast.success("Template created successfully");
            }
            setIsModalOpen(false);
            fetchTemplates();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this template?")) {
            try {
                await deleteTemplate(id);
                toast.success("Template deleted");
                fetchTemplates();
            } catch (error) {
                toast.error("Failed to delete template");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <p className="text-base-content/70">Manage pre-defined configurations for new tickets.</p>
                <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal()}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    New Template
                </button>
            </div>

            <TitleCard title="Available Templates" topMargin="mt-2">
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Default Content</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {templates.map((t) => (
                                <tr key={t._id}>
                                    <td>
                                        <div className="font-bold">{t.name}</div>
                                        <div className="text-sm opacity-50">{t.category}</div>
                                    </td>
                                    <td>
                                        <div className="max-w-xs truncate font-medium">{t.title}</div>
                                        <div className="max-w-xs truncate text-xs opacity-50">{t.description}</div>
                                    </td>
                                    <td>
                                        <div className={`badge ${t.isActive ? "badge-success" : "badge-ghost"}`}>
                                            {t.isActive ? "Active" : "Inactive"}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="btn btn-square btn-ghost btn-xs" onClick={() => handleOpenModal(t)}>
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button className="btn btn-square btn-ghost btn-xs text-error" onClick={() => handleDelete(t._id)}>
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {templates.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">No templates found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </TitleCard>

            {/* Modal for Create/Edit */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-lg mb-4">{editingTemplate ? "Edit Template" : "New Template"}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Template Name</span></label>
                                <input
                                    type="text"
                                    placeholder="e.g., Software Installation"
                                    className="input input-bordered"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Category</span></label>
                                    <select
                                        className="select select-bordered"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Technical Support</option>
                                        <option>Hardware Request</option>
                                        <option>Network Issue</option>
                                        <option>Access Request</option>
                                        <option>Billing</option>
                                        <option>Others</option>
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Priority</span></label>
                                    <select
                                        className="select select-bordered"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                        <option>Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Default Ticket Title</span></label>
                                <input
                                    type="text"
                                    placeholder="e.g., Request for software installation"
                                    className="input input-bordered"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Default Description</span></label>
                                <textarea
                                    className="textarea textarea-bordered h-24"
                                    placeholder="Provide details about the request..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-control w-fit">
                                <label className="label cursor-pointer gap-4">
                                    <span className="label-text">Active</span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                </label>
                            </div>

                            <div className="modal-action">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingTemplate ? "Save Changes" : "Create Template"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Templates;

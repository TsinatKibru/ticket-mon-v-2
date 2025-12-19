import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../redux/slices/headerSlice";
import TitleCard from "../components/TitleCard";
import { PlusIcon, PencilIcon, TrashIcon, PlayIcon } from "@heroicons/react/24/outline";
import { getAutomations, deleteAutomation, createAutomation, updateAutomation } from "../utils/automationApi";
import { toast } from "react-toastify";

function Automation() {
    const dispatch = useDispatch();
    const [automations, setAutomations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAutomation, setEditingAutomation] = useState(null);

    // Rule Builder State
    const [formData, setFormData] = useState({
        name: "",
        trigger: { type: "OnCreate", conditions: { category: "", priority: "", keywords: [] } },
        actions: [{ type: "AssignTo", params: { userId: "", value: "" } }],
        isActive: true,
    });

    useEffect(() => {
        dispatch(setPageTitle({ title: "Workflow Automation" }));
        // fetchAutomations(); // Commented out for now until API is fully ready
        setLoading(false);
    }, [dispatch]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <p className="text-base-content/70">Create rules to automate ticket assignments and updates.</p>
                <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    New Rule
                </button>
            </div>

            <div className="alert alert-info">
                <PlayIcon className="w-6 h-6" />
                <span>Automation rules help reduce manual work by handling repetitive tasks automatically.</span>
            </div>

            <TitleCard title="Active Rules" topMargin="mt-2">
                <div className="text-center py-10">
                    <div className="text-3xl font-bold opacity-20 mb-4">Coming Soon</div>
                    <p className="opacity-50">Automation rules management interface is under development.</p>
                </div>
            </TitleCard>
        </div>
    );
}

export default Automation;

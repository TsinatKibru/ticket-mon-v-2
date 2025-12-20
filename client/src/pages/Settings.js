import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TitleCard from "../components/TitleCard";
import { setPageTitle } from "../redux/slices/headerSlice";
import { useEffect } from "react";
import axios from "axios";
import { setUser } from "../redux/slices/authSlice";
import { toast } from "sonner";
import { UserIcon, UploadIcon, CameraIcon } from "lucide-react";
import { fixImageUrl } from "../utils/imageUtils";

import { getCategories, createCategory, deleteCategory } from "../utils/categoryApi";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

function Settings() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [profileImage, setProfileImage] = useState(user?.profileImage || "/dummyprofile.jpeg");
    const [isUploading, setIsUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [name, setName] = useState(user?.name || "");
    const [isSavingName, setIsSavingName] = useState(false);

    // Category State
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [loadingCategories, setLoadingCategories] = useState(false);

    useEffect(() => {
        dispatch(setPageTitle({ title: "Profile Settings" }));
        if (user?.role === "admin") {
            fetchCategories();
        }
    }, [dispatch, user?.role]);

    useEffect(() => {
        if (user?.name) {
            setName(user.name);
        }
    }, [user?.name]);

    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const data = await getCategories();
            setCategories(data || []);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;
        try {
            await createCategory({ name: newCategory });
            setNewCategory("");
            toast.success("Category added");
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add category");
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Are you sure? This might affect existing tickets.")) return;
        try {
            await deleteCategory(id);
            toast.success("Category deleted");
            fetchCategories();
        } catch (error) {
            toast.error("Failed to delete category");
        }
    };

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Please select a valid image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload immediately
        handleUpload(file);
    };

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append("profileImage", file);

        setIsUploading(true);
        const uploadToast = toast.loading("Uploading profile image...");

        try {
            const response = await axios.post(
                `/api/v1/users/${user._id}/upload-profile-image`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setProfileImage(fixImageUrl(response.data.data.profileImage));
            dispatch(setUser(response.data.data));
            setPreviewImage(null);
            toast.update(uploadToast, {
                render: "Profile image updated successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Error uploading profile image:", error);
            setPreviewImage(null);
            toast.update(uploadToast, {
                render: error.response?.data?.message || "Failed to upload profile image",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleNameUpdate = async () => {
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        if (name === user?.name) {
            toast.info("No changes to save");
            return;
        }

        setIsSavingName(true);
        const saveToast = toast.loading("Updating name...");

        try {
            const response = await axios.put(
                `/api/v1/users/${user._id}`,
                { name },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            dispatch(setUser(response.data.data));
            toast.update(saveToast, {
                render: "Name updated successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Error updating name:", error);
            toast.update(saveToast, {
                render: error.response?.data?.message || "Failed to update name",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
            setName(user?.name || ""); // Reset on error
        } finally {
            setIsSavingName(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Picture Card */}
                <TitleCard title="Profile Picture" topMargin="mt-2">
                    <div className="flex flex-col items-center py-6">
                        <div className="relative group">
                            <div className="avatar">
                                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img
                                        src={previewImage || fixImageUrl(user?.profileImage) || profileImage}
                                        alt="profile"
                                    />
                                </div>
                            </div>
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                    <span className="loading loading-spinner loading-lg text-white"></span>
                                </div>
                            )}
                            <label
                                htmlFor="profileImageUpload"
                                className="absolute bottom-0 right-0 btn btn-circle btn-primary btn-sm cursor-pointer"
                            >
                                <CameraIcon className="h-4 w-4" />
                            </label>
                            <input
                                id="profileImageUpload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageSelect}
                                disabled={isUploading}
                            />
                        </div>
                        <h3 className="text-xl font-bold mt-4">{user?.name}</h3>
                        <p className="text-sm text-base-content/60">{user?.email}</p>
                        <div className="badge badge-primary badge-outline mt-2">{user?.role}</div>
                    </div>
                </TitleCard>

                {/* Profile Information Card */}
                <TitleCard title="Profile Information" topMargin="mt-2" className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control md:col-span-2">
                            <label className="label">
                                <span className="label-text font-semibold">Full Name</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input input-bordered flex-1"
                                    placeholder="Enter your name"
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={handleNameUpdate}
                                    disabled={isSavingName || name === user?.name}
                                >
                                    {isSavingName ? <span className="loading loading-spinner loading-sm"></span> : "Save"}
                                </button>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Email Address</span>
                            </label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                className="input input-bordered"
                                disabled
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Role</span>
                            </label>
                            <input
                                type="text"
                                value={user?.role || ""}
                                className="input input-bordered capitalize"
                                disabled
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Department</span>
                            </label>
                            <input
                                type="text"
                                value={user?.department?.name || "Not Assigned"}
                                className="input input-bordered"
                                disabled
                            />
                        </div>
                    </div>

                    <div className="alert alert-info mt-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>To update your email, role, or department, please contact your administrator.</span>
                    </div>
                </TitleCard>
            </div>

            {/* Category Management for Admins */}
            {user?.role === "admin" && (
                <div className="grid grid-cols-1">
                    <TitleCard title="Category Management" topMargin="mt-2">
                        <div className="mb-6">
                            <form onSubmit={handleAddCategory} className="flex gap-4 items-end">
                                <div className="form-control flex-1">
                                    <label className="label">
                                        <span className="label-text font-semibold">Add New Category</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        placeholder="e.g. Network Issues"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                    />
                                </div>
                                <button className="btn btn-primary" type="submit" disabled={!newCategory.trim()}>
                                    <PlusIcon className="w-5 h-5 mr-2" /> Add Category
                                </button>
                            </form>
                        </div>

                        {loadingCategories ? (
                            <div className="text-center py-4">Loading categories...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Status</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((cat) => (
                                            <tr key={cat._id}>
                                                <td className="font-semibold">{cat.name}</td>
                                                <td><div className="badge badge-success badge-sm">Active</div></td>
                                                <td className="text-right">
                                                    <button
                                                        className="btn btn-ghost btn-xs text-error"
                                                        onClick={() => handleDeleteCategory(cat._id)}
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {categories.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="text-center text-base-content/50">No categories found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </TitleCard>
                </div>
            )}
        </div>
    );
}

export default Settings;

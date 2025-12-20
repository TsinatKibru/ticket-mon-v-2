import Category from "../models/category.model.js";

// Get all categories
export const getCategories = async (req, res, next) => {
    try {
        const { activeOnly } = req.query;
        const query = activeOnly === "true" ? { isActive: true } : {};
        const categories = await Category.find(query).sort({ name: 1 });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

// Create a new category
export const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: "Category already exists" });
        }
        const category = await Category.create(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

// Update a category
export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        next(error);
    }
};

// Delete a category
export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error) {
        next(error);
    }
};

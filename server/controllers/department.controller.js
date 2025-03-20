import Department from "../models/department.model.js";
import User from "../models/user.model.js";

// department.controller.js
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().populate(
      "users",
      "name email role"
    );
    res.status(200).json({ success: true, data: departments });
  } catch (error) {
    next(error);
  }
};

export const getDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id).populate(
      "users",
      "name email role"
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const { name, description, users } = req.body;

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name, description, users },
      { new: true }
    ).populate("users", "name email role");

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Remove department reference from users
    await User.updateMany(
      { department: department._id },
      { $unset: { department: 1 } }
    );

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const assignUserToDepartment = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const department = await Department.findById(req.params.id);
    const user = await User.findById(userId);

    if (!department || !user) {
      return res.status(404).json({ message: "Department or User not found" });
    }
    if (department.users.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User is already assigned to this department",
      });
    }

    // Add user to department
    department.users.push(userId);
    await department.save();

    // Assign department to user
    user.department = department._id;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User assigned to department successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};
export const createDepartment = async (req, res, next) => {
  try {
    const { name, description, users } = req.body;

    const department = new Department({ name, description, users });
    await department.save();

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAssignmentAlgorithm = async (req, res, next) => {
  try {
    const { algorithm } = req.body;

    // Validate the algorithm
    const validAlgorithms = [
      "roundRobin",
      "leastRecentlyAssigned",
      "loadBalancing",
    ];
    if (!validAlgorithms.includes(algorithm)) {
      return res.status(400).json({ message: "Invalid assignment algorithm" });
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { assignmentAlgorithm: algorithm },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      success: true,
      message: "Assignment algorithm updated successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

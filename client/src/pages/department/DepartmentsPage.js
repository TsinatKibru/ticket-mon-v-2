import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../redux/slices/departmentsSlice";
import { DepartmentForm } from "./DepartmentForm";
import { DepartmentList } from "./DepartmentList";
import { setPageTitle } from "../../redux/slices/headerSlice";
import { openModal } from "../../redux/slices/modalSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";

const DepartmentsPage = () => {
  const dispatch = useDispatch();
  const { departments, status, error } = useSelector(
    (state) => state.departments
  );
  const { users } = useSelector((state) => state.user);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Fetch departments on component mount
  useEffect(() => {
    // dispatch(fetchDepartments());
    dispatch(setPageTitle({ title: "Dep. List" }));
  }, [dispatch]);

  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setIsFormOpen(true);
  };

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setIsFormOpen(true);
  };

  const handleDeleteDepartment = (id) => {
    dispatch(
      openModal({
        title: "Confirm Delete!",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          depId: id,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.DEP_DELETE,
          message: "Deleting a Department, Are You sure? ",
        },
      })
    );
  };

  const handleSaveDepartment = (formData) => {
    if (selectedDepartment) {
      // Update existing department
      dispatch(updateDepartment({ ...formData, _id: selectedDepartment._id }));
    } else {
      // Create new department
      dispatch(addDepartment(formData));
    }
    setIsFormOpen(false);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setSelectedDepartment(null);
  };

  return (
    <div className="p-0 md:p-6">
      {isFormOpen ? (
        <DepartmentForm
          department={selectedDepartment}
          onSave={handleSaveDepartment}
          onCancel={handleCancelForm}
          users={users}
        />
      ) : (
        <DepartmentList
          departments={departments}
          status={status}
          error={error}
          onAddDepartment={handleAddDepartment}
          onEditDepartment={handleEditDepartment}
          onDeleteDepartment={handleDeleteDepartment}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default DepartmentsPage;

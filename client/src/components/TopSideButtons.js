import { useDispatch } from "react-redux";
import { openModal } from "../redux/slices/modalSlice";
import { MODAL_BODY_TYPES } from "../utils/globalConstantUtil";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewUserModal = () => {
    dispatch(
      openModal({
        title: "Add New User",
        bodyType: MODAL_BODY_TYPES.USER_ADD_NEW,
      })
    );
  };

  return (
    <div className="inline-block float-right">
      <button
        className="btn px-6 btn-sm normal-case btn-primary"
        onClick={openAddNewUserModal}
      >
        Add New
      </button>
    </div>
  );
};

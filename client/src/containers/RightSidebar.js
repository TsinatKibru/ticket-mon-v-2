import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";
import { useDispatch, useSelector } from "react-redux";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";
import NotificationBodyRightDrawer from "../components/common/NotificationBodyRightDrawer";
import { closeRightDrawer } from "../redux/slices/rightDrawerSlice";
import { markNotificationsAsSeen } from "../redux/slices/notificationSlice";
import ChatDrawerBody from "../components/common/ChatDrawerBody";

function RightSidebar() {
  const { isOpen, bodyType, extraObject, header } = useSelector(
    (state) => state.rightDrawer
  );
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notification.notifications
  );

  const close = (e) => {
    if (header === "Notifications") {
      dispatch(markNotificationsAsSeen());
    }
    dispatch(closeRightDrawer(e));
  };

  return (
    <div
      className={
        " fixed overflow-hidden z-20 bg-gray-900 bg-opacity-0 inset-0 transform ease-in-out " +
        (isOpen
          ? " transition-opacity opacity-100 duration-500 translate-x-0  "
          : " transition-all delay-500 opacity-0 translate-x-full  ")
      }
    >
      <section
        className={
          "w-80 md:w-96  right-0 absolute bg-base-100 h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  " +
          (isOpen ? " translate-x-0 " : " translate-x-full ")
        }
      >
        <div className="relative  pb-5 flex flex-col  h-full">
          {/* Header */}
          <div className="navbar   flex pl-4 pr-4   shadow-md ">
            <button
              className="float-left btn btn-circle btn-outline btn-sm"
              onClick={() => close()}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <span className="ml-2 font-bold text-xl">{header}</span>
          </div>

          {/* ------------------ Content Start ------------------ */}
          <div className="overflow-y-scroll pl-4 pr-4">
            <div className="flex flex-col w-full">
              {/* Loading drawer body according to different drawer type */}
              {
                {
                  [RIGHT_DRAWER_TYPES.NOTIFICATION]: (
                    <NotificationBodyRightDrawer
                      notifications={notifications}
                    />
                  ),
                  [RIGHT_DRAWER_TYPES.CHAT]: (
                    <ChatDrawerBody extraObject={extraObject} />
                  ),
                }[bodyType]
              }
            </div>
          </div>
          {/* ------------------ Content End ------------------ */}
        </div>
      </section>

      <section
        className=" w-screen h-full cursor-pointer "
        onClick={() => close()}
      ></section>
    </div>
  );
}

export default RightSidebar;

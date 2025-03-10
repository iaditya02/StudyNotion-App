import React, { useState } from "react";
import { sidebarLinks } from "../../../data/dashboard-links";
import { logout } from "../../../services/operations/authAPI";
import { useDispatch, useSelector } from "react-redux";
import SidebarLink from "./SidebarLink";
import { useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import ConfirmationModal from "../../common/ConfirmationModal";

const Sidebar = () => {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const { loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const naviagte = useNavigate();

  const [confirmationModal, setConfirmationModal] = useState(null);

  if (authLoading || profileLoading) {
    <div className="flex min-h-[calc(100vh-3.5rem)] justify-center items-center">
      <div className="loader"></div>
    </div>;
  }

  return (
    <div>
      <div
        className=" hidden min-w-[222px] flex-col border-r-[1px] border-r-richblack-700 lg:flex
        h-[calc[100vh-3.5rem)] bg-richblack-800 py-10 h-full"
      >
        <div className=" flex flex-col">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null;

            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} />
            );
          })}
        </div>
        {/* horizontal line */}
        <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />

        <div className=" flex flex-col">
          <SidebarLink
            link={{ name: "Setting", path: "dashboard/setting" }}
            iconName="VscSettingsGear"
          />
          <button
            onClick={() => {
              setConfirmationModal({
                isOpen: true,
                text1: "Are You Sure ? ",
                text2: "Do you want to Logout?",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => {
                  setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
                  dispatch(logout(naviagte));
                },
                btn2Handler: () => {
                  setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
                },
              });
            }}
            className="px-8 py-2 text-sm font-medium text-richblack-300"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>
      {/* mobile navbar  */}
      <div className="flex lg:hidden fixed bottom-0 justify-between items-center px-2 py-1 bg-richblack-900 z-50 w-full">
        <div className="flex flex-row gap-1 w-full justify-between">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null;
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} />
            );
          })}
          <SidebarLink
            link={{ name: "Setting", path: "/dashboard/setting" }}
            iconName="VscSettingsGear"
          />
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default Sidebar;

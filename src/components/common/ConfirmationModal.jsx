import React from "react";
import IconBtn from "./IconBtn";
import { useState } from "react";
import { useEffect } from "react";

const ConfirmationModal = ({ modalData }) => {
  const [showModal, setShowModal] = useState(false);
  const [animation, setAnimation] = useState("");

  useEffect(() => {
    let timer;
    if (modalData.isOpen) {
      setShowModal(true);
      setAnimation("fadeIn");
    } else {
      setAnimation("fadeOut");
      timer = setTimeout(() => setShowModal(false), 300); // Duration of fadeOut animation
    }
    return () => clearTimeout(timer); // Clear timeout if the component unmounts
  }, [modalData.isOpen]);

  if (!showModal) return null;

  return (
    <>
      {showModal && (
        <div>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>
          <div
            className={`modal-container ${animation} w-11/12 max-w-[350px] rounded-lg border border-richblack-400 bg-richblack-800 p-6 z-50 fixed left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2`}
          >
            <p className="text-2xl font-semibold text-richblack-5">
              {modalData.text1}
            </p>
            <p className="mt-3 mb-5 leading-6 text-richblack-200">
              {modalData.text2}
            </p>
            <div className="flex items-center gap-x-4">
              <IconBtn
                onclick={modalData?.btn1Handler}
                text={modalData?.btn1Text}
              />
              <button
                className="cursor-pointer rounded-md bg-richblack-200 py-[8px] px-[20px] font-semibold text-richblack-900"
                onClick={modalData?.btn2Handler}
              >
                {modalData?.btn2Text}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmationModal;

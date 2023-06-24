import { Icon } from "@iconify/react";
import React, { useState } from "react";

const ComplaintModal = ({ complaint, setShowModal }) => {
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 max-w-[450px]  w-full mx-auto">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="relative bg-slate-200 rounded-lg shadow-lg overflow-y-auto w-full py-8">
          <span
            className="hidden md:flex absolute top-0 right-0 m-4 text-gray-500 cursor-pointer"
            onClick={handleCloseModal}
          >
            {/* &times; */}
            <Icon
              className=" text-2xl text-red-600 "
              icon="carbon:close-filled"
            />
          </span>

          <div className=" w-full p-4">
            <h2 className="text-xl text-center capitalize font-bold mb-4">
              {complaint.title}
            </h2>
            <div className="text-[12px] md:text-base flex flex-col gap-2 mb-4">
              <p className=" flex flex-wrap gap-x-2 flex-row ">
                <strong>Status:</strong> {complaint.status}
              </p>
              <p className=" flex flex-wrap gap-x-2 flex-row ">
                <strong>Date Created:</strong> {complaint.dateCreated}
              </p>
              <p className=" flex flex-wrap gap-x-2 flex-row ">
                <strong>Name:</strong>
                <p>
                  {complaint.firstName} {complaint.lastName}
                </p>
              </p>
              <p className=" flex flex-wrap gap-x-2 flex-row ">
                <strong>Email:</strong> {complaint.email}
              </p>
              <p className=" flex flex-wrap gap-x-2 flex-row ">
                <strong>Student Year:</strong> {complaint.studentYear}
              </p>
              <p className=" flex flex-wrap gap-x-2 flex-row ">
                <strong>Phone:</strong> {complaint.phone}
              </p>
              <p className=" flex flex-wrap gap-x-2 flex-row ">
                <strong>Report To:</strong> {complaint.reportTo}
              </p>
              <p className=" flex flex-wrap gap-x-2 flex-row ">
                <strong>Description:</strong> {complaint.description}
              </p>
            </div>
          </div>
          <div className=" flex justify-center  ">
            <span
              className=" flex md:hidden w-full max-w-[100px] rounded-full justify-center  py-2 bg-red-600 text-white md:hidde cursor-pointer"
              onClick={handleCloseModal}
            >
              Close{" "}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComplaintModal;

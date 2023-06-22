import React, { useState } from "react";

const ComplaintModal = ({
  complaint,
  showModal,
  setShowModal,
  onHide,
  onStatusChange,
}) => {
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const [status, setStatus] = useState(complaint.status);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    onStatusChange(complaint.id, e.target.value);
  };
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 max-w-[850px] w-full mx-auto">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="relative bg-white rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
          <span
            className="hidden md:flex absolute top-0 right-0 m-4 text-gray-500 cursor-pointer"
            onClick={handleCloseModal}
          >
            &times;
          </span>

          <div className="md:mt-10 p-4">
            <h2 className="text-xl text-center font-bold mb-4">
              {complaint.title}
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
              <label className="font-semibold" htmlFor="status">
                Status:
              </label>
              <select
                id="status"
                value={status}
                onChange={handleStatusChange}
                className="form-select"
              >
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="text-[12px] md:text-base mb-4">
              <p className=" flex flex-col gap-2 md:flex-row ">
                <strong>Date Created:</strong> {complaint.dateCreated}
              </p>
              <p className=" flex flex-col gap-2 md:flex-row ">
                <strong>Name:</strong>
                <p>
                  {complaint.firstName} {complaint.lastName}
                </p>
              </p>
              <p className=" flex flex-col gap-2 md:flex-row ">
                <strong>Email:</strong> {complaint.email}
              </p>
              <p className=" flex flex-col gap-2 md:flex-row ">
                <strong>Student Year:</strong> {complaint.studentYear}
              </p>
              <p className=" flex flex-col gap-2 md:flex-row ">
                <strong>Phone:</strong> {complaint.phone}
              </p>
              <p className=" flex flex-col gap-2 md:flex-row ">
                <strong>Report To:</strong> {complaint.reportTo}
              </p>
              <p className=" flex flex-col gap-2 md:flex-row ">
                <strong>Description:</strong> {complaint.description}
              </p>
            </div>
          </div>
          <div className=" flex justify-center  ">
            <span
              className=" flex w-full max-w-[100px] rounded-full justify-center  py-2 bg-red-600 text-white md:hidde cursor-pointer"
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

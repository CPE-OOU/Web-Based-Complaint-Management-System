import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import LodgeComplaint from "../components/modal/LodgeComplaint";
import StudentComplaintTable from "../components/StudentComplaintTable";
import { Icon } from "@iconify/react";
import { auth } from "../firebase";

const Student = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    // perform logout logic here, e.g. clearing session storage, redirecting to login page, etc.
    navigate("/");
  };

  const handleMobileNavToggle = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  useEffect(() => {
    // Get the authenticated user's display name
    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName);
    }
    // Check if there is a new notification
    // ...

    // Set the hasNewNotification state
    setHasNewNotification(false);
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <div className="py-8">
      <div className="rounded-2xl bg-slate-200 container mx-auto flex flex-col gap-8">
        <nav className="container rounded-t-2xl mx-auto py-4 px-6 lg:px-32 items-center justify-between flex flex-row bg-slate-200 shadow-md">
          <div>
            <img src={logo} className="w-24" alt="" />
          </div>
          <div className="flex gap-6">
            {/* NOtification Section and Icon */}
            {hasNewNotification ? (
              <Icon
                className="text-oou-purple text-2xl "
                icon="clarity:notification-solid-badged"
              />
            ) : (
              <Icon
                className="text-oou-purple text-2xl "
                icon="clarity:notification-solid"
              />
            )}
            <div className="hidden lg:flex flex-row text-lg lg:text-xl font-bold gap-4">
              {/* <aa> */}
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600"
              >
                Logout
              </button>
            </div>
            <div className="lg:hidden flex flex-row items-center">
              <button
                onClick={handleMobileNavToggle}
                className="text-gray-600 hover:text-oou-purple"
              >
                <svg
                  className="w-6 h-6 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isMobileNavOpen ? (
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M20 11H4v-1h16v1zm0-6H4V4h16v1zm0 12H4v-1h16v1z"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4 5h16v1H4V5zm0 7h16v1H4v-1zm0 5h16v1H4v-1z"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {isMobileNavOpen && (
          <div className="lg:hidden flex flex-col text-lg lg:text-xl font-bold gap-4 px-6 lg:px-32 py-4 bg-slate-200 shadow-md">
            <a
              href="#"
              onClick={handleOpenModal}
              className="text-gray-600 hover:text-oou-purple"
            >
              Lodge Complaints
            </a>
            <button
              onClick={handleLogout}
              className="text-gray-600 w-full flex  hover:text-red-600"
            >
              Logout
            </button>
          </div>
        )}

        <header className="inside-page mx-auto mt-8 lg:mt-36 flex justify-center bg-img">
          <div className="flex flex-col justify-center text-center items-center gap-6 self-center max-w-[850px] px-6">
            <div className=" flex text-2xl  ">
              <p className="text-gray-600">Hello, &nbsp; </p>
              <p className=" uppercase font-bold " > {userName} </p>
            </div>

            <h2 className="text-2xl lg:text-3xl font-bold leading-tight">
              Welcome to the <br /> Complaint Management Portal,
            </h2>
            <p className="text-base lg:text-lg">
              We're here to help you resolve your complaints quickly and easily.
              Simply lodge a complaint using the button below, and we'll do our
              best to address it as soon as possible.
            </p>
            <button
              className="bg-oou-purple text-white py-3 px-6 rounded-full shadow-md hover:bg-indigo-500 hover:text-white transition-all duration-300"
              onClick={handleOpenModal}
            >
              Lodge Complaint
            </button>
            {isModalOpen && (
              <LodgeComplaint handleCloseModal={handleCloseModal} />
            )}
          </div>
        </header>

        <main className="mt-20 flex flex-col gap-8">
          <h2 className="flex flex-row justify-center text-3xl font-bold leading-tight">
            Previous Complaint
          </h2>
          <StudentComplaintTable />
        </main>
      </div>
    </div>
  );
};

export default Student;

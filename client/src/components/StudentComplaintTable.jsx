import React, { useState, useEffect } from "react";
import ComplaintModal from "./modal/ComplaintModal";
import db, { auth } from "../firebase";

const StudentComplaintTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoading(true);
        const unsubscribe = db
          .collection("complaints")
          .where("userId", "==", user.uid)
          .onSnapshot((snapshot) => {
            const complaintData = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              complaintData.push({ id: doc.id, ...data });
            });
            setComplaints(complaintData);
            setIsLoading(false);
          });

        return () => {
          unsubscribe();
        };
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    const filtered = complaints.filter((complaint) => {
      const complaintDate = new Date(complaint.dateCreated);
      const currentDate = new Date();
      const daysDiff = Math.ceil(
        (currentDate.getTime() - complaintDate.getTime()) / (1000 * 3600 * 24)
      );
      const matchesSearch = complaint.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      switch (selectedOption) {
        case "7 Days":
          return matchesSearch && daysDiff <= 7;
        case "Past Month":
          return matchesSearch && daysDiff <= 30;
        case "Past 6 Months":
          return matchesSearch && daysDiff <= 180;
        case "Past Year":
          return matchesSearch && daysDiff <= 365;
        default:
          return matchesSearch;
      }
    });
    setFilteredComplaints(filtered);
  }, [complaints, selectedOption, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOptionChange = (e) => {
    if (e.target.value === "All") {
      setSelectedOption("");
      setFilteredComplaints(complaints);
    } else {
      setSelectedOption(e.target.value);
      const filtered = complaints.filter((complaint) => {
        const date = new Date(complaint.dateCreated);
        const daysAgo = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
        switch (e.target.value) {
          case "7 Days":
            return daysAgo <= 7;
          case "Past Month":
            return daysAgo <= 30;
          case "Past 6 Months":
            return daysAgo <= 180;
          case "Past Year":
            return daysAgo <= 365;
          default:
            return true;
        }
      });
      setFilteredComplaints(filtered);
    }
  };

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  return (
    <>
      <div className="flex flex-col gap-10 mx-auto container border-2 py-[50px] px-[15px] rounded-2xl border-[#D9D9D9]">
        <div className="flex flex-col md:flex-row gap-4 justify-between rounded-xl">
          {/* Search input */}
          <div className=" bg-white w-full max-w-[816px] flex flex-row items-center pl-[10px] text-xl border-2 rounded-xl border-[#D9D9D9]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="#130FC2"
                d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.612 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3l-1.4 1.4ZM9.5 14q1.875 0 3.188-1.313T14 9.5q0-1.875-1.313-3.188T9.5 5Q7.625 5 6.312 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14Z"
              />
            </svg>
            <input
              type="text"
              className="w-full pl-1 py-2 h-full border-[#D9D9D9] rounded-xl"
              placeholder="Search for Complaint by title"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          {/* Filter select */}
          <select
            className="max-w-full md:max-w-[180px] w-full flex flex-row px-6 py-4 border-[#D9D9D9] border-2 rounded-xl"
            value={selectedOption}
            onChange={handleOptionChange}
          >
            <option value="">All</option>
            <option value="7 Days">Last 7 days</option>
            <option value="Past Month">Past month</option>
            <option value="Past 6 Months">Past 6 months</option>
            <option value="Past Year">Past year</option>
          </select>
        </div>
        <section className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p>No complaints found.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-oou-purple text-white text-left ">
                <tr>
                  <th className="py-2 px-4 rounded-l-xl">S/N</th>
                  <th className="py-2 px-4">Title</th>
                  <th className="py-2 px-4">Date Created</th>
                  <th className="py-2 px-4 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint, index) => (
                  <tr
                    key={complaint.id}
                    onClick={() => handleComplaintClick(complaint)}
                    style={{
                      borderBottom: `2px solid ${
                        showModal && complaint.id === selectedComplaint?.id
                          ? "#000000"
                          : "#D9D9D9"
                      }`,
                      cursor: "pointer",
                    }}
                    className={
                      showModal && complaint.id === selectedComplaint?.id
                        ? "bg-gray-400  "
                        : "hover:bg-oou-purple hover:text-white"
                    }
                  >
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className=" capitalize py-2 px-4">{complaint.title}</td>
                    <td className="py-2 px-4">{complaint.status}</td>
                    <td className="py-2 px-4">{complaint.dateCreated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
      {showModal && (
        <ComplaintModal
          complaint={selectedComplaint}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export default StudentComplaintTable;

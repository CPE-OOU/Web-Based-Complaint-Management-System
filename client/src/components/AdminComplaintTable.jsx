import React, { useState, useEffect } from "react";
import ComplaintModal from "./modal/ComplaintModal";
import ReportGenerator from "./ReportGenerator";
import db from "../firebase";

const AdminComplaintTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      const complaintsRef = db.collection("complaints");
      const snapshot = await complaintsRef.get();
      const complaintData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComplaints(complaintData);
      setFilteredComplaints(complaintData);
      setIsLoading(false);
    };

    fetchComplaints();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("categoriesData.json");
      const data = await response.json();
      setCategories(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    // update the filtered complaints whenever the selected option or search query changes
    const filtered = complaints.filter((complaint) => {
      const complaintDate = new Date(complaint.dateCreated);
      const currentDate = new Date();
      const daysDiff = Math.ceil(
        (currentDate.getTime() - complaintDate.getTime()) / (1000 * 3600 * 24)
      );
  
      const matchesTitle = complaint.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesName = `${complaint.firstName} ${complaint.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
  
      let matchesSearch = false;
  
      switch (selectedOption) {
        case "7 Days":
          matchesSearch = (matchesTitle || matchesName) && daysDiff <= 7;
          break;
        case "Past Month":
          matchesSearch = (matchesTitle || matchesName) && daysDiff <= 30;
          break;
        case "Past 6 Months":
          matchesSearch = (matchesTitle || matchesName) && daysDiff <= 180;
          break;
        case "Past Year":
          matchesSearch = (matchesTitle || matchesName) && daysDiff <= 365;
          break;
        default:
          matchesSearch = matchesTitle || matchesName;
      }
  
      return matchesSearch;
    });
  
    setFilteredComplaints(filtered);
  }, [complaints, selectedOption, searchQuery]);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNewCategoryNameChange = (event) => {
    setNewCategoryName(event.target.value);
  };

  const handleAddCategory = (event) => {
    event.preventDefault();
    const newCategory = { id: categories.length + 1, name: newCategoryName };
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
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

  const handleStatusChange = (id, status) => {
    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === id ? { ...complaint, status } : complaint
    );
    setComplaints(updatedComplaints);
    setFilteredComplaints(updatedComplaints);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="flex flex-col gap-10 mx-auto container border-2 py-[50px] px-[15px] rounded-2xl border-[#D9D9D9]">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-oou-blue">Categories</h2>
          <ul className="flex flex-col gap-2">
            {categories.map((category) => (
              <li className="text-lg font-semibold" key={category.id}>
                {category.name}
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <label className="flex flex-col">
              <span className="text-sm">New Category:</span>
              <input
                type="text"
                value={newCategoryName}
                onChange={handleNewCategoryNameChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              />
            </label>
            <button
              type="submit"
              className="bg-oou-blue text-white font-semibold py-0 px-10 rounded-full hover:bg-oou-purple"
            >
              Add
            </button>
          </form>
        </div>

        <div className="flex flex-row gap-4 justify-between rounded-xl">
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
          <select
            className="max-w-[180px] w-full flex flex-row px-6 py-4 border-[#D9D9D9] border-2 rounded-xl"
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
              <thead className="bg-oou-purple text-white text-left">
                <tr>
                  <th className="py-4 px-4 rounded-l-md">S/N</th>
                  <th className="py-4 px-4">Name</th>
                  <th className="py-4 px-4">E-mail</th>
                  <th className="py-4 px-4">Level</th>
                  <th className="py-4 px-4">Phone Number</th>
                  <th className="py-4 px-4 rounded-r-md">Title</th>
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
                    <td className="py-2 px-4 capitalize">
                      {complaint.firstName} {complaint.lastName}
                    </td>
                    <td className="py-2 px-4">{complaint.email}</td>
                    <td className="py-2 px-4">{complaint.studentYear}</td>
                    <td className="py-2 px-4">{complaint.phone}</td>
                    <td className="py-2 px-4">{complaint.title}</td>
                  </tr>
                ))}
              </tbody>
              {showModal && (
                <ComplaintModal
                  complaint={selectedComplaint}
                  setShowModal={setShowModal}
                  onStatusChange={handleStatusChange}
                />
              )}
            </table>
          )}
        </section>
        <div>
          You have selected: {selectedOption ? selectedOption : "All"}
        </div>
        <ReportGenerator complaints={complaints} />
      </div>
    </>
  );
};

export default AdminComplaintTable;

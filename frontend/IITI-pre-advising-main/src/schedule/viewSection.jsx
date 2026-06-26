import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import arrow from "../assets/photo/arrow.png";
import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";
import ViewSchedule from "./viewSchedule";

const ViewSection = () => {
  const location = useLocation();
  const year = location.state?.year || "1";

  const generateSections = (year) => {
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    return letters.map((letter) => `BSIT ${year}${letter}`);
  };

  const sections = generateSections(year);

  const [showModal, setShowModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [search, setSearch] = useState("");

  const filteredSections = sections.filter((section) =>
    section.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-gray-100 h-screen pl-[55%] md:pl-88 font-RB w-full flex flex-col">
      {/* HEADER */}
      <div className="p-5 border-b-5 border-[#D9D9D9]">
        {/* TOP ROW */}
        <div className="flex justify-between px-6 items-center">
          <Link to="/schedule">
            <button>
              <img src={arrow} className="cursor-pointer" />
            </button>
          </Link>

          <Link to="/profile">
            <div className="flex-col cursor-pointer active:scale-95">
              <img src={adminLogo} alt="admin" className="h-10.5 w-10.5" />
              <h1 className="text-xs text-center">Admin</h1>
            </div>
          </Link>
        </div>

        {/* SECOND ROW */}
        <div className="flex justify-between px-6 items-center mt-4">
          <h1 className="font-bold text-2xl p-5">Schedule</h1>

          <input
            type="text"
            placeholder="Search Section"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1"
          />
        </div>
      </div>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto px-5 sm:px-14 py-6">
        <div className="space-y-2">
          {filteredSections.length > 0 ? (
            filteredSections.map((section, index) => (
              <div
                key={index}
                className="bg-gray-300 rounded-lg px-8 py-3 flex justify-between items-center"
              >
                <span className="text-base">{section}</span>

                <button
                  className="text-base hover:underline cursor-pointer"
                  onClick={() => {
                    setSelectedSection(section);
                    setShowModal(true);
                  }}
                >
                  View
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-5">No results found</p>
          )}
        </div>
      </main>

      {/* MODAL */}
      <ViewSchedule
        show={showModal}
        onClose={() => setShowModal(false)}
        yearSection={selectedSection}
      />
    </div>
  );
};

export default ViewSection;

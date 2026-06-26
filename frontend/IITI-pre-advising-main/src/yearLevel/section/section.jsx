
import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import back from "../../assets/photo/arrow.png";
import adminLogo from '../../dashboard/dashboardLOGO/adminLogo.png'
import next from "../../assets/photo/next.png";


const sections = [
  { name: "BSIT 1A", active: true },
  { name: "BSIT 1B" },
  { name: "BSIT 1C" },
  { name: "BSIT 1D" },
  { name: "BSIT 1E" },
  { name: "BSIT 1F" },
  { name: "BSIT 1G", active: true },
  { name: "BSIT 1H" },
  { name: "BSIT 1I" },
  { name: "BSIT 1J" },
  { name: "BSIT 1K" },
  { name: "BSIT 1L" },
];

const BSITSections = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="bg-gray-100  h-full pl-[55%] md:pl-88 font-RB w-full">
      {/* Header */}
     <div className=' p-5 pt-14 flex justify-between
                            border-b-5 border-[#D9D9D9]'>
    
        <div className="flex flex-col items-start gap-1 text-[25px]">
        <Link to='/year-level'>
            <img src={back} alt="Back" className="w-4 h-4" />
        </Link>
          <div className="flex items-center gap-3">
            <span className="font-bold text-black/50">BSIT 1st Year</span>
            <img src={next} alt="Next" className="w-4 h-4" />
            <span className="font-bold text-black">Sections</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#E5E5E5] rounded-full px-4 py-2 w-65">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>

            <div className="w-px h-5 bg-gray-400 mr-2"></div>

            <input
              type="text"
              placeholder="Search Student"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-full placeholder-gray-500"
            />
          </div>

          <div className='flex-col  cursor-pointer active:scale-95'>
              <img 
                  src={adminLogo} 
                  alt="admin" 
                  className=' h-10.5 w-10.5 '
              />
              <h1 className='text-xs text-center '>Admin</h1>
          </div>
        </div>

      </div>

      {/* Sections Grid */}
      <div className="p-6 flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {sections.map((section, index) => (
            
            <div
              key={index}
              className="bg-white rounded-2xl border border-[#D5D5D5] shadow-md w-57.25 h-62.75 cursor-pointer"
            >
            <Link to="/list">
              <div
                className={`px-4 py-3 ${
                  section.active
                    ? "bg-green-700 text-white rounded-t-2xl"
                    : ""
                }`}
              >
                <h3
                  className={`font-semibold ${
                    section.active ? "text-white" : "text-gray-700"
                  }`}
                >
                  {section.name}
                </h3>
                <p className={`text-sm ${section.active ? "text-white" : "text-gray-500"}`}>
                  No. of Student Enrolled
                </p>
              </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BSITSections;
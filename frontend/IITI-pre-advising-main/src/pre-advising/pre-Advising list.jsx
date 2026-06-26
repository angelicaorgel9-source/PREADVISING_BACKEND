import React, { useState } from "react";
import { Link } from "react-router-dom";

import arrow from "../assets/photo/arrow.png";
import next from "../assets/photo/next.png";
import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";

const PreAdvisingList = () => {
  const [search, setSearch] = useState("");

  const students = [
    {
      name: "Rein Paul Asinas",
      section: "1A",
      email: "202310010@btech.ph.education",
      number: "202310010",
    },
    {
      name: "John Doe",
      section: "1A",
      email: "202310011@btech.ph.education",
      number: "202310011",
    },
    {
      name: "Jane Smith",
      section: "1A",
      email: "202310012@btech.ph.education",
      number: "202310012",
    },
  ];

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase()) ||
    student.number.includes(search)
  );

  return (
    <div className="bg-gray-100 h-full pl-[55%] md:pl-88 font-sans w-full min-h-screen">
      
      {/* Header */}
      <div className="p-5 pt-14 flex justify-between border-b-5 border-[#D9D9D9] items-center">
        <div className="flex flex-col items-start gap-1 text-[25px]">
          <Link to="/pre-advising">
            <img src={arrow} alt="Back" className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-bold text-black/50">BSIT 1st Year</span>
            <img src={next} alt="Next" className="w-3 h-3 opacity-50" />
            <span className="font-bold text-black/50">Sections</span>
            <img src={next} alt="Next" className="w-3 h-3" />
            <span className="font-bold text-black">1A</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#E5E5E5] rounded-full px-4 py-1.5 w-60">
            <input
              type="text"
              placeholder="Search Student"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-xs w-full placeholder-gray-500"
            />
          </div>

          <Link to="/profile">
            <div className="flex-col cursor-pointer active:scale-95 text-center">
              <img src={adminLogo} alt="admin" className="h-10 w-10 mx-auto" />
              <h1 className="text-xs">Admin</h1>
            </div>
          </Link>
        </div>
      </div>

      <main className="px-8 py-6">
        {/* Table Header */}
        <div className="flex px-4 mb-2 text-gray-700 font-semibold text-[16px]">
          <div className="w-1/4">Student Name</div>
          <div className="w-1/6 text-center">Section</div>
          <div className="w-1/3">Student Email</div>
          <div className="w-1/4 text-center">Student Number</div>
        </div>

        {/* Student List Container */}
        <div className="shadow-sm">
          <div className="overflow-y-auto">
            <div className="px-4 flex flex-col space-y-1">
              
              {/* Dynamic Student Rows */}
{filteredStudents.length > 0 ? (
  filteredStudents.map((student, index) => (
    <Link 
      key={index} 
      to="/pre-advising-1st-sem" 
      className="block no-underline"
    >
      <div className="flex border bg-[#D9D9D9]/50 border-black hover:bg-gray-200 cursor-pointer h-6 items-center px-2 text-sm transition-colors">
        <div className="w-1/4">{student.name}</div>
        <div className="w-1/6 text-center">{student.section}</div>
        <div className="w-1/3 text-xs">{student.email}</div>
        <div className="w-1/4 text-center">{student.number}</div>
      </div>
    </Link>
  ))
) : (
  <div className="text-center py-2 text-gray-500 text-sm">
    No student found
  </div>
)}

              {/* Empty Rows linked to the same destination */}
              {[...Array(5)].map((_, index) => (
                <Link to="/pre-advising-1st-sem" key={`empty-${index}`} className="block no-underline">
                  <div className="flex border border-black h-6 items-center px-2 bg-[#D9D9D9]/50 hover:bg-gray-200 cursor-pointer"></div>
                </Link>
              ))}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PreAdvisingList;
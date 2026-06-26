import React from "react";
import { Link, useNavigate } from "react-router-dom";
import arrow from "../assets/photo/arrow.png";
import next from "../assets/photo/next.png";
import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";

const StudentGrades = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F5F5F5] font-sans min-h-screen">

      <div className="h-full pl-[55%] md:pl-88 w-full min-h-screen">

        {/* HEADER */}
        <div className="p-5 pt-14 flex justify-between items-start border-b-[5px] border-[#D9D9D9] sticky top-0 bg-gray-100 z-10">

          {/* LEFT SIDE */}
          <div className="flex flex-col items-start gap-1 text-[20px]">
            
            <Link to="/pre-advising-list">
              <img
                src={arrow}
                alt="Back"
                className="w-4 h-4 cursor-pointer active:scale-95"
              />
            </Link>

            <div className="flex items-center gap-3">
              <span className="font-bold text-black/50">
                BSIT First Year Students
              </span>
              <img src={next} className="w-4 h-4" />
              <span className="font-bold text-black/50">Student</span>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <Link to="/profile">
            <div className="flex flex-col items-center cursor-pointer active:scale-95">
              <img
                src={adminLogo}
                className="h-10 w-10"
                alt="Admin"
              />
              <h1 className="text-xs text-center">Admin</h1>
            </div>
          </Link>

        </div>

        {/* MAIN */}
        <main className="max-w-6xl mx-auto p-8 text-sm">

          {/* STUDENT INFO */}
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-2">
              <h1>
                Name : <span className="ml-2">Rein Paul C. Asinas</span>
              </h1>
              <h1>
                Year and Section : <span className="ml-2">BSIT 1A</span>
              </h1>
            </div>
          </div>

          {/* SEMESTER + ID */}
          <div className="flex justify-between items-center mb-10">

            <div className="flex flex-col">
              <label className="bg-[#F5F5F5] px-1 text-[10px] text-gray-500">
                Select Semester
              </label>

              <select
                defaultValue="2nd"
                onChange={(e) => {
                  if (e.target.value === "1st") {
                    navigate("/pre-advising-1st-sem");
                  }
                }}
                className="border border-gray-400 px-4 py-2 pr-8 bg-white text-sm outline-none"
              >
                <option value="1st">1st Semester 2023 - 2024</option>
                <option value="2nd">2nd Semester 2023 - 2024</option>
              </select>
            </div>

            <div className="border border-gray-300 bg-white shadow px-6 py-2 text-sm">
              Student Id : <span className="ml-2">202310010</span>
            </div>

          </div>

          {/* TABLE HEADER */}
          <div className="grid grid-cols-6 text-center text-sm mb-6 px-2">
            <div></div>
            <div>Prelim</div>
            <div>Midterm</div>
            <div>Pre-Final</div>
            <div>Final</div>
            <div>Final Grade</div>
          </div>

          {/* SUBJECT ROWS */}
          <div className="space-y-2">

            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-6 items-center border-b border-gray-300 py-2 px-2"
              >
                <div className="text-left">
                  <h2>Subject Code {item}</h2>
                  <p className="text-[11px] text-gray-600">Marvic Ablaza</p>
                </div>

                <div className="text-center">1.50</div>
                <div className="text-center">1.00</div>
                <div className="text-center">1.25</div>
                <div className="text-center">1.25</div>
                <div className="text-center">1.25</div>
              </div>
            ))}

          </div>

        </main>

      </div>
    </div>
  );
};

export default StudentGrades;
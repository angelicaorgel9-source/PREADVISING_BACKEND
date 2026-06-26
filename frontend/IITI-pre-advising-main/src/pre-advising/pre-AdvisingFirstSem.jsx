import React from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ added useNavigate
import arrow from "../assets/photo/arrow.png";
import next from "../assets/photo/next.png";
import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";

const subjects = [
  {
    code: "Subject Code 1",
    teacher: "Marvic Ablaza",
    grades: [1.5, 1.0, 1.25, 1.25, 1.25],
  },
  {
    code: "Subject Code 2",
    teacher: "Marvic Ablaza",
    grades: [0, 0, 0, 0, 0],
    danger: true,
  },
  {
    code: "Subject Code 3",
    teacher: "Marvic Ablaza",
    grades: [1.5, 1.0, 1.25, 1.25, 1.25],
  },
  {
    code: "Subject Code 4",
    teacher: "Marvic Ablaza",
    grades: [1.5, 1.0, 1.25, 1.25, 1.25],
  },
  {
    code: "Subject Code 5",
    teacher: "Marvic Ablaza",
    grades: [1.5, 1.0, 1.25, 1.25, 1.25],
  },
  {
    code: "Subject Code 6",
    teacher: "Marvic Ablaza",
    grades: [1.5, 1.0, 1.25, 1.25, 1.25],
  },
  {
    code: "Subject Code 7",
    teacher: "Marvic Ablaza",
    grades: [1.5, 1.0, 1.25, 1.25, 1.25],
  },
  {
    code: "Subject Code 8",
    teacher: "Marvic Ablaza",
    grades: [1.5, 1.0, 1.25, 1.25, 1.25],
  },
  {
    code: "Subject Code 9",
    teacher: "Marvic Ablaza",
    grades: [1.5, 1.0, 1.25, 1.25, 1.25],
  },
];

const StudentGrades = () => {
  const navigate = useNavigate(); // ✅ added

  return (
    <div className="bg-[#F5F5F5] font-sans min-h-screen w-full">

      <div className="h-full pl-[55%] md:pl-88 w-full min-h-screen">

        {/* HEADER */}
        <div className="p-5 pt-14 flex justify-between items-start border-b-[5px] border-[#D9D9D9] sticky top-0 bg-gray-100 z-10">

          {/* LEFT */}
          <div className="flex flex-col items-start gap-1 text-[20px]">

            {/* ✅ FIXED */}
            <Link to="/section">
              <img src={arrow} alt="Back" className="w-4 h-4 cursor-pointer active:scale-95" />
            </Link>

            <div className="flex items-center gap-3">
              <span className="font-bold text-black/50">BSIT First Year Students</span>
              <img src={next} className="w-4 h-4" />
              <span className="font-bold text-black/50">Student</span>
            </div>
          </div>

          {/* RIGHT */}
          {/* ✅ FIXED */}
          <Link to="/profile">
            <div className="flex flex-col items-center cursor-pointer active:scale-95">
              <img src={adminLogo} className="h-10 w-10" />
              <h1 className="text-xs text-center">Admin</h1>
            </div>
          </Link>

        </div>

        {/* MAIN */}
        <main className="max-w-6xl mx-auto p-8 text-sm">

          {/* Student Info */}
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

          {/* Semester + ID */}
          <div className="flex justify-between items-center mb-10">

            <div className="flex flex-col">
              <label className="bg-[#F5F5F5] px-1 text-[10px] text-gray-500">
                Select Semester
              </label>

              {/* ✅ FIXED SELECT */}
              <select
                defaultValue="1st"
                onChange={(e) => {
                  if (e.target.value === "2nd") {
                    navigate("/pre-advising-2nd-sem");
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

          {/* Table Header */}
          <div className="grid grid-cols-6 text-center text-sm mb-6 px-2">
            <div></div>
            <div>Prelim</div>
            <div>Midterm</div>
            <div>Pre-Final</div>
            <div>Final</div>
            <div>Final Grade</div>
          </div>

          {/* SUBJECTS */}
          <div className="space-y-2">
            {subjects.map((sub, index) => (
              <div
                key={index}
                className={`grid grid-cols-6 items-center border-b border-gray-300 py-2 px-2 ${
                  sub.danger ? "text-red-500" : ""
                }`}
              >
                <div className="text-left">
                  <h2>{sub.code}</h2>
                  <p className="text-[11px] text-gray-600">{sub.teacher}</p>
                </div>

                {sub.grades.map((g, i) => (
                  <div key={i} className="text-center">
                    {g}
                  </div>
                ))}
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default StudentGrades;
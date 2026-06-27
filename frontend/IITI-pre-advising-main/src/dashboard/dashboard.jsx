import React, { useState } from "react";
import "./dashboard.css";
import { Link } from "react-router-dom";
import adminLogo from "./dashboardLOGO/adminLogo.png";
import search from "../assets/photo/search.png";
import { getStudentDetails } from "../../api.js";

function Dashboard() {
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentYear, setStudentYear] = useState("");
  const [studentSection, setStudentSection] = useState("");
  const [subjectRows, setSubjectRows] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const displayedSubjectRows = subjectRows.slice(0, 10);
  const emptySubjectRows = Math.max(0, 10 - displayedSubjectRows.length);

  const handleFetchStudent = async () => {
    setErrorMessage("");
    setSubjectRows([]);

    if (!studentName.trim() || !studentId.trim()) {
      setErrorMessage("Please enter both student name and student number.");
      return;
    }

    try {
      setLoading(true);
      const response = await getStudentDetails(studentId.trim());
      if (!response || !response.success) {
        setErrorMessage(response?.error || "Student not found.");
        return;
      }

      const student = response.data?.student || {};
      const grades = Array.isArray(response.data?.grades) ? response.data.grades : [];

      if (student.name && student.name.toLowerCase().includes(studentName.trim().toLowerCase()) === false) {
        // keep result, but note mismatch if name provided doesn't match fetched record
        setErrorMessage("Student number found, but the entered name does not match the record.");
      }

      setStudentName(student.name || studentName);
      setStudentId(student.number || studentId);
      setStudentYear(student.year_level || "");
      setStudentSection(student.section || "");

      const normalizedSubjects = grades.map((subject) => ({
        code: subject.code || subject.subject_code || subject.subjectCode || "",
        title: subject.title || subject.subject_title || "-",
        units: subject.units || subject.unit || subject.credit_units || "-",
        status:
          subject.status && ["completed", "credited", "passed"].includes(subject.status.toLowerCase())
            ? "Completed"
            : "Missing",
      }));

      setSubjectRows(normalizedSubjects);
    } catch (error) {
      setErrorMessage("Unable to load student details.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" h-full pl-[55%] md:pl-88 font-RB w-full">
      <div>
        {/*Title and admin*/}
        <div
          className="px-5 pt-2 flex justify-between
                            border-b-5 border-[#D9D9D9]"
        >
          <h1 className="font-bold text-2xl p-5">Dashboard</h1>
          <Link to="/profile">
            <div className="flex-col cursor-pointer active:scale-95">
              <img src={adminLogo} alt="admin" className="h-10.5 w-10.5" />
              <h1 className="text-xs text-center">Admin</h1>
            </div>
          </Link>
        </div>

        {/* MAIN CONTENT */}
        <div className="p-3 grid grid-rows-2 gap-2 h-full">
          {/* FIRST ROW */}
          <div className="grid grid-cols-2 gap-2">
            {/* TOP LEFT - Student Tabs */}
            <div className="rounded-lg p-3.5">
              <div className="flex w-full gap-2 mb-4">
                <button className="flex-1 bg-[#1C6100] text-white text-sm px-4 py-1.5 rounded-md">
                  Total Student
                </button>
                <button className="flex-1 border text-sm px-4 py-1.5 rounded-md text-gray-500">
                  Regular Student
                </button>
                <button className="flex-1 border text-sm px-4 py-1.5 rounded-md text-gray-500 bg-[#FFF8E7]">
                  Irregular Student
                </button>
              </div>
            </div>

            {/* TOP RIGHT - Student Management */}
            <div className="border rounded-lg p-3.5">
              <h2 className="border-b pb-1.5 text-sm font-semibold text-gray-500 mb-3">
                Student Management
              </h2>

              {/* Search */}
              <div className="flex gap-2 mb-3">
                <div className="flex items-center w-2/3 border rounded-md px-2 py-1">
                  <input
                    type="text"
                    className="text-sm outline-none w-full"
                    placeholder="Search Student"
                  />
                  <img src={search} alt="search" className="w-4 h-4 ml-2" />
                </div>
                <button className="border flex-1 rounded-md px-4 py-1 text-sm text-gray-500 whitespace-nowrap"></button>
                <button className="border flex-1 rounded-md px-4 py-1 text-sm text-gray-500 whitespace-nowrap"></button>
              </div>

              {/* Table */}
              <div className="border border-[#D9D9D9]/50 rounded-md overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr] bg-[#1C6100] text-white text-sm">
                  <span className="px-2 py-2 border-r border-white/30">
                    Student Number
                  </span>
                  <span className="px-2 py-2 border-r border-white/30 text-center">
                    Name
                  </span>
                  <span className="px-2 py-2 border-r border-white/30 text-center">
                    Status
                  </span>
                  <span className="px-2 py-2"></span>
                </div>
                {/* Sample Row */}
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr] text-sm h-8 items-center border-b border-[#D9D9D9]/50">
                  <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center">
                    123213213213
                  </span>
                  <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center justify-center">
                    Juan Dela Cruz
                  </span>
                  <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center justify-center">
                    Regular
                  </span>
                  <span className="px-2 h-full flex items-center"></span>
                </div>
                {/* Empty Rows */}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_1fr_1fr_1fr] text-sm h-8 items-center border-b border-[#D9D9D9]/50"
                  >
                    <span className="px-2 border-r border-[#D9D9D9]/50 h-full" />
                    <span className="px-2 border-r border-[#D9D9D9]/50 h-full" />
                    <span className="px-2 border-r border-[#D9D9D9]/50 h-full" />
                    <span className="px-2 h-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="grid grid-cols-2 gap-2">
            {/* BOTTOM LEFT - Student Info + Subjects */}
            <div className="border rounded-lg p-3.5 flex flex-col gap-2">
              {/* Student Info Fields */}
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Student Name:"
                  className="border rounded-md p-1.5 text-sm w-full"
                />
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Student ID:"
                  className="border rounded-md p-1.5 text-sm w-full"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={studentYear}
                  readOnly
                  placeholder="Year Level:"
                  className="border rounded-md p-1.5 text-sm w-1/2 bg-gray-50"
                />
                <input
                  type="text"
                  value={studentSection}
                  readOnly
                  placeholder="Section:"
                  className="border rounded-md p-1.5 text-sm w-1/2 bg-gray-50"
                />
              </div>
              <button
                type="button"
                onClick={handleFetchStudent}
                className="mt-3 bg-[#1C6100] text-white px-4 py-2 rounded-md"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load Student Subjects"}
              </button>
              {errorMessage ? (
                <div className="text-sm text-red-500 mt-2">{errorMessage}</div>
              ) : null}

              {/* Subject Table */}
              <div className="border border-[#D9D9D9]/50 rounded-md overflow-hidden">
                {/* Subject Table Header */}
                <div className="grid grid-cols-[80px_1fr_60px_100px] bg-[#1C6100] text-white text-sm text-center">
                  <span className="px-2 py-2 border-r border-white/30">
                    Code
                  </span>
                  <span className="px-2 py-2 border-r border-white/30">
                    Subject Title
                  </span>
                  <span className="px-2 py-2 border-r border-white/30">
                    Units
                  </span>
                  <span className="px-2 py-2">Status</span>
                </div>
                {displayedSubjectRows.length > 0 ? (
                  displayedSubjectRows.map((subject, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[80px_1fr_60px_100px] text-sm h-8 items-center border-b border-[#D9D9D9]/50"
                    >
                      <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center">
                        {subject.code}
                      </span>
                      <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center truncate">
                        {subject.title || "-"}
                      </span>
                      <span className="px-2 border-r border-[#D9D9D9]/50 h-full flex items-center justify-center">
                        {subject.units || "-"}
                      </span>
                      <span
                        className={`px-2 h-full flex items-center justify-center ${
                          subject.status === "Completed"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {subject.status || "Missing"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-[80px_1fr_60px_100px] text-sm h-8 items-center border-b border-[#D9D9D9]/50">
                    <span className="px-2 border-r border-[#D9D9D9]/50 h-full" />
                    <span className="px-2 border-r border-[#D9D9D9]/50 h-full" />
                    <span className="px-2 border-r border-[#D9D9D9]/50 h-full" />
                    <span className="px-2 h-full" />
                  </div>
                )}
                {[...Array(emptySubjectRows)].map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="grid grid-cols-[80px_1fr_60px_100px] text-sm h-8 items-center border-b border-[#D9D9D9]/50"
                  >
                    <span className="px-2 border-r border-[#D9D9D9]/50 h-full" />
                    <span className="px-2 border-r border-[#D9D9D9]/50 h-full" />
                    <span className="px-2 border-r border-[#D9D9D9]/50 h-full" />
                    <span className="px-2 h-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* BOTTOM RIGHT - Schedule */}
            <div className="border rounded-lg p-3.5">
              <div className="border border-[#D9D9D9]/50 rounded-md overflow-hidden">
                {/* Schedule Header */}
                <div className="grid grid-cols-3 bg-[#1C6100] text-white text-sm">
                  <span className="px-2 py-2 border-r border-white/30 text-center">
                    Day
                  </span>
                  <span className="px-2 py-2 border-r border-white/30 text-center">
                    Time
                  </span>
                  <span className="px-2 py-2 text-center">Subject</span>
                </div>
                {/* Empty Rows */}
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 text-sm h-8 items-center border-b border-[#D9D9D9]/50"
                  >
                    <span className="px-2 border-r border-[#D9D9D9]/50 h-full" />
                    <span className="px-2 border-r border-[#D9D9D9]/50 h-full" />
                    <span className="px-2 h-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

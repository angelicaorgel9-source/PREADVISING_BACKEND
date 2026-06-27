import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import back from "../../assets/photo/arrow.png";
import adminLogo from "../../dashboard/dashboardLOGO/adminLogo.png";
import { getStudentDetails } from "../../api.js";


const StudentGrades = () => {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("id") || "";

  const [studentName, setStudentName] = useState("");
  const [yearSection, setYearSection] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("1st Semester 2023 - 2024");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!studentId) {
      setError("No student id provided.");
      setStudentName("");
      setYearSection("");
      setStudentNumber("");
      setSubjects([]);
      return;
    }

    const fetchStudent = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getStudentDetails(studentId);
        if (!response || !response.success) {
          setError(response?.error || "Unable to load student details.");
          setSubjects([]);
          return;
        }

        const student = response.data?.student || {};
        const grades = Array.isArray(response.data?.grades) ? response.data.grades : [];

        setStudentName(student.name || student.full_name || "");
        setStudentNumber(student.number || student.student_no || student.student_number || studentId);
        const status = (student.status || "").toLowerCase();
        setYearSection(status === "irregular" ? "Irregular" : student.section || "");

        setSelectedSemester(
          grades.length > 0
            ? grades[0].semester || grades[0].semesters || "1st Semester 2023 - 2024"
            : "1st Semester 2023 - 2024"
        );

        const normalized = grades.map((subject) => ({
          code: subject.code || subject.subject_code || subject.subjectCode || "",
          instructor: subject.instructor || subject.teacher || "",
          prelim: subject.prelim || subject.prelim_grade || "",
          midterm: subject.midterm || subject.midterm_grade || "",
          preFinal: subject.preFinal || subject.pre_final || "",
          final: subject.final || subject.final_period || "",
          finalGrade: subject.finalGrade || subject.grade || subject.final_grade || "",
        }));

        setSubjects(normalized);
      } catch (err) {
        setError("Unable to load student details.");
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  return (
    <div className="h-full pl-[55%] md:pl-88 font-RB w-full bg-[#F5F5F5] min-h-screen">
      {/* Header */}
      <div className="p-5 bg-gray-100 pt-14 flex justify-between border-b-5 border-[#D9D9D9] sticky top-0">
        <div className="flex-col cursor-pointer active:scale-95">
          <Link to="/list">
            <img src={back} alt="Back" className="w-4 h-4" />
          </Link>
        </div>

        <Link to="/profile">
          <div className="flex-col cursor-pointer active:scale-95">
            <img src={adminLogo} alt="admin" className="h-10.5 w-10.5" />
            <h1 className="text-xs text-center">Admin</h1>
          </div>
        </Link>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-8 text-sm ">
        {/* Top Info Row */}
        <div className="flex justify-between items-start mb-8">
          {/* Left Info */}
          <div className="space-y-2">
            <h1>
              Name : <span className="ml-2">{studentName}</span>
            </h1>
            <h1>
              Year and Section : <span className="ml-2">{yearSection}</span>
            </h1>
          </div>

        </div>

        {/* Semester + Student ID */}
        <div className="flex justify-between items-center mb-10">
          {/* Semester Dropdown */}
        <div className="flex flex-col ">
          <label className=" bg-[#F5F5F5] px-1 text-[10px] text-gray-500">
            Select Semester
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="border border-gray-400 px-4 py-2 pr-8 bg-white text-sm outline-none"
          >
            <option>1st Semester 2023 - 2024</option>
            <option>2nd Semester 2023 - 2024</option>
          </select>
        </div>

          {/* Student ID */}
          <div className="border border-gray-300 bg-white shadow px-6 py-2 text-sm">
            Student Id : <span className="ml-2">{studentNumber}</span>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="text-center py-6 text-gray-500">Loading student grades...</div>
        ) : null}

        {/* Table Header */}
        <div className="grid grid-cols-6 text-center text-sm mb-6 px-2">
          <div></div>
          <div>Prelim</div>
          <div>Midterm</div>
          <div>Pre-Final</div>
          <div>Final</div>
          <div>Final Grade</div>
        </div>

        {/* Subject Rows */}
        <div className="space-y-2">
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="grid grid-cols-6 items-center border-b border-gray-300 py-2 px-2 text-sm"
            >
              {/* Subject Info */}
              <div className="text-left">
                <h2>{subject.code}</h2>
                <p className="text-[11px] text-gray-600">{subject.instructor}</p>
              </div>

              {/* Grades */}
              <div className="text-center">{subject.prelim}</div>
              <div className="text-center">{subject.midterm}</div>
              <div className="text-center">{subject.preFinal}</div>
              <div className="text-center">{subject.final}</div>
              <div className="text-center">{subject.finalGrade}</div>
            </div>
          ))}
        </div>

        {/* GWA */}
        <div className="flex justify-end mt-4 text-sm">
          <span className="mr-3">GWA :</span>
          <span className="text-green-700">1.23456</span>
        </div>
      </main>
    </div>
  );
};

export default StudentGrades;
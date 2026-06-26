import React, { useState } from "react";
import Close from "../assets/photo/Close.png";

const curriculum = {
  "First Year": {
    "First Semester": [
      {
        code: "CC101",
        title: "Introduction to Computing",
        lec: 2,
        lab: 3,
        units: 3,
      },
      {
        code: "CC102",
        title: "Computer Programming 1",
        lec: 2,
        lab: 3,
        units: 3,
      },
    ],
    "Second Semester": [
      {
        code: "CC103",
        title: "Computer Programming 2 (Pre:CC102)",
        lec: 2,
        lab: 3,
        units: 3,
      },
    ],
  },

  "Second Year": {
    "First Semester": [
      {
        code: "CC105",
        title: "Information Management",
        lec: 2,
        lab: 3,
        units: 3,
      },
    ],
    "Second Semester": [
      { code: "IM101", title: "Database Design", lec: 2, lab: 0, units: 3 },
    ],
  },

  "Third Year": {
    "First Semester": [
      {
        code: "CC106",
        title: "Application Development",
        lec: 2,
        lab: 0,
        units: 3,
      },
    ],
    "Second Semester": [
      {
        code: "IAS101",
        title: "Information Assurance",
        lec: 2,
        lab: 3,
        units: 3,
      },
    ],
  },

  "Fourth Year": {
    "First Semester": [
      { code: "CAP101", title: "Capstone Project", lec: 3, lab: 0, units: 3 },
    ],
    "Second Semester": [
      {
        code: "PRAC1",
        title: "Practicum (500 Hours)",
        lec: 6,
        lab: 0,
        units: 6,
      },
    ],
  },
};

const ViewOverallSchedule = ({ show, onClose }) => {
  const [search, setSearch] = useState("");

  if (!show) return null;

  // FILTER YEARS
  const filteredCurriculum = Object.entries(curriculum).filter(([year]) =>
    year.toLowerCase().includes(search.toLowerCase()),
  );

  // TABLE HEADER
  const TableHeader = () => (
    <div className="grid grid-cols-[100px_1fr_60px_60px_60px_120px_120px] bg-[#1C6100] text-white px-4 py-2">
      <span>Code</span>
      <span className="text-center">Title</span>
      <span className="text-center">Lec</span>
      <span className="text-center">Lab</span>
      <span className="text-center">Units</span>
      <span className="text-center">Time</span>
      <span className="text-center">Date</span>
    </div>
  );

  // ROW
  const Row = ({ code, title, lec, lab, units, time, date }) => {
    const isEmpty = !code;

    return (
      <div className="grid grid-cols-[100px_1fr_60px_60px_60px_120px_120px] px-4 h-10 items-center border-b">
        <span>{code}</span>
        <span className="truncate">{title}</span>
        <span className="text-center">{isEmpty ? "" : (lec ?? "")}</span>
        <span className="text-center">{isEmpty ? "" : (lab ?? "")}</span>
        <span className="text-center">{isEmpty ? "" : (units ?? "")}</span>
        <span className="text-center">{isEmpty ? "" : (time ?? "-")}</span>
        <span className="text-center">{isEmpty ? "" : (date ?? "-")}</span>
      </div>
    );
  };

  const Semester = ({ title, subjects }) => {
    const totalRows = 8;
    const emptyRows = totalRows - subjects.length;

    return (
      <div className="mt-4">
        <div className="bg-[#1C6100] text-white px-6 py-2 rounded-md w-fit text-sm font-bold tracking-wider">
          {title}
        </div>

        <div className="mt-2">
          <TableHeader />

          {subjects.map((subj, index) => (
            <Row key={index} {...subj} />
          ))}

          {[...Array(emptyRows)].map((_, index) => (
            <Row key={`empty-${index}`} />
          ))}
        </div>
      </div>
    );
  };

  const YearBlock = ({ year, data }) => (
    <div className="mb-10">
      <div className="text-center font-bold py-2 bg-[#D9D9D9]/25 rounded-md">
        {year}
      </div>

      <Semester title="First Semester" subjects={data["First Semester"]} />
      <Semester title="Second Semester" subjects={data["Second Semester"]} />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 font-RB">
      <div className="bg-white w-[80vw] h-[90vh] rounded-xl shadow-lg flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-black/30 p-6">
          <h2 className="text-lg font-semibold">Overall Schedule</h2>
          <img
            src={Close}
            alt="close"
            className="w-5 h-5 cursor-pointer"
            onClick={onClose}
          />
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto px-10 py-4">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search School Year"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 mb-5 px-4 py-2 w-64 rounded-md text-sm"
          />

          {/* FILTERED YEARS */}
          {filteredCurriculum.length > 0 ? (
            filteredCurriculum.map(([year, data]) => (
              <YearBlock key={year} year={year} data={data} />
            ))
          ) : (
            <div className="text-center text-gray-500 mt-10">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewOverallSchedule;

import { useState } from "react";
import Close from "../assets/photo/Close.png";
import ConfirmModal from "./ConfirmModal";

const ViewSchedule = ({ show, onClose, yearSection }) => {
  if (!show) return null;

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(
    "1st Semester 2025-2026",
  );

  const scheduleColumns = [
    "code",
    "unit",
    "hours",
    "time",
    "day",
    "room",
    "section",
    "instructor",
  ];

  const emptyRow = {
    code: "",
    unit: "",
    hours: "",
    time: "",
    day: "",
    room: "",
    section: "",
    instructor: "",
  };

  // Separate state for each semester
  const [firstSemesterRows, setFirstSemesterRows] = useState(
    Array(10)
      .fill(null)
      .map(() => ({ ...emptyRow })),
  );
  const [secondSemesterRows, setSecondSemesterRows] = useState(
    Array(10)
      .fill(null)
      .map(() => ({ ...emptyRow })),
  );

  // Decide which rows to display
  const rows =
    selectedSemester === "1st Semester 2025-2026"
      ? firstSemesterRows
      : secondSemesterRows;
  const setRows =
    selectedSemester === "1st Semester 2025-2026"
      ? setFirstSemesterRows
      : setSecondSemesterRows;

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 font-RB">
      <div className="bg-white w-[80vw] h-[85vh] rounded-lg shadow-lg p-10 relative overflow-auto">
        {/* Top */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl">Class Schedule</h1>
            <h2>{yearSection}</h2>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 cursor-pointer"
          >
            <img src={Close} alt="Close" />
          </button>
        </div>

        {/* Semester Selector */}
        <div className="relative inline-block border border-gray-400 rounded px-3 pt-3 pb-2 mb-4">
          <span className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
            Select Semester
          </span>

          <select
            className="bg-white text-base focus:outline-none pr-1"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option>1st Semester 2025-2026</option>
            <option>2nd Semester 2025-2026</option>
          </select>
        </div>

        {/* Table */}
        <table className="w-full table-fixed border">
          <thead>
            <tr className="text-sm">
              <th className="border p-2">SUBJECT CODE</th>
              <th className="border p-2">UNIT</th>
              <th className="border p-2">HOURS</th>
              <th className="border p-2">TIME</th>
              <th className="border p-2">DAYS</th>
              <th className="border p-2">ROOM</th>
              <th className="border p-2">SECTION</th>
              <th className="border p-2">INSTRUCTOR'S NAME/SIGNATURE</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {scheduleColumns.map((col) => (
                  <td key={col} className="border p-1.5">
                    <input
                      type="text"
                      value={row[col]}
                      onChange={(e) => handleChange(index, col, e.target.value)}
                      className="w-full text-center outline-none py-1"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
          onClick={() => setShowConfirm(true)}
        >
          Clear Schedule
        </button>
      </div>
      <ConfirmModal
        show={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setRows(
            Array(10)
              .fill(null)
              .map(() => ({ ...emptyRow })),
          );
          setShowConfirm(false);
        }}
      />
    </div>
  );
};

export default ViewSchedule;

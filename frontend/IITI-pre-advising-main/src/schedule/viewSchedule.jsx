import { useState, useEffect } from "react";
import Close from "../assets/photo/Close.png";
import ConfirmModal from "./ConfirmModal";

const ViewSchedule = ({ show, onClose, yearSection }) => {
  if (!show) return null;

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(
    "1st Semester 2025-2026",
  );
  const [loading, setLoading] = useState(false);

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

  const [rows, setRows] = useState(
    Array(10)
      .fill(null)
      .map(() => ({ ...emptyRow })),
  );

  useEffect(() => {
    if (!show || !yearSection) return;

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const sectionParam = encodeURIComponent(yearSection);
        const semesterParam = encodeURIComponent(selectedSemester);
        const response = await fetch(
          `/bridge/schedule/${sectionParam}?semester=${semesterParam}`,
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to fetch schedule.");
        }

        const normalized = (data.data || []).slice(0, 10).map((item) => ({
          code: item.subjectCode || "",
          unit: item.unit || "",
          hours: item.hours || "",
          time: item.time || "",
          day: Array.isArray(item.days) ? item.days.join(", ") : item.days || "",
          room: item.room || "",
          section: item.section || "",
          instructor: item.instructor || "",
        }));

        const filled = [...normalized];
        while (filled.length < 10) filled.push({ ...emptyRow });
        setRows(filled);
      } catch (error) {
        console.error(error);
        setRows(Array(10).fill(null).map(() => ({ ...emptyRow })));
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [show, yearSection, selectedSemester]);

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

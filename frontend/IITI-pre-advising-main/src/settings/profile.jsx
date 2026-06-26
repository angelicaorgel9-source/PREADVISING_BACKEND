import React, { useState } from "react";

const EditProfile = () => {
  // State for each input field
  const [fullName, setFullName] = useState("Admin Dela Cruz");
  const [username, setUsername] = useState("Admin");
  const [gsuite, setGsuite] = useState("999999999999");
  const [position, setPosition] = useState("Admin");

  // State to toggle readonly/editable
  const [editFields, setEditFields] = useState({
    fullName: false,
    username: false,
    gsuite: false,
    position: false,
  });

  // Toggle edit mode for a field
  const toggleEdit = (field) => {
    setEditFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="h-full pl-[55%] md:pl-88 font-RB w-full bg-[#F5F5F5] min-h-screen">
      {/* HEADER */}
      <div className="bg-white shadow px-6 py-4 flex items-center justify-between border-b-[5px] border-[#D9D9D9]">
        <span className="text-[25px] font-bold text-black">Profile</span>
      </div>

      {/* PROFILE CONTENT */}
      <div className="px-10 py-10">
        {/* Profile Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-black"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 4.8-2.2 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8V22h19.2v-2.8c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
          <h2 className="text-[20px] font-bold text-black">{fullName}</h2>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mb-10">
          <button className="bg-green-700 text-white text-sm px-5 py-2 rounded-full">
            Upload New
          </button>
          <button className="bg-gray-200 text-gray-400 text-sm px-5 py-2 rounded-full cursor-not-allowed">
            Remove Profile Picture
          </button>
        </div>

        {/* Title */}
        <h3 className="text-[20px] font-bold mb-6 text-black">Edit Profile</h3>

        {/* Form */}
        <div className="space-y-6">
          {/* Full Name */}
          <EditableField
            label="Full Name"
            value={fullName}
            setValue={setFullName}
            editable={editFields.fullName}
            toggleEdit={() => toggleEdit("fullName")}
          />
          {/* Username */}
          <EditableField
            label="Username"
            value={username}
            setValue={setUsername}
            editable={editFields.username}
            toggleEdit={() => toggleEdit("username")}
          />
          {/* Gsuite */}
          <EditableField
            label="Gsuite"
            value={gsuite}
            setValue={setGsuite}
            editable={editFields.gsuite}
            toggleEdit={() => toggleEdit("gsuite")}
          />
          {/* Position */}
          <EditableField
            label="Position"
            value={position}
            setValue={setPosition}
            editable={editFields.position}
            toggleEdit={() => toggleEdit("position")}
          />
        </div>
      </div>
    </div>
  );
};

// Reusable Editable Field Component
const EditableField = ({ label, value, setValue, editable, toggleEdit }) => (
  <div>
    <label className="text-[12px] text-gray-500">{label}</label>
    <div className="mt-2 w-127 h-14.5 bg-white border border-gray-300 rounded-[20px] flex items-center justify-between px-5">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-transparent outline-none text-[14px] text-gray-700"
        readOnly={!editable}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-6 h-6 ml-3 cursor-pointer ${
          editable ? "text-green-500" : "text-gray-400"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        onClick={toggleEdit}
      >
        <path
          strokeWidth={2}
          d="M15.232 5.232l3.536 3.536M9 13l6.232-6.232a2.5 2.5 0 113.536 3.536L12.536 16.536H9V13z"
        />
      </svg>
    </div>
  </div>
);

export default EditProfile;
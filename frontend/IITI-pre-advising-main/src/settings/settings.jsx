import React, { useState, useEffect } from "react";
import adminLogo from "../../src/dashboard/dashboardLOGO/adminLogo.png";
import { Link, useNavigate } from "react-router-dom";
import ExitModal from "./ExitModal";

export default function EditProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("Admin Dela Cruz");
  const [usernameField, setUsernameField] = useState("Admin");
  const [gsuite, setGsuite] = useState("999999999999");
  const [position, setPosition] = useState("Admin");

  useEffect(() => {
    let mounted = true;
    fetch("/bridge/profile")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (data && data.success && data.data) {
          const p = data.data;
          setFullName(p.full_name || p.fullName || "");
          setUsernameField(p.username || "");
          setGsuite(p.gsuite || p.email || "");
          setPosition(p.position || "");
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    // Perform logout logic here
    navigate("/login"); // redirect to login page
  };

  return (
    <div className="h-full pl-[55%] md:pl-88 font-RB w-full bg-[#F5F5F5] min-h-screen">

      {/* HEADER */}
      <div className="bg-white shadow px-6 py-4 flex items-center justify-between border-b-[5px] border-[#D9D9D9]">
        <span className="text-[25px] font-bold text-black">Settings</span>

        <Link to="/profile">
          <div className="flex-col cursor-pointer active:scale-95">
            <img src={adminLogo} alt="admin" className="h-10.5 w-10.5" />
            <h1 className="text-xs text-center">Admin</h1>
          </div>
        </Link>
      </div>

      <div className="px-10 mt-6">
        <h2 className="text-[20px] font-normal text-black">Account Details</h2>
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

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="text-[12px] text-gray-500">Full Name</label>
            <div className="mt-2 w-127 h-14.5 bg-white border border-gray-300 rounded-[20px] flex items-center px-5">
              <input
                type="text"
                value={fullName}
                readOnly
                className="w-full bg-transparent outline-none text-[14px] text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] text-gray-500">Username</label>
            <div className="mt-2 w-127 h-14.5 bg-white border border-gray-300 rounded-[20px] flex items-center px-5">
              <input
                type="text"
                value={usernameField}
                readOnly
                className="w-full bg-transparent outline-none text-[14px] text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] text-gray-500">Gsuite</label>
            <div className="mt-2 w-127 h-14.5 bg-white border border-gray-300 rounded-[20px] flex items-center px-5">
              <input
                type="text"
                value={gsuite}
                readOnly
                className="w-full bg-transparent outline-none text-[14px] text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] text-gray-500">Position</label>
            <div className="mt-2 w-127 h-14.5 bg-white border border-gray-300 rounded-[20px] flex items-center px-5">
              <input
                type="text"
                value={position}
                readOnly
                className="w-full bg-transparent outline-none text-[14px] text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="mt-10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-500 text-white text-sm px-5 py-2 rounded-full hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* EXIT MODAL */}
      <ExitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
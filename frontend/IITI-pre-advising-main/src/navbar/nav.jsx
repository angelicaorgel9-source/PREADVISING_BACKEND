import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import iitiLOGO from "./navbarLOGO/iitiLogo.png";
import dashboardLogo from "./navbarLOGO/dashboardLogo.png";
import yearLevelLogo from "./navbarLOGO/yearLevelLogo.png";
import preAdvisingLogo from "../assets/photo/preAdvisingLogo.png";
import scheduleLogo from "./navbarLOGO/scheduleLogo.png";
import settingLogo from "./navbarLOGO/settingLogo.png";

function Nav() {
  const location = useLocation();

  // Map pathnames to active keys
  const pathToKey = {
    "/dashboard": "dashboard",
    "/year-level": "yearlevel",
    "/pre-advising": "pre-advising",
    "/schedule": "schedule",
    "/settings": "setting"
  };

  const [active, setActive] = useState(pathToKey[location.pathname] || "dashboard");

  // Update active state when URL changes
  useEffect(() => {
    setActive(pathToKey[location.pathname]);
  }, [location.pathname]);

  return (
    <aside>
    <div className="font-RB tracking-wide">
      <div className="fixed h-full bg-[#1C6100] w-[45%]  md:w-87.5">

        {/* IITI Logo */}
        <div className="flex justify-center p-5">
          <img 
            src={iitiLOGO} 
            alt="IITI Logo" 
            className="bg-white rounded-full w-[21.75] h-21.75" 
          />
        </div>

        {/* Title */}
        <div className="bg-[#0E5A12] p-5 shadow-xl drop-shadow-sm">
          <h1 className="font-semibold text-white text-lg text-center tracking-wide">
            Institute of Information
            <br />
            Technology and Innovation
          </h1>
        </div>

        {/* Functions / Nav Items */}
        <div className="pt-10 flex flex-col">

          {/* Dashboard */}
          <Link to="/dashboard">
            <div
              className={`flex space-x-2 cursor-pointer px-12 py-2 rounded m-2 
                          transition-colors duration-200 active:scale-95 ${
                active === "dashboard"
                  ? "bg-[#A0FBA333] text-white border-2 border-white/30 rounded-lg"
                  : "text-white hover:bg-green-800"
              }`}

            >
              <img 
                src={dashboardLogo} 
                alt="Dashboard" 
                className="w-5.25 h-5.25" />
              <h1>Dashboard</h1>

            </div>
          </Link>

          {/* Year Level */}
          <Link to="/year-level">
            <div
              className={`flex space-x-2 cursor-pointer px-12 py-2 rounded m-2 
                          transition-colors duration-200 active:scale-95 ${
                active === "yearlevel"
                  ? "bg-[#A0FBA333] text-white border-2 border-white/30 rounded-lg"
                  : "text-white hover:bg-green-800"
              }`}

            >
              <img 
                src={yearLevelLogo} 
                alt="Year Level" 
                className="w-5.25 h-5.25" />
              <h1>Year Level</h1>

            </div>
          </Link>

          {/* pre advising */}
          <Link to="/pre-advising">
            <div
              className={`flex space-x-2 cursor-pointer px-12 py-2 rounded m-2 
                          transition-colors duration-200 active:scale-95 ${
                active === "pre-advising"
                  ? "bg-[#A0FBA333] text-white border-2 border-white/30 rounded-lg"
                  : "text-white hover:bg-green-800"
              }`}

            >
              <img 
                src={preAdvisingLogo} 
                alt="Pre Advising" 
                className="w-5.25 h-5.25" />
              <h1>Pre-Advising</h1>

            </div>
          </Link>

          {/* Schedule */}
          <Link to="/schedule">
            <div
              className={`flex space-x-2 cursor-pointer px-12 py-2 rounded m-2 
                          transition-colors duration-200  active:scale-95 ${
                active === "schedule"
                  ? "bg-[#A0FBA333] text-white border-2 border-white/30 rounded-lg"
                  : "text-white hover:bg-green-800"
              }`}

            >
              <img
                src={scheduleLogo} 
                alt="Schedule" 
                className="w-5.25 h-5.25" />
              <h1>Schedule</h1>

            </div>
          </Link>

          {/* Settings */}
          <Link to="/settings">
            <div
              className={`flex space-x-2 cursor-pointer px-12 py-2 rounded m-2 
                          transition-colors duration-200 active:scale-95 ${
                active === "setting"
                  ? "bg-[#A0FBA333] text-white border-2 border-white/30 rounded-lg"
                  : "text-white hover:bg-green-800"
              }`}
            >

              <img 
                src={settingLogo} 
                alt="Settings" 
                className="w-5.25 h-5.25" />
              <h1>Settings</h1>

            </div>
          </Link>

        </div>
      </div>
    </div>
    </aside>
  );
}

export default Nav;

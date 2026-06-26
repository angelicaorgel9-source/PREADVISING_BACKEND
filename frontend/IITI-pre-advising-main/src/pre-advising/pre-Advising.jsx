import React from "react";
import { Link } from "react-router-dom";

// adjust paths based on your project structure
import adminLogo from "../dashboard/dashboardLOGO/adminLogo.png";
import book from "../assets/photo/BOOK.png";

const PreAdvising = () => {
  const years = [
    { title: "BSIT 1st Year" },
    { title: "BSIT 2nd Year" },
    { title: "BSIT 3rd Year" },
    { title: "BSIT 4th Year" },
    { title: "Irregular Students" },
  ];

  return (
    <div className="bg-gray-100 h-full pl-[55%] md:pl-88 font-RB w-full">

      {/* HEADER */}
      <div className="p-5 pt-14 flex justify-between border-b-4 border-[#D9D9D9] bg-gray-100">
        <h1 className="font-bold text-2xl p-5">Pre-Advising</h1>

        <Link to="/profile">
          <div className="flex flex-col items-center cursor-pointer active:scale-95 transition">
            <img
              src={adminLogo}
              alt="admin"
              className="h-10.5 w-10.5"
            />
            <h1 className="text-xs text-center">Admin</h1>
          </div>
        </Link>
      </div>

      {/* CONTENT */}
      <main className="px-5 sm:px-10 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 max-w-255 mx-auto">

          {years.map((item, index) => (
            <Link to="/pre-advising-list" key={index}>
              <div className="bg-[#1C6100] w-full h-41.25 rounded-[15px] p-5 relative text-white shadow-lg hover:bg-green-800 transition-all duration-300 cursor-pointer">
                
                <h2 className="text-[25px] font-bold">
                  {item.title}
                </h2>

                <p className="text-[14px] mt-1 opacity-80">
                  No. of Section
                </p>

                <img
                  src={book}
                  alt="book"
                  className="absolute bottom-4 right-4 w-10 h-10 object-contain"
                />
              </div>
            </Link>
          ))}

        </div>
      </main>
    </div>
  );
};

export default PreAdvising;
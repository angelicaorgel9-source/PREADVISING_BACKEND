
import { Link, useLocation } from "react-router-dom";
import React from "react";
import back from "../../assets/photo/arrow.png";
import adminLogo from '../../dashboard/dashboardLOGO/adminLogo.png'
import next from "../../assets/photo/next.png";

const students = [
  {
    name: "Rein Paul Asinas",
    section: "1A",
    email: "202310010@btech.ph.education",
    number: "202310010",
  },
  {
    name: "John Cruz",
    section: "1A",
    email: "202310011@btech.ph.education",
    number: "202310011",
  },
  {
    name: "Maria Santos",
    section: "1A",
    email: "202310012@btech.ph.education",
    number: "202310012",
  },
];

const List = () => {
  return (
    <div className="bg-gray-100  h-full pl-[55%] md:pl-88 font-RB w-full">
      

      {/* Header */}
     <div className=' p-5 pt-14 flex justify-between
                            border-b-5 border-[#D9D9D9]'>
    
        <div className="flex flex-col items-start gap-1 text-[25px]">
        <Link to='/section'>
            <img src={back} alt="Back" className="w-4 h-4" />
        </Link>
          <div className="flex items-center gap-3">
            <span className="font-bold text-black/50">BSIT 1st Year</span>
            <img src={next} alt="Next" className="w-4 h-4" />
            <span className="font-bold text-black/50">Sections</span>
            <img src={next} alt="Next" className="w-4 h-4" />
            <span className="font-bold text-black">1A</span>
          </div>
        </div>

            {/*Title and admin*/}


                <Link to="/profile">
                  <div className="flex-col cursor-pointer active:scale-95">
                    <img src={adminLogo} alt="admin" className="h-10.5 w-10.5" />
                    <h1 className="text-xs text-center">Admin</h1>
                  </div>
                </Link>
                
     
      </div>

      <main className="px-8 py-6">

        <div className="flex px-4 mb-2 text-gray-700 font-semibold text-[16px]">
          <div className="w-1/4">Student Name</div>
          <div className="w-1/6 text-center">Section</div>
          <div className="w-1/3">Student Email</div>
          <div className="w-1/4 text-center">Student Number</div>
        </div>

        {/* Student List */}
        <div className=" shadow-sm">
        <div className="overflow-y-auto ">
            <div className="px-4 space-y-1">

            {/* Row 1 */}
            <Link to='/viewGrade' className="block">
              <div className="flex border bg-[#D9D9D9]/50 border-black hover:bg-gray-200 cursor-pointer h-6 items-center px-2 text-sm">
                <div className="w-1/4">Rein Paul Asinas</div>
                <div className="w-1/6 text-center">1A</div>
                <div className="w-1/3">202310010@btech.ph.education</div>
                <div className="w-1/4 text-center">202310010</div>
              </div>
            </Link>

            {/* Empty Rows */}
            {[...Array(5)].map((_, index) => (
                <div
                key={index}
                className="flex border border-black h-6 items-center px-2  bg-[#D9D9D9]/50"
                ></div>
            ))}

            </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default List;
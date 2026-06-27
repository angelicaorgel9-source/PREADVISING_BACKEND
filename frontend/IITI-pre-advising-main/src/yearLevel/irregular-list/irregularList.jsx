import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import back from "../../assets/photo/arrow.png";
import adminLogo from '../../dashboard/dashboardLOGO/adminLogo.png'
import next from "../../assets/photo/next.png";

const IrregularList = () => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch irregular students from backend
    const fetchIrregularStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/bridge/students/irregular");
        const data = await response.json();
        
        if (data.success) {
          setStudents(data.data || []);
        } else {
          setError(data.error || "Failed to fetch students");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIrregularStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.email.toLowerCase().includes(search.toLowerCase()) ||
    student.number.includes(search)
  );

  return (
    <div className="bg-gray-100 h-full pl-[55%] md:pl-88 font-RB w-full">
      {/* Header */}
      <div className='p-5 pt-14 flex justify-between border-b-5 border-[#D9D9D9]'>
    
        <div className="flex flex-col items-start gap-1 text-[25px]">
          <Link to='/year-level'>
            <img src={back} alt="Back" className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-bold text-black/50">Irregular Students</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-[#E5E5E5] rounded-full px-4 py-2 w-65">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>

            <div className="w-px h-5 bg-gray-400 mr-2"></div>

            <input
              type="text"
              placeholder="Search Student"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-full placeholder-gray-500"
            />
          </div>

          <Link to="/profile">
            <div className='flex-col cursor-pointer active:scale-95'>
              <img 
                src={adminLogo} 
                alt="admin" 
                className='h-10.5 w-10.5'
              />
              <h1 className='text-xs text-center'>Admin</h1>
            </div>
          </Link>
        </div>
      </div>

      <main className="px-8 py-6">
        {/* Table Header */}
        <div className="flex px-4 mb-2 text-gray-700 font-semibold text-[16px]">
          <div className="w-1/4">Student Name</div>
          <div className="w-1/6 text-center">Status</div>
          <div className="w-1/3">Student Email</div>
          <div className="w-1/4 text-center">Student Number</div>
        </div>

        {/* Student List */}
        <div className="shadow-sm">
          <div className="overflow-y-auto">
            <div className="px-4 flex flex-col space-y-1">
              
              {/* Dynamic Student Rows */}
              {loading ? (
                <div className="text-center py-4 text-gray-500">
                  Loading irregular students...
                </div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">
                  Error: {error}
                </div>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <Link 
                    key={index} 
                    to={`/viewGrade?id=${encodeURIComponent(student.number)}`} 
                    className="block no-underline"
                  >
                    <div className="flex border bg-[#D9D9D9]/50 border-black hover:bg-gray-200 cursor-pointer h-6 items-center px-2 text-sm transition-colors">
                      <div className="w-1/4">{student.name}</div>
                      <div className="w-1/6 text-center">Irregular</div>
                      <div className="w-1/3 text-xs">{student.email}</div>
                      <div className="w-1/4 text-center">{student.number}</div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-2 text-gray-500 text-sm">
                  No irregular students found
                </div>
              )}

              {/* Empty Rows (for visual consistency) */}
              {!loading && !error && filteredStudents.length < 5 && (
                [...Array(Math.max(0, 5 - filteredStudents.length))].map((_, index) => (
                  <div 
                    key={`empty-${index}`} 
                    className="flex border border-black h-6 items-center px-2 bg-[#D9D9D9]/50"
                  ></div>
                ))
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IrregularList;

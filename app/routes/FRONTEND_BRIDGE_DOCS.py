"""
Frontend Bridge Documentation
==============================

The frontend bridge provides REST API endpoints that allow an external
frontend system to communicate with the Pre-Advising backend.

All endpoints return JSON responses in format:
{
  "success": true/false,
  "data": {...},  // if success
  "error": "..."  // if failed
}

=============================================================================
AUTHENTICATION
=============================================================================

POST /bridge/login
  Body: {"username": "...", "password": "..."}
  Returns: {"success": true, "user": {...}}

POST /bridge/logout
  Returns: {"success": true, "message": "..."}


=============================================================================
DASHBOARD
=============================================================================

GET /bridge/dashboard
  Returns: {"success": true, "data": {"summary": {...}, "year_levels": [...]}}

GET /bridge/year-levels
  Returns: {"success": true, "data": [...]}


=============================================================================
STUDENTS & SECTIONS
=============================================================================

GET /bridge/sections/{year_level}
  Returns: {"success": true, "data": [...]}
  List of sections for a year level

GET /bridge/students/{section}
  Returns: {"success": true, "data": [...]}
  List of students in a section

GET /bridge/student/{student_no}
  Returns: {"success": true, "data": {...}}
  Student details, records, and general average


=============================================================================
PRE-ADVISING
=============================================================================

POST /bridge/pre-advising
  Body: {
    "student_no": "...",
    "year_level": int,
    "semester": "1" or "2",
    "status": "regular" or "irregular"
  }
  Returns: {"success": true, "data": [{"subject_code": "...", ...}]}


=============================================================================
SCHEDULE
=============================================================================

GET /bridge/schedule/{section}
  Returns: {"success": true, "data": [...]}
  Schedule for a specific section

GET /bridge/schedule/all
  Returns: {"success": true, "data": [...]}
  All schedules across all year levels


=============================================================================
PROFILE
=============================================================================

GET /bridge/profile
  Returns: {"success": true, "data": {...}}
  Get user profile

PUT /bridge/profile
  Body: {"full_name": "...", "username": "...", "gsuite": "...", "position": "..."}
  Returns: {"success": true, "data": {...}}
  Update user profile

POST /bridge/profile/upload
  Form-data: file=<image>
  Returns: {"success": true, "data": {...}}
  Upload profile picture

DELETE /bridge/profile/picture
  Returns: {"success": true, "data": {...}}
  Delete profile picture


=============================================================================
LOGOUT CONFIRMATION
=============================================================================

GET /bridge/logout/confirm
  Returns: {"show_confirmation": true/false}
  Check if confirmation modal should show

POST /bridge/logout/yes
  Returns: {"success": true, "message": "..."}
  Confirm logout

POST /bridge/logout/no
  Returns: {"success": true, "message": "..."}
  Cancel logout


=============================================================================
INTEGRATION EXAMPLE (Frontend JavaScript)
=============================================================================

// Login
fetch('/bridge/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({username: 'user', password: 'pass'})
})
.then(r => r.json())
.then(data => console.log(data));

// Get Dashboard
fetch('/bridge/dashboard')
  .then(r => r.json())
  .then(data => console.log(data.data));

// Get Sections
fetch('/bridge/sections/1')
  .then(r => r.json())
  .then(data => console.log(data.data));

// Get Students
fetch('/bridge/students/BSIT1A')
  .then(r => r.json())
  .then(data => console.log(data.data));

// Get Student Details
fetch('/bridge/student/2021-00001')
  .then(r => r.json())
  .then(data => console.log(data.data));

// Generate Pre-Advising
fetch('/bridge/pre-advising', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    student_no: '2021-00001',
    year_level: 2,
    semester: '1',
    status: 'irregular'
  })
})
.then(r => r.json())
.then(data => console.log(data.data));

// Get Schedule
fetch('/bridge/schedule/BSIT1A')
  .then(r => r.json())
  .then(data => console.log(data.data));

// Get Profile
fetch('/bridge/profile')
  .then(r => r.json())
  .then(data => console.log(data.data));

// Update Profile
fetch('/bridge/profile', {
  method: 'PUT',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    full_name: 'New Name',
    username: 'user',
    gsuite: 'user@school.edu',
    position: 'Admin'
  })
})
.then(r => r.json())
.then(data => console.log(data.data));

// Upload Profile Picture
const formData = new FormData();
formData.append('file', fileInput.files[0]);
fetch('/bridge/profile/upload', {
  method: 'POST',
  body: formData
})
.then(r => r.json())
.then(data => console.log(data.data));

// Logout
fetch('/bridge/logout', {method: 'POST'})
  .then(r => r.json())
  .then(data => console.log(data));
"""

# This is documentation file - Python integration already provided via routes/frontend_bridge.py

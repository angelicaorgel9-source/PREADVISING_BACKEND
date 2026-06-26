"""
Frontend Bridge - API Integration Layer
Provides HTTP endpoints that the external frontend system can call
to interact with the Pre-Advising backend.
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Dict, Any, List

from app.services.pre_advising_service import PreAdvisingService
from app.services.logout import LogoutService
from app.services.auth import AuthService
from app.db import (
    students_col,
    users_col,
    sections_col,
    schedule_col,
    curriculum_col,
    academic_records_col,
)

router = APIRouter(prefix="/bridge", tags=["frontend-bridge"])

# Initialize services
logout_service = LogoutService()
auth_service = AuthService()

# Simple module-level holder for the currently logged-in username (set on /login)
current_user_username: str = None


# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@router.post("/login")
async def bridge_login(credentials: Dict[str, str]) -> Dict[str, Any]:
    """
    Frontend: POST /bridge/login
    Body: {"username": "...", "password": "..."}
    """
    try:
        username = credentials.get("username")
        password = credentials.get("password")

        if not username or not password:
            raise HTTPException(status_code=400, detail="Username and password required")

        user = users_col.find_one({"username": username})
        if not user:
            return {"success": False, "error": "Invalid credentials"}

        # Basic password check (assumes plaintext); adapt if hashed
        if user.get("password") != password:
            return {"success": False, "error": "Invalid credentials"}

        user.pop("password", None)
        user["_id"] = str(user.get("_id"))

        # Select fields to return (accept alternative field names)
        user_response = {
            "username": user.get("username") or "",
            "full_name": (user.get("full_name") or user.get("fullName") or user.get("name") or ""),
            "gsuite": (user.get("gsuite") or user.get("gSuite") or user.get("email") or user.get("g_suite") or ""),
            "position": (user.get("position") or user.get("role") or user.get("Position") or ""),
        }

        # Debug: show the full user document for investigation
        try:
            print("DEBUG - all user fields:", dict(user))
        except Exception:
            print("DEBUG user fields:", list(user.keys()))
        # remember the logged-in username for subsequent profile requests
        try:
            global current_user_username
            current_user_username = user.get("username")
        except Exception:
            pass

        return {"success": True, "user": user_response}
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.post("/logout")
async def bridge_logout() -> Dict[str, str]:
    """
    Frontend: POST /bridge/logout
    """
    try:
        auth_service.handle_logout()
        return {"success": True, "message": "Logged out successfully"}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ============================================================================
# DASHBOARD ENDPOINTS
# ============================================================================

@router.get("/dashboard")
async def bridge_dashboard() -> Dict[str, Any]:
    """
    Frontend: GET /bridge/dashboard
    """
    try:
        cursor = students_col.find({})
        students = list(cursor)
        result = []
        for s in students:
            s["_id"] = str(s.get("_id"))
            result.append({
                **s,
                'name':   s.get('name')   or s.get('full_name') or '',
                'email':  s.get('email')  or s.get('gsuite')    or s.get('email_address') or '',
                'number': s.get('number') or s.get('student_no') or s.get('student_number') or '',
            })

        total = len(result)
        total_regular = sum(1 for s in result if (s.get("status") or "").lower() == "regular")
        total_irregular = total - total_regular

        return {"success": True, "data": {
            "students": result,
            "total_students": total,
            "total_regular": total_regular,
            "total_irregular": total_irregular,
        }}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ============================================================================
# YEAR LEVEL & SECTIONS ENDPOINTS
# ============================================================================

@router.get("/year-levels")
async def bridge_year_levels() -> Dict[str, Any]:
    """
    Frontend: GET /bridge/year-levels
    """
    try:
        # Static year levels
        year_levels = [
            {"year_level": 1, "name": "BSIT 1st Year"},
            {"year_level": 2, "name": "BSIT 2nd Year"},
            {"year_level": 3, "name": "BSIT 3rd Year"},
            {"year_level": 4, "name": "BSIT 4th Year"},
            {"year_level": "irregular", "name": "Irregular Students"},
        ]
        return {"success": True, "data": year_levels}
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.get("/sections/{year_level}")
async def bridge_sections(year_level: int) -> Dict[str, Any]:
    """
    Frontend: GET /bridge/sections/{year_level}
    """
    try:
        cursor = sections_col.find({"year_level": year_level})
        sections = list(cursor)
        for s in sections:
            s["_id"] = str(s.get("_id"))
        return {"success": True, "data": sections}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ============================================================================
# STUDENT ENDPOINTS
# ============================================================================

@router.get('/students/irregular')
async def bridge_irregular_students() -> Dict[str, Any]:
    try:
        cursor = students_col.find({'status': {'$regex': 'irregular', '$options': 'i'}})
        students = list(cursor)
        result = []
        for s in students:
            s['_id'] = str(s.get('_id'))
            result.append({
                **s,
                'name':   s.get('name')   or s.get('full_name') or '',
                'email':  s.get('email')  or s.get('gsuite')    or s.get('email_address') or '',
                'number': s.get('number') or s.get('student_no') or s.get('student_number') or '',
            })
        return {'success': True, 'data': result}
    except Exception as e:
        return {'success': False, 'error': str(e)}


@router.get("/students")
async def bridge_all_students() -> Dict[str, Any]:
    """
    Frontend: GET /bridge/students
    Returns all students with normalized field names.
    """
    try:
        cursor = students_col.find({})
        students = list(cursor)
        result: List[Dict[str, Any]] = []
        for s in students:
            s["_id"] = str(s.get("_id"))
            result.append({
                **s,
                'name':   s.get('name')   or s.get('full_name') or '',
                'email':  s.get('email')  or s.get('gsuite')    or s.get('email_address') or '',
                'number': s.get('number') or s.get('student_no') or s.get('student_number') or '',
            })
        return {"success": True, "data": {"students": result}}
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.get("/students/{section}")
async def bridge_students(section: str) -> Dict[str, Any]:
    """
    Frontend: GET /bridge/students/{section}
    """
    try:
        cursor = students_col.find({"section": section})
        students = list(cursor)
        result = []
        for s in students:
            s["_id"] = str(s.get("_id"))
            result.append({
                **s,
                'name':   s.get('name')   or s.get('full_name') or '',
                'email':  s.get('email')  or s.get('gsuite')    or s.get('email_address') or '',
                'number': s.get('number') or s.get('student_no') or s.get('student_number') or '',
            })
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.get("/student/{student_no}")
async def bridge_student_details(student_no: str) -> Dict[str, Any]:
    """
    Frontend: GET /bridge/student/{student_no}
    """
    try:
        student = students_col.find_one({"student_no": student_no})
        if student:
            student["_id"] = str(student.get("_id"))
            student["number"] = student.get("number") or student.get("student_no") or ""
            student["name"]   = student.get("name")   or student.get("full_name") or ""
            student["email"]  = student.get("email")  or student.get("gsuite") or ""

        # academic_records stores grades in a "records" array inside one document
        records_doc = academic_records_col.find_one({"student_no": student_no})
        raw_grades = []
        if records_doc:
            raw_grades = records_doc.get("records") or records_doc.get("grades") or []
            # fallback: if the doc itself looks like a grade record, wrap it
            if not raw_grades and records_doc.get("subject_code"):
                # grades are stored as separate documents after all — use find()
                cursor = academic_records_col.find({"student_no": student_no})
                raw_grades = list(cursor)

        normalized_grades = []
        for g in raw_grades:
            normalized_grades.append({
                **g,
                "code":       g.get("subject_code") or g.get("code") or "",
                "finalGrade": str(g.get("grade") or g.get("final_grade") or g.get("finalGrade") or ""),
                "prelim":     str(g.get("prelim") or g.get("prelim_grade") or ""),
                "midterm":    str(g.get("midterm") or g.get("midterm_grade") or ""),
                "preFinal":   str(g.get("preFinal") or g.get("pre_final") or ""),
                "final":      str(g.get("final") or g.get("final_period") or ""),
                "instructor": g.get("instructor") or g.get("teacher") or "",
                "semester":   str(g.get("semesters") or g.get("semester") or ""),
                "schoolYear": str(g.get("school_year") or ""),
            })

        return {"success": True, "data": {"student": student, "grades": normalized_grades}}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ============================================================================
# PRE-ADVISING ENDPOINTS
# ============================================================================

@router.post("/pre-advising")
async def bridge_pre_advising(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Frontend: POST /bridge/pre-advising
    Body: {
        "student_no": "...",
        "year_level": int,
        "semester": "1" or "2",
        "status": "regular" or "irregular"
    }
    """
    try:
        # PreAdvisingService now queries DB directly; API client not required
        pre_advising = PreAdvisingService(None)

        student_no = payload.get("student_no")
        year_level = payload.get("year_level")
        semester = payload.get("semester")
        status = payload.get("status")

        recommendations = await pre_advising.generate_pre_advising(
            student_no, year_level, semester, status
        )

        return {"success": True, "data": recommendations}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ============================================================================
# SCHEDULE ENDPOINTS
# ============================================================================

@router.get("/schedule/{section}")
async def bridge_schedule_section(section: str) -> Dict[str, Any]:
    """
    Frontend: GET /bridge/schedule/{section}
    """
    try:
        cursor = schedule_col.find({"section": section})
        schedule = list(cursor)
        for s in schedule:
            s["_id"] = str(s.get("_id"))
        return {"success": True, "data": schedule}
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.get("/schedule/all")
async def bridge_schedule_all() -> Dict[str, Any]:
    """
    Frontend: GET /bridge/schedule/all
    """
    try:
        cursor = schedule_col.find({})
        schedule = list(cursor)
        for s in schedule:
            s["_id"] = str(s.get("_id"))
        return {"success": True, "data": schedule}
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.get("/curriculum")
async def bridge_curriculum() -> Dict[str, Any]:
    """
    Frontend: GET /bridge/curriculum
    """
    from app.database import curriculum_collection
    cursor = curriculum_collection.find({})
    docs = await cursor.to_list(length=None)

    year_names = {1: 'First Year', 2: 'Second Year', 3: 'Third Year', 4: 'Fourth Year'}

    result: Dict[str, Any] = {}
    for doc in docs:
        for year in doc.get('years', []):
            year_label = year_names.get(year.get('year_level'), f"Year {year.get('year_level')}")
            result[year_label] = {
                'First Semester': [],
                'Second Semester': []
            }
            semesters = year.get('semesters', {})
            for s in semesters.get('1', []):
                result[year_label]['First Semester'].append({
                    'code': s.get('subject_code'),
                    'title': s.get('title'),
                    'lec': s.get('lec'),
                    'lab': s.get('lab'),
                    'units': s.get('units'),
                })
            for s in semesters.get('2', []):
                result[year_label]['Second Semester'].append({
                    'code': s.get('subject_code'),
                    'title': s.get('title'),
                    'lec': s.get('lec'),
                    'lab': s.get('lab'),
                    'units': s.get('units'),
                })

    return {'success': True, 'data': result}


# ============================================================================
# PROFILE ENDPOINTS
# ============================================================================

@router.get("/profile")
async def bridge_profile() -> Dict[str, Any]:
    """
    Frontend: GET /bridge/profile
    """
    try:
        # Require a logged-in user
        if not current_user_username:
            raise HTTPException(status_code=401, detail="Not logged in")

        profile = users_col.find_one({"username": current_user_username})
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        profile.pop("password", None)
        profile["_id"] = str(profile.get("_id"))
        return {"success": True, "data": profile}
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.put("/profile")
async def bridge_update_profile(updates: Dict[str, str]) -> Dict[str, Any]:
    """
    Frontend: PUT /bridge/profile
    Body: {
        "full_name": "...",
        "username": "...",
        "gsuite": "...",
        "position": "..."
    }
    """
    try:
        # Update the currently logged-in user; require logged-in
        if not current_user_username:
            raise HTTPException(status_code=401, detail="Not logged in")
        current_user = current_user_username
        allowed = {"full_name", "username", "gsuite", "position"}
        updates_filtered = {k: v for k, v in updates.items() if k in allowed}
        users_col.update_one({"username": current_user}, {"$set": updates_filtered})
        updated = users_col.find_one({"username": updates_filtered.get("username", current_user)})
        if updated:
            updated.pop("password", None)
            updated["_id"] = str(updated.get("_id"))
        return {"success": True, "data": updated}
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.post("/profile/upload")
async def bridge_upload_profile_pic(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Frontend: POST /bridge/profile/upload
    Form-data: file=<image_file>
    """
    try:
        import tempfile
        import os

        # Save uploaded file to temp location
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name

        try:
            # Persist path reference to user document (admin)
            current_user = "admin"
            users_col.update_one({"username": current_user}, {"$set": {"profile_picture": tmp_path}})
            updated = users_col.find_one({"username": current_user})
            if updated:
                updated.pop("password", None)
                updated["_id"] = str(updated.get("_id"))
            return {"success": True, "data": updated}
        finally:
            # keep file on disk for now; if you prefer remove it change this
            pass
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.delete("/profile/picture")
async def bridge_delete_profile_pic() -> Dict[str, Any]:
    """
    Frontend: DELETE /bridge/profile/picture
    """
    try:
        current_user = "admin"
        users_col.update_one({"username": current_user}, {"$unset": {"profile_picture": ""}})
        updated = users_col.find_one({"username": current_user})
        if updated:
            updated.pop("password", None)
            updated["_id"] = str(updated.get("_id"))
        return {"success": True, "data": updated}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ============================================================================
# LOGOUT ENDPOINTS
# ============================================================================

@router.get("/logout/confirm")
async def bridge_logout_confirm() -> Dict[str, bool]:
    """
    Frontend: GET /bridge/logout/confirm
    Check if logout confirmation should be shown
    """
    return {"show_confirmation": logout_service.is_showing_confirmation()}


@router.post("/logout/yes")
async def bridge_logout_confirm_yes() -> Dict[str, str]:
    """
    Frontend: POST /bridge/logout/yes
    Confirm logout
    """
    try:
        def on_logout():
            auth_service.handle_logout()
        
        logout_service.handle_confirm_logout(on_logout)
        return {"success": True, "message": "Logged out"}
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.post("/logout/no")
async def bridge_logout_cancel() -> Dict[str, str]:
    """
    Frontend: POST /bridge/logout/no
    Cancel logout
    """
    try:
        logout_service.handle_cancel_logout()
        return {"success": True, "message": "Logout cancelled"}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ============================================================================
# CLIENT ACTIONS
# ============================================================================


@router.post("/logout/click")
async def bridge_logout_click() -> Dict[str, str]:
    """
    Frontend: POST /bridge/logout/click
    Signal that user clicked the logout button and wants confirmation shown.
    """
    try:
        # Set the flag so GET /bridge/logout/confirm will return show_confirmation=True
        logout_service.handle_logout_click()
        return {"success": True, "message": "Logout confirmation shown"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/test-user")
async def test_user():
    user = users_col.find_one({"username": "admin001"})
    if user:
        user["_id"] = str(user["_id"])
        return {"found": True, "data": dict(user)}
    return {"found": False}
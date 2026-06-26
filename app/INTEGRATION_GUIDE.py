"""
INTEGRATION GUIDE: Python Backend Integration

This module provides guidance on using the Python integration services
with an existing frontend.

All services follow async/await pattern and integrate with the FastAPI backend.
"""

# ============================================================================
# 1. AUTHENTICATION INTEGRATION
# ============================================================================

"""
Usage Example:

from app.api_client import APIClient
from app.services.auth import AuthService

async def login_user(username: str, password: str):
    api_client = APIClient()
    auth_service = AuthService()
    
    try:
        user = await auth_service.handle_login(api_client, username, password)
        # Redirect to dashboard
        print(f"Welcome {user['full_name']}")
    except Exception as e:
        # Show error message on frontend
        print(f"Login failed: {e}")
    finally:
        await api_client.close()

async def logout_user():
    auth_service = AuthService()
    auth_service.handle_logout()
    # Redirect to login page
"""

# ============================================================================
# 2. DASHBOARD INTEGRATION
# ============================================================================

"""
Usage Example:

from app.api_client import APIClient
from app.services.dashboard import DashboardService

async def load_dashboard():
    api_client = APIClient()
    dashboard = DashboardService(api_client)
    
    try:
        data = await dashboard.load_dashboard_data()
        
        # Bind to dashboard cards
        total_students = dashboard.get_total_students()
        total_teachers = dashboard.get_total_teachers()
        total_irregular = dashboard.get_total_irregular()
        total_regular = dashboard.get_total_regular()
        
        return {
            "total_students": total_students,
            "total_teachers": total_teachers,
            "total_irregular": total_irregular,
            "total_regular": total_regular,
        }
    except Exception as e:
        print(f"Dashboard load failed: {e}")
    finally:
        await api_client.close()
"""

# ============================================================================
# 3. STUDENT MANAGEMENT FLOW
# ============================================================================

"""
STEP 1: Load Sections for Year Level

from app.api_client import APIClient
from app.services.student import StudentService

async def load_year_level(year_level: int):
    api_client = APIClient()
    student_service = StudentService(api_client)
    
    try:
        sections = await student_service.load_sections(year_level)
        # Display sections list
        return sections
    except Exception as e:
        print(f"Failed to load sections: {e}")
    finally:
        await api_client.close()

---

STEP 2: Load Students in Section

async def load_section_students(section: str):
    api_client = APIClient()
    student_service = StudentService(api_client)
    
    try:
        students = await student_service.load_students_by_section(section)
        # Display students list
        # If status == "irregular": hide section, show "Irregular Student" label
        return students
    except Exception as e:
        print(f"Failed to load students: {e}")
    finally:
        await api_client.close()

---

STEP 3: Load Student Details and Grades

async def load_student_info(student_no: str):
    api_client = APIClient()
    student_service = StudentService(api_client)
    
    try:
        result = await student_service.load_student_details(student_no)
        
        # Bind to UI
        details = student_service.get_student_details()
        records = student_service.get_records()
        gen_ave = student_service.get_gen_ave()
        
        # Display:
        # - name, year_level, section (if regular), status
        # - grades table with subject_code, grade, status, semester, school_year
        # - general average
        
        return {
            "details": details,
            "records": records,
            "gen_ave": gen_ave
        }
    except Exception as e:
        print(f"Failed to load student details: {e}")
    finally:
        await api_client.close()
"""

# ============================================================================
# 4. PRE-ADVISING INTEGRATION
# ============================================================================

"""
Usage Example:

from app.api_client import APIClient
from app.services.pre_advising_service import PreAdvisingService

async def generate_recommendations(
    student_no: str,
    year_level: int,
    semester: str,
    status: str
):
    api_client = APIClient()
    pre_advising = PreAdvisingService(api_client)
    
    try:
        recommendations = await pre_advising.generate_pre_advising(
            student_no, year_level, semester, status
        )
        
        # Display recommended subjects
        # Format: subject_code, title, year_level, semester
        
        return recommendations
    except Exception as e:
        print(f"Pre-advising failed: {e}")
    finally:
        await api_client.close()
"""

# ============================================================================
# 5. SCHEDULE INTEGRATION
# ============================================================================

"""
Usage Example:

from app.api_client import APIClient
from app.services.schedule import ScheduleService

async def load_section_schedule(section: str):
    api_client = APIClient()
    schedule = ScheduleService(api_client)
    
    try:
        schedule_data = await schedule.load_schedule_by_section(section)
        # Display schedule
        return schedule_data
    except Exception as e:
        print(f"Failed to load schedule: {e}")
    finally:
        await api_client.close()

async def load_all_schedules():
    api_client = APIClient()
    schedule = ScheduleService(api_client)
    
    try:
        all_schedules = await schedule.load_all_schedules()
        # Display all schedules
        return all_schedules
    except Exception as e:
        print(f"Failed to load all schedules: {e}")
    finally:
        await api_client.close()
"""

# ============================================================================
# 6. PROFILE MANAGEMENT
# ============================================================================

"""
Usage Example:

from app.api_client import APIClient
from app.services.profile import ProfileService

async def load_user_profile():
    api_client = APIClient()
    profile_service = ProfileService(api_client)
    
    try:
        profile = await profile_service.load_profile()
        # Display profile_pic, username, full_name, gsuite, position
        return profile
    except Exception as e:
        print(f"Failed to load profile: {e}")
    finally:
        await api_client.close()

async def update_user_profile(updates: dict):
    api_client = APIClient()
    profile_service = ProfileService(api_client)
    
    try:
        updated = await profile_service.update_profile(updates)
        # Reload profile display
        return updated
    except Exception as e:
        print(f"Failed to update profile: {e}")
    finally:
        await api_client.close()

async def upload_picture(file_path: str):
    api_client = APIClient()
    profile_service = ProfileService(api_client)
    
    try:
        updated = await profile_service.upload_profile_pic(file_path)
        return updated
    except Exception as e:
        print(f"Failed to upload picture: {e}")
    finally:
        await api_client.close()

async def delete_picture():
    api_client = APIClient()
    profile_service = ProfileService(api_client)
    
    try:
        updated = await profile_service.delete_profile_pic()
        return updated
    except Exception as e:
        print(f"Failed to delete picture: {e}")
    finally:
        await api_client.close()
"""

# ============================================================================
# 7. LOGOUT INTEGRATION
# ============================================================================

"""
Usage Example:

from app.services.logout import LogoutService
from app.services.auth import AuthService

def handle_logout_button():
    logout_service = LogoutService()
    logout_service.handle_logout_click()
    # Show confirmation modal: "Are you sure you want to exit?"

def handle_confirm_logout():
    auth_service = AuthService()
    logout_service = LogoutService()
    
    def on_confirmed():
        auth_service.handle_logout()
        # Redirect to login page
    
    logout_service.handle_confirm_logout(on_confirmed)

def handle_cancel_logout():
    logout_service = LogoutService()
    logout_service.handle_cancel_logout()
    # Close confirmation modal, stay on dashboard
"""

# ============================================================================
# COMPLETE EXAMPLE: Full Application Flow
# ============================================================================

"""
from fastapi import FastAPI
from app.api_client import APIClient
from app.services.auth import AuthService
from app.services.dashboard import DashboardService
from app.services.student import StudentService

app = FastAPI()

@app.post("/api/login")
async def api_login(credentials: dict):
    api_client = APIClient()
    auth_service = AuthService()
    try:
        user = await auth_service.handle_login(
            api_client, 
            credentials["username"], 
            credentials["password"]
        )
        return {"success": True, "user": user}
    except Exception as e:
        return {"success": False, "error": str(e)}
    finally:
        await api_client.close()

@app.get("/api/dashboard")
async def api_dashboard():
    api_client = APIClient()
    dashboard = DashboardService(api_client)
    try:
        data = await dashboard.load_dashboard_data()
        return data
    except Exception as e:
        return {"error": str(e)}
    finally:
        await api_client.close()

@app.get("/api/sections/{year_level}")
async def api_sections(year_level: int):
    api_client = APIClient()
    student_service = StudentService(api_client)
    try:
        sections = await student_service.load_sections(year_level)
        return sections
    except Exception as e:
        return {"error": str(e)}
    finally:
        await api_client.close()

@app.get("/api/students/{section}")
async def api_students(section: str):
    api_client = APIClient()
    student_service = StudentService(api_client)
    try:
        students = await student_service.load_students_by_section(section)
        return students
    except Exception as e:
        return {"error": str(e)}
    finally:
        await api_client.close()

@app.get("/api/student/{student_no}")
async def api_student_details(student_no: str):
    api_client = APIClient()
    student_service = StudentService(api_client)
    try:
        result = await student_service.load_student_details(student_no)
        return result
    except Exception as e:
        return {"error": str(e)}
    finally:
        await api_client.close()
"""

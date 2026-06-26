import os
from typing import Dict, Any, Optional, List
import requests

BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")


class APIClient:

    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})

    def _request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        
        url = f"{self.base_url}{endpoint}"
        try:
            response = self.session.request(method, url, **kwargs)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"API request failed: {method} {endpoint} - {str(e)}")
            raise

    def close(self):
        if self.session:
            self.session.close()

    def login(self, username: str, password: str) -> Dict[str, Any]:
        """Login user with credentials."""
        return self._request(
            "POST", 
            "/login", 
            json={"username": username, "password": password}
        )

    def get_dashboard_summary(self) -> Dict[str, Any]:
        """Get dashboard summary statistics."""
        return self._request("GET", "/dashboard/summary")

    def get_year_levels(self) -> List[Dict[str, Any]]:
        """Get all year levels."""
        return self._request("GET", "/year-levels")

    def get_sections(self, year_level: int) -> List[Dict[str, Any]]:
        """Get sections for a year level."""
        return self._request(
            "GET", 
            "/sections", 
            params={"year_level": year_level}
        )


    def get_students_by_section(self, section: str) -> List[Dict[str, Any]]:
        """Get students in a section."""
        return self._request(
            "GET", 
            "/students", 
            params={"section": section}
        )

    def get_student_details(self, student_no: str) -> Dict[str, Any]:
        """Get student details."""
        return self._request("GET", f"/students/{student_no}")

    def get_student_records(self, student_no: str) -> List[Dict[str, Any]]:
        """Get student academic records."""
        return self._request("GET", f"/students/{student_no}/records")

    def generate_pre_advising(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Generate pre-advising recommendations."""
        return self._request("POST", "/pre-advising", json=payload)

    def get_schedule_by_section(self, section: str) -> List[Dict[str, Any]]:
        """Get schedule for a section."""
        return self._request(
            "GET", 
            "/schedule", 
            params={"section": section}
        )

    def get_all_schedules(self) -> List[Dict[str, Any]]:
        """Get all schedules."""
        return self._request("GET", "/schedule/all")

 
    def get_profile(self) -> Dict[str, Any]:
        """Get user profile."""
        return self._request("GET", "/user/profile")

    def update_profile(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Update user profile."""
        return self._request("PUT", "/user/profile", json=payload)

    def upload_profile_pic(self, file_path: str) -> Dict[str, Any]:
        """Upload profile picture."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        with open(file_path, "rb") as f:
            files = {"file": f}
            return self._request("POST", "/user/profile/upload", files=files)

    def delete_profile_pic(self) -> Dict[str, Any]:
        """Delete profile picture."""
        return self._request("DELETE", "/user/profile/picture")

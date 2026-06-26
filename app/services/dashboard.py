from typing import Dict, List, Optional, Any

class DashboardService:
    def __init__(self, api_client):
        self.api_client = api_client
        self.summary = None
        self.year_levels = []

    async def load_dashboard_data(self) -> Dict[str, Any]:
        try:
            summary = await self.api_client.get_dashboard_summary()
            year_levels = await self.api_client.get_year_levels()
            
            self.summary = summary
            self.year_levels = year_levels or []
            
            return {
                "summary": self.summary,
                "year_levels": self.year_levels
            }
        except Exception as e:
            print(f"Failed to load dashboard data: {e}")
            raise

    def get_summary(self) -> Optional[Dict]:
       
        return self.summary

    def get_year_levels(self) -> List[Dict]:
       
        return self.year_levels

    def get_total_students(self) -> Optional[int]:
        if self.summary:
            return self.summary.get("total_students")
        return None

    def get_total_teachers(self) -> Optional[int]:
        if self.summary:
            return self.summary.get("total_teachers")
        return None

    def get_total_irregular(self) -> Optional[int]:
        if self.summary:
            return self.summary.get("total_irregular")
        return None

    def get_total_regular(self) -> Optional[int]:
        if self.summary:
            return self.summary.get("total_regular")
        return None

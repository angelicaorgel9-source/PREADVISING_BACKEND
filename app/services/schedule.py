from typing import Dict, List

class ScheduleService:
    def __init__(self, api_client):
        self.api_client = api_client
        self.schedule = []

    async def load_schedule_by_section(self, section: str) -> List[Dict]:
        
        try:
            self.schedule = await self.api_client.get_schedule_by_section(section)
            return self.schedule or []
        except Exception:
            raise

    async def load_all_schedules(self) -> List[Dict]:
        
        try:
            self.schedule = await self.api_client.get_all_schedules()
            return self.schedule or []
        except Exception:
            raise

    def get_schedule(self) -> List[Dict]:
        
        return self.schedule

    def filter_schedule_by_day(self, day: str) -> List[Dict]:
        
        return [item for item in self.schedule if item.get("day") == day]

    def filter_schedule_by_time(self, time: str) -> List[Dict]:
       
        return [item for item in self.schedule if item.get("time") == time]

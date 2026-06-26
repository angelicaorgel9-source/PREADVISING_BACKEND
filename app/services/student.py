from typing import Dict, List, Optional, Any

class StudentService:
    def __init__(self, api_client):
        self.api_client = api_client
        self.sections = []
        self.student_list = []
        self.selected_student = None
        self.student_details = None
        self.records = []
        self.gen_ave = None

    async def load_sections(self, year_level: int) -> List[Dict]:
        
        try:
            self.sections = await self.api_client.get_sections(year_level)
            self.student_list = []
            self.selected_student = None
            self.student_details = None
            self.records = []
            self.gen_ave = None
            return self.sections or []
        except Exception as e:
            print(f"Failed to load sections: {e}")
            raise

    async def load_students_by_section(self, section: str) -> List[Dict]:
        
        try:
            self.student_list = await self.api_client.get_students_by_section(section)
            self.selected_student = None
            self.student_details = None
            self.records = []
            self.gen_ave = None
            return self.student_list or []
        except Exception as e:
            print(f"Failed to load students: {e}")
            raise

    def _compute_gen_ave(self, records_list: List[Dict]) -> Optional[float]:
        
        if not records_list:
            return None

        valid_records = [
            record for record in records_list
            if record.get("status") in ("completed", "credited")
        ]

        if not valid_records:
            return None

        total = sum(float(record.get("grade", 0)) for record in valid_records)
        return round(total / len(valid_records), 2)

    async def load_student_details(self, student_no: str) -> Dict[str, Any]:
        
        if not student_no:
            return {}

        try:
            details = await self.api_client.get_student_details(student_no)
            records = await self.api_client.get_student_records(student_no)

            self.selected_student = student_no
            self.records = records or []

            
            normalized_details = {
                **details,
                "section": None if details.get("status") == "irregular" else details.get("section"),
                "statusLabel": "Irregular Student" if details.get("status") == "irregular" else details.get("status"),
            }

            self.student_details = normalized_details
            self.gen_ave = self._compute_gen_ave(self.records)

            return {
                "student_details": self.student_details,
                "records": self.records,
                "gen_ave": self.gen_ave,
            }
        except Exception as e:
            print(f"Failed to load student details: {e}")
            raise

    def get_sections(self) -> List[Dict]:
        
        return self.sections

    def get_student_list(self) -> List[Dict]:
       
        return self.student_list

    def get_student_details(self) -> Optional[Dict]:
       
        return self.student_details

    def get_records(self) -> List[Dict]:
       
        return self.records

    def get_gen_ave(self) -> Optional[float]:
        
        return self.gen_ave

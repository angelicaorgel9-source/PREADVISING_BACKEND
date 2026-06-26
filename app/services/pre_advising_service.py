from typing import Dict, List, Optional, Any, Set
from app.database import academic_records_collection, curriculum_collection, students_collection


PASSED_STATUSES = {"completed", "credited", "passed"}


def _record_subject_code(record: Dict[str, Any]) -> Optional[str]:
    return (
        record.get("subject_code")
        or record.get("code")
        or record.get("subject")
        or record.get("subject_id")
    )


def _normalize_curriculum_doc(doc: Dict[str, Any]) -> List[Dict[str, Any]]:
    subjects = []
    if not doc:
        return subjects

    if isinstance(doc.get("subjects"), list):
        for s in doc.get("subjects", []):
            subjects.append(s)
    else:
        
        subjects.append(doc)

    return subjects


class PreAdvisingService:
    def __init__(self, api_client):
        self.api_client = api_client
        self.recommended_subjects: List[Dict[str, Any]] = []
        self.last_error: Optional[str] = None

    async def _load_student_records(self, student_no: str) -> List[Dict[str, Any]]:
        cursor = academic_records_collection.find({"student_no": student_no})
        return await cursor.to_list(length=None)

    async def _load_curriculum(self) -> List[Dict[str, Any]]:
        cursor = curriculum_collection.find({})
        docs = await cursor.to_list(length=None)
        subjects: List[Dict[str, Any]] = []
        for d in docs:
            subjects.extend(_normalize_curriculum_doc(d))
        return subjects

    async def generate_pre_advising(
        self,
        student_no: str,
        year_level: int,
        semester: str,
        status: str,
    ) -> Dict[str, Any]:
        
        if not all([student_no, year_level, semester, status]):
            self.last_error = "Missing required student information"
            raise ValueError(self.last_error)

        try:
            
            student_info = None
            try:
                student_info = await students_collection.find_one({"student_no": student_no})
                if student_info and "_id" in student_info:
                    student_info["_id"] = str(student_info["_id"])
            except Exception:
                student_info = {"student_no": student_no}

            records = await self._load_student_records(student_no)

            passed: Set[str] = set()
            failed: Set[str] = set()
            for r in records:
                code = _record_subject_code(r)
                if not code:
                    continue
                status_field = (r.get("status") or "").lower()
                if status_field in PASSED_STATUSES:
                    passed.add(code)
                else:
                    failed.add(code)

            curriculum_subjects = await self._load_curriculum()

            
            curriculum_index: Dict[str, Dict[str, Any]] = {}
            for s in curriculum_subjects:
                code = s.get("code") or s.get("subject_code") or s.get("id")
                if not code:
                    continue
                curriculum_index[code] = {
                    "code": code,
                    "title": s.get("title") or s.get("name") or "",
                    "year_level": int(s.get("year_level", s.get("year", 0))) if s.get("year_level") is not None or s.get("year") is not None else None,
                    "semester": str(s.get("semester") or s.get("term") or "").strip(),
                    "prerequisites": s.get("prerequisites") or s.get("prereq") or [],
                    "raw": s,
                }

            
            def prerequisites_satisfied(code: str) -> bool:
                visited = set()

                def _check(c: str) -> bool:
                    if not c:
                        return True
                    if c in visited:
                        return True
                    visited.add(c)
                    subj = curriculum_index.get(c)
                   
                    if not subj:
                        return c in passed
                    prereqs = subj.get("prerequisites") or []
                    
                    prereq_codes = [p if isinstance(p, str) else p.get("code") for p in prereqs]
                    for pcode in prereq_codes:
                        if pcode not in passed:
                            return False

                        if not _check(pcode):
                            return False
                    return True

                return _check(code)

            recommended: List[Dict[str, Any]] = []

            if status.lower() == "regular":
                if not failed:
                    for subj in curriculum_index.values():
                        if subj.get("year_level") == int(year_level) and str(subj.get("semester")) == str(semester):
                            if subj["code"] in passed:
                                continue
                            recommended.append(subj["raw"])
                else:
                    for code in failed:
                        subj = curriculum_index.get(code)
                        if subj and str(subj.get("semester")) == str(semester):
                            recommended.append(subj.get("raw"))

                    for subj in curriculum_index.values():
                        if subj.get("year_level") == int(year_level) and str(subj.get("semester")) == str(semester):
                            if subj["code"] in passed or subj["code"] in failed:
                                continue
                            if subj.get("prerequisites"):
                                if not prerequisites_satisfied(subj["code"]):
                                    continue
                            recommended.append(subj["raw"])

            else:
                for code in failed:
                    subj = curriculum_index.get(code)
                    if subj and str(subj.get("semester")) == str(semester):
                        recommended.append(subj.get("raw"))

                
                candidates_with_prereq: List[Dict[str, Any]] = []
                candidates_no_prereq: List[Dict[str, Any]] = []

                for subj in curriculum_index.values():
                    if str(subj.get("semester")) != str(semester):
                        continue
                    code = subj["code"]
                    if code in passed or code in failed:
                        continue
                    prereqs = subj.get("prerequisites") or []
                    
                    prereq_codes = [p if isinstance(p, str) else p.get("code") for p in prereqs]
                    if not prereq_codes:
                        candidates_no_prereq.append(subj)
                        continue
                    all_passed = all((pc in passed) for pc in prereq_codes)
                    if all_passed:
                        candidates_with_prereq.append(subj)

                candidates_with_prereq.sort(key=lambda s: (s.get("year_level") or 0))
                candidates_no_prereq.sort(key=lambda s: (s.get("year_level") or 0))

                for s in candidates_with_prereq:
                    if len(recommended) >= 9:
                        break
                    recommended.append(s.get("raw"))

                for s in candidates_no_prereq:
                    if len(recommended) >= 9:
                        break
                    recommended.append(s.get("raw"))

            if len(recommended) > 9:
                failed_codes = set(failed)
                failed_list = [r for r in recommended if (r.get("code") or r.get("subject_code") or r.get("id")) in failed_codes]
                others = [r for r in recommended if (r.get("code") or r.get("subject_code") or r.get("id")) not in failed_codes]
                recommended = (failed_list + others)[:9]
            recommended = recommended[:9]

            result = {
                "student": student_info,
                "student_no": student_no,
                "status": status,
                "year_level": year_level,
                "semester": semester,
                "recommended_subjects": recommended,
                "total": len(recommended),
            }

            self.recommended_subjects = recommended
            self.last_error = None
            return result

        except Exception as e:
            self.last_error = str(e)
            print(f"Failed to generate pre-advising: {e}")
            raise

    def get_recommended_subjects(self) -> List[Dict[str, Any]]:
       
        return self.recommended_subjects

    def clear_recommendations(self):
      
        self.recommended_subjects = []
        self.last_error = None

    def get_last_error(self) -> Optional[str]:
      
        return self.last_error

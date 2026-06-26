from datetime import datetime
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, Field


class CurriculumSubject(BaseModel):
    subject_code: str
    title: str
    lec: int
    lab: int
    units: int
    prerequisites: Optional[List[str]] = None


class CurriculumYear(BaseModel):
    year_level: int
    semesters: Dict[str, List[CurriculumSubject]]


class CurriculumDocument(BaseModel):
    program: str
    school_year: str
    years: List[CurriculumYear]


class AcademicRecordItem(BaseModel):
    subject_code: str
    grade: float
    status: str
    school_year: Optional[str] = None
    semesters: Optional[str] = None


class AcademicRecordsDocument(BaseModel):
    student_no: str
    records: List[AcademicRecordItem]


class PreAdvisingRequest(BaseModel):
    student_no: str
    year_level: int
    semester: Literal["1", "2"]
    status: Literal["regular", "irregular"]


class RecommendedSubject(BaseModel):
    subject_code: str
    title: str
    year_level: int
    semester: Literal["1", "2"]


class PreAdvisingResponse(BaseModel):
    student_no: str
    status: Literal["regular", "irregular"]
    recommended_subjects: List[RecommendedSubject]

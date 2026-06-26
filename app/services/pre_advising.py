from datetime import datetime
from typing import Dict, List, Set, Tuple

from fastapi import HTTPException

from app.database import academic_records_collection, curriculum_collection, enrollment_collection
from app.models import (
    AcademicRecordsDocument,
    CurriculumDocument,
    PreAdvisingRequest,
    PreAdvisingResponse,
    RecommendedSubject,
)


async def load_curriculum() -> CurriculumDocument:
    document = await curriculum_collection.find_one({"program": "BSIT"})
    if not document:
        raise HTTPException(status_code=404, detail="Curriculum not found for program BSIT")
    return CurriculumDocument(**document)


async def load_student_records(student_no: str) -> AcademicRecordsDocument:
    document = await academic_records_collection.find_one({"student_no": student_no})
    if not document:
        raise HTTPException(status_code=404, detail="Student not found")
    return AcademicRecordsDocument(**document)


def normalize_subject_code(code: str) -> str:
    return str(code).strip().upper() if code is not None else ""


def flatten_curriculum(curriculum: CurriculumDocument) -> List[Dict]:
    subjects = []
    for year in curriculum.years:
        for semester_key, semester_subjects in year.semesters.items():
            for subject in semester_subjects:
                subjects.append(
                    {
                        "subject_code": normalize_subject_code(subject.subject_code),
                        "title": subject.title,
                        "lec": subject.lec,
                        "lab": subject.lab,
                        "units": subject.units,
                        "prerequisites": [
                            normalize_subject_code(code)
                            for code in (subject.prerequisites or [])
                        ],
                        "year_level": year.year_level,
                        "semester": str(semester_key).strip(),
                    }
                )
    return subjects


def build_passed_subjects(records: AcademicRecordsDocument) -> Set[str]:

    passed = {
        normalize_subject_code(record.subject_code)
        for record in records.records
        if record.status in {"credited", "completed"}
    }
    return passed


def build_taken_subjects(records: AcademicRecordsDocument) -> Set[str]:
    return {normalize_subject_code(record.subject_code) for record in records.records}


async def generate_regular_recommendations(year_level: int, semester: str) -> List[RecommendedSubject]:
    curriculum = await load_curriculum()
    year_document = next((year for year in curriculum.years if year.year_level == year_level), None)
    if not year_document:
        raise HTTPException(status_code=404, detail=f"Curriculum year_level {year_level} not found")

    semester = str(semester).strip()
    semester_subjects = year_document.semesters.get(semester, [])
    recommendations = [
        RecommendedSubject(
            subject_code=subject.subject_code,
            title=subject.title,
            year_level=year_document.year_level,
            semester=semester,
        )
        for subject in semester_subjects
    ]
    return recommendations


async def generate_irregular_recommendations(
    year_level: int, semester: str, student_no: str
) -> List[RecommendedSubject]:
    curriculum = await load_curriculum()
    student_records = await load_student_records(student_no)

    semester = str(semester).strip()
    passed_subjects = build_passed_subjects(student_records)
    taken_subjects = build_taken_subjects(student_records)

    flattened_subjects = flatten_curriculum(curriculum)
    recommended: List[Dict] = []
    seen: Set[Tuple[str, int, str]] = set()
    MAX_SUBJECTS = 9

    year_levels = sorted(set(s["year_level"] for s in flattened_subjects))

    for current_year_level in year_levels:
        if len(recommended) >= MAX_SUBJECTS:
            break

        year_subjects = [s for s in flattened_subjects if s["year_level"] == current_year_level]

        for subject in year_subjects:
            if len(recommended) >= MAX_SUBJECTS:
                break

            code = subject["subject_code"]
            subject_year_level = subject["year_level"]
            subject_semester = subject["semester"]
            prerequisites = subject["prerequisites"]

            if code in passed_subjects:
                continue

            if subject_semester != semester:
                continue

           
            if prerequisites:
        
                if not all(prereq in passed_subjects for prereq in prerequisites):
        
                    continue

            unique_key = (code, subject_year_level, subject_semester)
            if unique_key in seen:
                continue

            seen.add(unique_key)
            recommended.append(
                {
                    "subject_code": code,
                    "title": subject["title"],
                    "year_level": subject_year_level,
                    "semester": subject_semester,
                }
            )

    recommended.sort(key=lambda item: item["year_level"])
    return [RecommendedSubject(**subject) for subject in recommended]


async def save_enrollment(student_no: str, year_level: int, semester: str, subjects: List[RecommendedSubject]) -> None:
    semester = str(semester).strip()

    # Prevent duplicate pre-advising entries for the same student and term
    existing = await enrollment_collection.find_one(
        {"student_no": student_no, "year_level": year_level, "semester": semester}
    )
    if existing:
        raise HTTPException(status_code=409, detail="This Student Already Pre-Advised")

    document = {
        "student_no": student_no,
        "year_level": year_level,
        "semester": semester,
        "subjects": [subject.dict() for subject in subjects],
        "date_generated": datetime.utcnow(),
    }
    await enrollment_collection.insert_one(document)


async def generate_pre_advising(request: PreAdvisingRequest) -> PreAdvisingResponse:
    await load_student_records(request.student_no)

    if request.status == "regular":
        recommended_subjects = await generate_regular_recommendations(request.year_level, request.semester)
    else:
        recommended_subjects = await generate_irregular_recommendations(
            request.year_level, request.semester, request.student_no
        )

    await save_enrollment(request.student_no, request.year_level, request.semester, recommended_subjects)

    return PreAdvisingResponse(
        student_no=request.student_no,
        status=request.status,
        recommended_subjects=recommended_subjects,
    )

import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client.get_database("school_system")

schedule_col = db.schedule
curriculum_col = db.curriculum
students_col = db.students
users_col = db.users
teachers_col = db.teachers
sections_col = db.sections
enrollments_col = db.enrollments
academic_records_col = db.academic_records

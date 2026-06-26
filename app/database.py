import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI environment variable is required")

client = AsyncIOMotorClient(MONGO_URI)
db = client.get_database("school_system")

curriculum_collection = db.get_collection("curriculum")
academic_records_collection = db.get_collection("academic_records")
enrollment_collection = db.get_collection("enrollment")
students_collection = db.get_collection("students")

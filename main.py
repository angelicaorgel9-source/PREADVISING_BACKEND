from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.pre_advising import router as pre_advising_router
from app.routes.frontend_bridge import router as frontend_bridge_router

app = FastAPI(title="Pre-Advising System")

# CORS: allow common frontend dev origins (adjust as needed for production)
app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:5173", "http://localhost:3000"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(pre_advising_router)
app.include_router(frontend_bridge_router)

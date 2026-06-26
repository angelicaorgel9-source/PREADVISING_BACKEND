from fastapi import APIRouter

from app.models import PreAdvisingRequest, PreAdvisingResponse
from app.services.pre_advising import generate_pre_advising

router = APIRouter(prefix="/pre-advising", tags=["pre-advising"])


@router.post("/", response_model=PreAdvisingResponse)
async def create_pre_advising(request: PreAdvisingRequest) -> PreAdvisingResponse:
    return await generate_pre_advising(request)

from fastapi import APIRouter, Depends
from app.schemas.planner import TripPlanRequest, TripPlanResponse
from app.services.planner_service import TripPlannerService, get_planner_service

router = APIRouter(prefix="/plan-trip")


@router.post("", response_model=TripPlanResponse)
async def plan_trip(
    request: TripPlanRequest, service: TripPlannerService = Depends(get_planner_service)
) -> TripPlanResponse:
    return await service.generate(request)

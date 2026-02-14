from backend.models import modelTrackable
from sqlalchemy import select, func
from sqlalchemy.orm import Session


def _get_trackable_by_series(series: str, db: Session) -> modelTrackable:
    """ """
    trackables = db.scalars(
        select(modelTrackable).where(modelTrackable.series == series)
    ).all()
    """ TODO check if series exists 
    if not trackable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trackable with internal id '{trackable_id}' not found.",
        )
    """
    return trackables


def _get_all_series(db: Session):
    stmt = select(
        modelTrackable.series.label("name"),
        func.count().label("count"),
        modelTrackable.icon_url.label("icon_url"),
    ).group_by(modelTrackable.series)

    result = db.execute(stmt).all()
    return result

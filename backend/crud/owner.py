from backend.models import modelTrackable
from sqlalchemy import select, func
from sqlalchemy.orm import Session


def _get_trackable_by_owner(owner: str, db: Session) -> modelTrackable:
    """ """
    trackables = db.scalars(
        select(modelTrackable).where(modelTrackable.owner == owner)
    ).all()
    """ TODO check if the owner exists 
    if not trackable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trackable with internal id '{trackable_id}' not found.",
        )
    """
    return trackables


def _get_all_owners(db: Session):
    stmt = select(
        modelTrackable.owner.label("owner"), func.count().label("trackable_count")
    ).group_by(modelTrackable.owner)

    result = db.execute(stmt).all()
    return result

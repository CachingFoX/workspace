from backend.models import modelTag
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy import select
from backend.models import modelTrackableTag


def __get_tag(tag_id: int, db: Session) -> modelTag:
    return db.get(modelTag, tag_id)


def _exists_tag(tag_id: int, db: Session) -> modelTag:
    """
    Returns a tag data record referenced his internal database id

    :param tag_id: Description
    :type tag_id: int
    :param db: Description
    :type db: Session
    """
    tag = __get_tag(tag_id, db)
    if not tag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tag with id '{tag_id}' not found.",
        )
    return tag


def _not_exists_tag(tag_id: int, db: Session) -> None:
    if __get_tag(tag_id, db):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A tag with '{tag_id}' already exists",
        )


def _create(name: str, db: Session) -> modelTag:
    tag = modelTag(
        name=name,
        unique_name=name,
    )

    # check if tag doesn't exists
    # TODO _not_exists_tag(tag.unique, db)

    try:
        db.add(tag)
        db.commit()
        db.refresh(tag)
        return tag
    except ValueError as e:
        # ValidationError aus @validates abfangen
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)
        )
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"A tag with name '{tag.name}' (unique name: {tag.unique_name}) already exists.",
        )


def _read_all(db: Session) -> modelTag:
    return db.query(modelTag).order_by(modelTag.name).all()


def _read_all_with_use(db: Session):  # -> modelTag:
    stmt = (
        select(
            modelTag.id,
            modelTag.name,
            modelTag.unique_name,
            func.count(modelTrackableTag.id).label("use"),
        )
        .outerjoin(
            modelTrackableTag, modelTrackableTag.tag_id == modelTag.id
        )  # LEFT JOIN
        .group_by(modelTag.id)
        .order_by(func.count(modelTrackableTag.id).desc(), modelTrackableTag.id)
    )

    return db.execute(stmt).all()


def _update(tag_id: int, data, db: Session) -> modelTag:
    tag = _exists_tag(tag_id, db)
    try:
        tag.name = data.name
        tag.unique_name = data.name

        # check if tag doesn't already exists
        # TODO _not_exists_tag(tag.unique, db)

        db.commit()
        db.refresh(tag)
        return tag
    except ValueError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)
        )
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Tag can not be modified."
        )


def _delete(tag_id: int, db: Session) -> modelTag:
    tag = _exists_tag(tag_id, db)
    db.delete(tag)
    db.commit()

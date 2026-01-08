from database import get_db
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from models import tag as model
from schemas import tag as schema

router = APIRouter(
    prefix="/tags",
    tags=["tags"],
)


# CRUD
@router.post("/", response_model=schema.TagRead)
def create_tag(newTag: schema.TagCreate, db: Session = Depends(get_db)):
    try:
        existing_tag = db.query(model.Tag).filter(model.Tag.name == newTag.name).first()

        if existing_tag:
            raise HTTPException(
                status_code=409,
                detail=f"A tag with name '{newTag.name}' already exists",
            )

        db_tag = model.Tag(
            name=newTag.name,
            unique_name=newTag.name,
        )

        db.add(db_tag)
        db.commit()
        db.refresh(db_tag)
        return db_tag
    except ValueError as e:
        # ValidationError aus @validates abfangen
        db.rollback()
        raise HTTPException(status_code=422, detail=str(e))
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=422, detail=f"A tag with name '{newTag.name}' already exists"
        )


@router.get("/", response_model=list[schema.TagRead])
def read_tags(db: Session = Depends(get_db)):
    return db.query(model.Tag).all()


@router.get("/{id}", response_model=schema.TagRead)
def read_tag(id: str, db: Session = Depends(get_db)):
    tag = db.query(model.Tag).filter(model.Tag.id == id).first()
    if not tag:
        raise HTTPException(status_code=404, detail=f"Tag '{id}' does not exist")
    return tag


@router.patch("/{id}", response_model=schema.TagRead)
def update_tag(
    tag_id: str,
    update: schema.TagUpdate,
    db: Session = Depends(get_db),
):
    try:
        tag = db.query(model.Tag).filter(model.Tag.id == tag_id).first()
        if not tag:
            raise HTTPException(
                status_code=404, detail=f"Tag with '{id}' does not exist"
            )

        tag.name = update.name
        tag.unique_name = update.name

        db.commit()
        db.refresh(tag)
        return tag

    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=422, detail=str(e))
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Tag can not be modified.")


@router.delete("/{id}", status_code=204)
def delete_user(id: int, db: Session = Depends(get_db)):
    tag = db.query(model.Tag).filter(model.Tag.id == id).first()
    if not tag:
        raise HTTPException(status_code=404, detail=f"Tag with id '{id}' not found")

    db.delete(tag)
    db.commit()

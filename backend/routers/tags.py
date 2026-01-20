from backend.database import get_db
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.models import modelTag
from backend.schemas import tag as schema
from backend.crud.tag import _create, _exists_tag, _update, _delete

router = APIRouter(
    prefix="/tags",
    tags=["tags"],
)


@router.post("/", response_model=schema.TagRead)
def create_tag(newTag: schema.TagCreate, db: Session = Depends(get_db)):
    _create(newTag.name, db)


@router.get("/", response_model=list[schema.TagRead])
def read_all_tags(db: Session = Depends(get_db)):
    return db.query(modelTag).all()


@router.get("/{tag_id}", response_model=schema.TagRead)
def read_tag(tag_id: str, db: Session = Depends(get_db)):
    return _exists_tag(tag_id, db)


@router.patch("/{tag_id}", response_model=schema.TagRead)
def update_tag(
    tag_id: str,
    data: schema.TagUpdate,
    db: Session = Depends(get_db),
):
    _update(tag_id, data, db)


@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tag(tag_id: int, db: Session = Depends(get_db)):
    _delete(tag_id, db)

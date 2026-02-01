from pydantic import BaseModel

"""
class TrackableProperty(Base):
    __tablename__ = "trackables_properties"

    id = Column(Integer, primary_key=True)
    trackable_id = Column(Integer, ForeignKey("trackables.id"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    text = Column(String, default=False)
"""


class TrackableAttachedProperty2(BaseModel):
    id: int
    name: str
    type: str
    value: str
    property_id: int

    class Config:
        orm_mode = True

    @classmethod
    def from_orm_with_transform(cls, property):
        return cls(
            id=property.property.id,
            name=property.property.name,  # property.name,
            type=property.property.type,  # property.type,
            value=property.text,
            property_id=property.id,
        )


def transformAttachedProperties(properties, sort=False):
    attachedProperties = [
        TrackableAttachedProperty2.from_orm_with_transform(property)
        for property in properties
    ]
    # if sort:
    #    attachedProperties.sort(key=lambda item: (item.name))
    return attachedProperties


class TrackableProperty(BaseModel):
    id: int | None
    trackable_id: int
    property_id: int
    text: str

    class Config:
        orm_mode = True


class TrackablePropertyNew(BaseModel):
    property_id: int
    property_value: str

    class Config:
        orm_mode = True


class TrackablePropertyUpdate(BaseModel):
    property_value: str

    class Config:
        orm_mode = True


class TrackablePropertyResolved(BaseModel):
    id: int | None
    property_name: str
    property_type: str
    property_value: str | None
    property_id: int

    class Config:
        orm_mode = True

    @classmethod
    def from_orm_with_transform(cls, item):
        return cls(
            id=item.id,
            property_name=item.PropertyName,
            property_type=item.PropertyType,
            property_value=item.PropertyValue,
            property_id=item.PropertyId,
        )

    @classmethod
    def from_orm(cls, property):
        return cls(
            id=property.property.id,
            property_name=property.property.name,
            property_type=property.property.type,
            property_value=property.text,
            property_id=property.id,
        )


def transformItems(cls, items):
    transformedItems = [cls.from_orm_with_transform(item) for item in items]
    # if sort:
    #    attachedProperties.sort(key=lambda item: (item.name))
    return transformedItems

def list_of_items_from_orm(cls, items):
    transformedItems = [cls.from_orm(item) for item in items]
    # if sort:
    #    attachedProperties.sort(key=lambda item: (item.name))
    return transformedItems

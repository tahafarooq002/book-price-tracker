from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BookBase(BaseModel):
    title: str
    price: float
    rating: Optional[str] = None
    availability: Optional[str] = None
    category: Optional[str] = None

class BookCreate(BookBase):
    pass

class BookOut(BookBase):
    id: int
    scraped_at: datetime

    class Config:
        from_attributes = True
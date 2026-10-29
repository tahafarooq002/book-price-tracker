from sqlalchemy import Column, Integer, String, Float, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from app.database import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    price = Column(Float, nullable=False)
    rating = Column(String, nullable=True)
    availability = Column(String, nullable=True)
    category = Column(String, nullable=True, index=True)
    scraped_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("title", "category", name="uq_title_category"),
    )
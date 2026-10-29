from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert
from app.models import Book
from typing import Optional, List

def get_books(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
) -> List[Book]:
    query = db.query(Book)

    if category:
        query = query.filter(Book.category.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.filter(Book.price >= min_price)
    if max_price is not None:
        query = query.filter(Book.price <= max_price)

    return query.offset(skip).limit(limit).all()

def get_book(db: Session, book_id: int) -> Optional[Book]:
    return db.query(Book).filter(Book.id == book_id).first()

def upsert_books(db: Session, books_data: list[dict]):
    """Insert books, skip duplicates based on title + category"""
    if not books_data:
        return 0

    stmt = insert(Book).values(books_data)
    stmt = stmt.on_conflict_do_nothing(index_elements=["title", "category"])
    result = db.execute(stmt)
    db.commit()
    return result.rowcount
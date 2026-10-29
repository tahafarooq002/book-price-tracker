from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from app.database import get_db, engine, Base
from app.models import Book
from app.schemas import BookOut
from app import crud
from app.scraper import scrape_books

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Book Price Tracker API",
    description="Scrape and serve book data from books.toscrape.com",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "Book Price Tracker API is running"}

@app.get("/books", response_model=List[BookOut])
def list_books(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db),
):
    books = crud.get_books(
        db=db,
        skip=skip,
        limit=limit,
        category=category,
        min_price=min_price,
        max_price=max_price,
    )
    return books

@app.get("/books/{book_id}", response_model=BookOut)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = crud.get_book(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@app.post("/scrape")
def trigger_scrape(db: Session = Depends(get_db)):
    try:
        books_data = scrape_books(max_pages=3)
        inserted = crud.upsert_books(db, books_data)
        return {
            "message": "Scraping completed",
            "scraped": len(books_data),
            "inserted": inserted
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")
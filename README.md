# Book Price Tracker API

A simple backend service that scrapes book data from [books.toscrape.com](https://books.toscrape.com) and exposes it through a REST API.

## Features

- Scrapes book title, price, rating, availability, and category
- Stores data in PostgreSQL
- RESTful API with FastAPI
- Pagination and filtering
- Dockerized (run with one command)
- Prevents duplicate entries

## Tech Stack

- Python 3.12
- FastAPI
- SQLAlchemy
- PostgreSQL
- BeautifulSoup + Requests
- Docker & Docker Compose

## How to Run

### Prerequisites
- Docker & Docker Compose installed

### Start the project

```bash
docker-compose up --build
```

The API will be available at: [http://localhost:8000](http://localhost:8000)

Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## API Endpoints

### 1. Get all books (with pagination & filters)
```
GET /books
```

**Query Parameters:**
- `skip` (default: 0)
- `limit` (default: 20)
- `category` (optional)
- `min_price` (optional)
- `max_price` (optional)

**Examples:**
```
GET /books
GET /books?skip=0&limit=10
GET /books?min_price=20&max_price=40
GET /books?category=General
```

### 2. Get a single book
```
GET /books/{id}
```

### 3. Trigger scraper
```
POST /scrape
```

This will scrape the latest books and insert only new ones (no duplicates).

---

## Running the Scraper Independently

You can also run the scraper as a standalone script:

```bash
python -m app.scraper
```

---

## Project Structure

```
book-price-tracker/
├── app/
│   ├── main.py          # FastAPI application
│   ├── database.py      # Database connection
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   ├── scraper.py       # Web scraper
│   └── crud.py          # Database operations
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

## Environment Variables

| Variable       | Description                  |
|----------------|------------------------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `POSTGRES_USER`| Database user                |
| `POSTGRES_PASSWORD` | Database password       |
| `POSTGRES_DB`  | Database name                |

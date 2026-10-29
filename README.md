# Book Price Tracker API

A backend service that scrapes book data from [books.toscrape.com](https://books.toscrape.com) and exposes it through a clean REST API.

## Features

- Scrapes book **title, price, rating, availability, and real category**
- Stores data in PostgreSQL
- RESTful API built with FastAPI
- Supports pagination and filtering (by category & price range)
- Prevents duplicate entries
- Fully Dockerized (run with a single command)

## Tech Stack

- Python 3.12
- FastAPI
- SQLAlchemy
- PostgreSQL
- BeautifulSoup + Requests
- Docker & Docker Compose

## How to Run

### Prerequisites
- Docker and Docker Compose installed

### Start the project

```bash
docker-compose up --build
```

The API will be available at:  
**http://localhost:8000**

Interactive API documentation (Swagger UI):  
**http://localhost:8000/docs**

---

## API Endpoints

### 1. Get all books (with pagination & filters)

```
GET /books
```

**Query Parameters:**
- `skip` (default: 0)
- `limit` (default: 20, max: 100)
- `category` (optional)
- `min_price` (optional)
- `max_price` (optional)

**Examples:**

```
GET /books
GET /books?skip=0&limit=10
GET /books?min_price=20&max_price=40
GET /books?category=Travel
GET /books?category=Mystery
GET /books?category=Fantasy&min_price=30
```

### 2. Get a single book by ID

```
GET /books/{id}
```

### 3. Trigger the scraper

```
POST /scrape
```

This will scrape the latest books from the website and insert only new ones (duplicates are automatically skipped).

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
│   ├── main.py          # FastAPI application & endpoints
│   ├── database.py      # Database connection
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   ├── scraper.py       # Web scraper
│   └── crud.py          # Database operations
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .gitignore
└── README.md
```

## Environment Variables

| Variable            | Description                     |
|---------------------|---------------------------------|
| `DATABASE_URL`      | PostgreSQL connection string    |
| `POSTGRES_USER`     | Database username               |
| `POSTGRES_PASSWORD` | Database password               |
| `POSTGRES_DB`       | Database name                   |

---

## Notes

- The scraper extracts real categories (Travel, Mystery, Fantasy, etc.)
- Duplicate books are prevented using a unique constraint on `title + category`
- The project is designed to run fully with `docker-compose up --build`

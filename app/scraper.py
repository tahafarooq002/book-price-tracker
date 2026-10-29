import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from typing import List, Dict
import time

BASE_URL = "https://books.toscrape.com/"

RATING_MAP = {
    "One": "1",
    "Two": "2",
    "Three": "3",
    "Four": "4",
    "Five": "5",
}

def get_soup(url: str) -> BeautifulSoup | None:
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return BeautifulSoup(response.text, "lxml")
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def scrape_books(max_pages: int = 3) -> List[Dict]:
    """
    Scrape books from books.toscrape.com
    Returns a list of dictionaries ready for database insertion.
    """
    books = []
    page = 1

    while page <= max_pages:
        if page == 1:
            url = BASE_URL
        else:
            url = f"{BASE_URL}catalogue/page-{page}.html"

        print(f"Scraping page {page}: {url}")
        soup = get_soup(url)
        if not soup:
            break

        articles = soup.select("article.product_pod")
        if not articles:
            break

        for article in articles:
            try:
                title = article.select_one("h3 a")["title"].strip()

                # Robust price cleaning
                price_text = article.select_one("p.price_color").text
                price = float("".join(c for c in price_text if c.isdigit() or c == "."))

                rating_class = article.select_one("p.star-rating")["class"]
                rating = RATING_MAP.get(rating_class[1], "0")

                availability = article.select_one("p.instock.availability").text.strip()
                category = "General"

                books.append({
                    "title": title,
                    "price": price,
                    "rating": rating,
                    "availability": availability,
                    "category": category,
                    "scraped_at": datetime.now(timezone.utc),
                })
            except Exception as e:
                print(f"Skipping a book due to error: {e}")
                continue

        page += 1
        time.sleep(0.5)  # Be polite

    print(f"Scraped {len(books)} books")
    return books

if __name__ == "__main__":
    data = scrape_books(max_pages=2)
    for book in data[:3]:
        print(book)
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

def get_categories() -> List[Dict[str, str]]:
    """Get all category names and their URLs from the sidebar."""
    soup = get_soup(BASE_URL)
    if not soup:
        return []

    categories = []
    side_menu = soup.select("div.side_categories ul li ul li a")
    
    for item in side_menu:
        name = item.text.strip()
        href = item.get("href")
        full_url = BASE_URL + href
        categories.append({"name": name, "url": full_url})
    
    return categories

def scrape_books(max_pages_per_category: int = 1) -> List[Dict]:
    """
    Scrape books with real categories.
    By default scrapes 1 page from each category (still gets good variety).
    """
    books = []
    categories = get_categories()

    print(f"Found {len(categories)} categories")

    for cat in categories:
        category_name = cat["name"]
        url = cat["url"]

        print(f"Scraping category: {category_name}")

        for page in range(1, max_pages_per_category + 1):
            if page == 1:
                page_url = url
            else:
                # Handle pagination inside category
                page_url = url.replace("index.html", f"page-{page}.html")

            soup = get_soup(page_url)
            if not soup:
                break

            articles = soup.select("article.product_pod")
            if not articles:
                break

            for article in articles:
                try:
                    title = article.select_one("h3 a")["title"].strip()

                    # Clean price
                    price_text = article.select_one("p.price_color").text
                    price = float("".join(c for c in price_text if c.isdigit() or c == "."))

                    rating_class = article.select_one("p.star-rating")["class"]
                    rating = RATING_MAP.get(rating_class[1], "0")

                    availability = article.select_one("p.instock.availability").text.strip()

                    books.append({
                        "title": title,
                        "price": price,
                        "rating": rating,
                        "availability": availability,
                        "category": category_name,
                        "scraped_at": datetime.now(timezone.utc),
                    })
                except Exception as e:
                    print(f"Skipping a book due to error: {e}")
                    continue

            time.sleep(0.4)  # Be polite

    print(f"Scraped {len(books)} books")
    return books

if __name__ == "__main__":
    data = scrape_books(max_pages_per_category=1)
    for book in data[:5]:
        print(book)
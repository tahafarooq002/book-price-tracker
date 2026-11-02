export interface Book {
  id: number;
  title: string;
  price: number;
  rating: string;
  availability: string;
  category: string;
  scraped_at: string;
}

export interface ScrapeResponse {
  message: string;
  scraped: number;
  inserted: number;
}

export interface BooksParams {
  skip?: number;
  limit?: number;
  category?: string;
  min_price?: number;
  max_price?: number;
}

import axios from 'axios';
import type { Book, ScrapeResponse, BooksParams } from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000, // 2 minutes
});

export const getBooks = async (params: BooksParams = {}): Promise<Book[]> => {
  const { data } = await api.get<Book[]>('/books', { params });
  return data;
};

export const getBook = async (id: number): Promise<Book> => {
  const { data } = await api.get<Book>(`/books/${id}`);
  return data;
};

export const triggerScrape = async (): Promise<ScrapeResponse> => {
  const { data } = await api.post<ScrapeResponse>('/scrape', null, {
    timeout: 180000, // 3 minutes for scraping
  });
  return data;
};
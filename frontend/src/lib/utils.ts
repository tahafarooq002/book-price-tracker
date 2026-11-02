import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return `£${price.toFixed(2)}`;
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}
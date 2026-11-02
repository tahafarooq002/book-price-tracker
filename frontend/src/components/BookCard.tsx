import { Link } from 'react-router-dom';
import { Star, Tag, ArrowUpRight, BookOpen } from 'lucide-react';
import type { Book } from '../types';
import { formatPrice } from '../lib/utils';

interface Props {
  book: Book;
}

export default function BookCard({ book }: Props) {
  const ratingNum = parseInt(book.rating) || 0;
  const isInStock = book.availability.toLowerCase().includes('in stock');

  return (
    <Link
      to={`/books/${book.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50 dark:hover:shadow-indigo-950/30"
    >
      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-blue-500 opacity-70 transition-opacity group-hover:opacity-100" />

      <div className="flex flex-1 flex-col p-5">
        {/* Book ID and price */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            #{book.id}
          </span>

          <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
            {formatPrice(book.price)}
          </span>
        </div>

        {/* Book title */}
        <div className="mb-4 flex flex-1 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <BookOpen className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="line-clamp-2 font-semibold leading-6 text-slate-800 transition-colors group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
              {book.title}
            </h3>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Book #{book.id}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= ratingNum
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-200 dark:text-slate-700'
                }`}
              />
            ))}
          </div>

          <span className="ml-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            {book.rating}/5
          </span>
        </div>

        {/* Category and availability */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Tag className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate text-xs font-medium">
              {book.category}
            </span>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
              isInStock
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
            }`}
          >
            {book.availability}
          </span>
        </div>

        {/* Hover action */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-indigo-600 opacity-70 transition-all group-hover:opacity-100 dark:border-slate-800 dark:text-indigo-400">
          <span>View book details</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}

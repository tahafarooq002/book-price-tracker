
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBook } from '../lib/api';
import {
  ArrowLeft,
  ArrowUpRight,
  Star,
  Tag,
  Package,
  Calendar,
  Hash,
  BookOpen,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { formatPrice, formatDate } from '../lib/utils';

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const bookId = Number(id);

  const {
    data: book,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => getBook(bookId),
    enabled: !isNaN(bookId),
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg" />

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="h-56 bg-slate-200 dark:bg-slate-700" />

          <div className="p-6 sm:p-8 space-y-6">
            <div className="h-8 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-lg" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 bg-slate-100 dark:bg-slate-700 rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !book || isNaN(bookId)) {
    return (
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-10 sm:p-16 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-5">
          <BookOpen className="w-8 h-8 text-red-500" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Book Not Found
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          We couldn't find the book you're looking for. It may have been
          removed or the ID may be invalid.
        </p>

        <Link
          to="/books"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Books
        </Link>
      </div>
    );
  }

  const ratingNum = parseInt(book.rating) || 0;

  const isInStock = book.availability
    ?.toLowerCase()
    .includes('in stock');

  const detailItems = [
    {
      label: 'Category',
      value: book.category || 'Not specified',
      icon: Tag,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-500/10',
    },
    {
      label: 'Availability',
      value: book.availability || 'Unknown',
      icon: Package,
      color: isInStock
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-red-600 dark:text-red-400',
      bg: isInStock
        ? 'bg-emerald-50 dark:bg-emerald-500/10'
        : 'bg-red-50 dark:bg-red-500/10',
    },
    {
      label: 'Scraped At',
      value: formatDate(book.scraped_at),
      icon: Calendar,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Breadcrumb / Back Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          to="/books"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Books
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
            Book Details
          </span>
        </div>
      </div>

      {/* Main Book Card */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">

        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 px-6 py-8 sm:px-9 sm:py-10 text-white">
          <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-32 left-1/3 w-72 h-72 rounded-full bg-violet-300/10 blur-3xl pointer-events-none" />

          <div className="relative">

            {/* Book ID */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-indigo-100 text-xs font-semibold mb-6">
              <Hash className="w-3.5 h-3.5" />
              Book ID #{book.id}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight max-w-3xl">
              {book.title}
            </h1>

            <p className="text-sm text-indigo-100 mt-3">
              Explore pricing, ratings, category, and availability information.
            </p>

            {/* Price and Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 mt-8">

              <div>
                <p className="text-xs font-medium text-indigo-200 uppercase tracking-wider mb-1">
                  Current Price
                </p>

                <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {formatPrice(book.price)}
                </p>
              </div>

              <div className="hidden sm:block w-px h-12 bg-white/20" />

              <div>
                <p className="text-xs font-medium text-indigo-200 uppercase tracking-wider mb-2">
                  Customer Rating
                </p>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= ratingNum
                            ? 'fill-amber-300 text-amber-300'
                            : 'text-indigo-300/50'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="ml-1 text-sm font-semibold text-white">
                    {book.rating}/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Book Information */}
        <div className="p-6 sm:p-9">

          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Book Information
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed information about this book
              </p>
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {detailItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="p-5 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-700/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg}`}
                    >
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>

                    {item.label === 'Availability' && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isInStock ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      />
                    )}
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    {item.label}
                  </p>

                  <p className="text-sm font-bold text-slate-800 dark:text-white break-words">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Additional Details */}
          <div className="mt-6 p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  Collection Record
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Reference ID: #{book.id}
                </p>
              </div>
            </div>

            <Link
              to="/books"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              Explore collection
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getBooks } from '../lib/api';
import ScrapeButton from '../components/ScrapeButton';
import {
  BookOpen,
  DollarSign,
  Star,
  Tag,
  ArrowUpRight,
  Database,
  Layers3,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { formatPrice } from '../lib/utils';

export default function Dashboard() {
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books', { limit: 1000 }],
    queryFn: () => getBooks({ limit: 1000 }),
  });

  const totalBooks = books.length;

  const avgPrice =
    totalBooks > 0
      ? books.reduce((sum, b) => sum + b.price, 0) / totalBooks
      : 0;

  const categoryCounts = books.reduce((acc: Record<string, number>, book) => {
    if (book.category) {
      acc[book.category] = (acc[book.category] || 0) + 1;
    }
    return acc;
  }, {});

  const categories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100);

  const avgRating =
    totalBooks > 0
      ? books.reduce((sum, b) => sum + (parseInt(b.rating) || 0), 0) /
        totalBooks
      : 0;

  const maxCategoryCount = Math.max(...Object.values(categoryCounts), 1);

  const filteredCategories = categories.filter(
    ([name]) => categoryFilter === 'all' || name === categoryFilter
  );

  const stats = [
    {
      label: 'Total Books',
      value: isLoading ? '—' : totalBooks.toLocaleString(),
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      gradient: 'from-blue-500/10 to-transparent',
      link: '/books',
      description: 'Books in collection',
    },
    {
      label: 'Average Price',
      value: isLoading ? '—' : formatPrice(avgPrice),
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      gradient: 'from-emerald-500/10 to-transparent',
      link: '/books?sort=price-asc',
      description: 'Average book price',
    },
    {
      label: 'Categories',
      value: isLoading ? '—' : Object.keys(categoryCounts).length,
      icon: Tag,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-500/10',
      gradient: 'from-violet-500/10 to-transparent',
      link: '/books',
      description: 'Unique categories',
    },
    {
      label: 'Average Rating',
      value: isLoading ? '—' : avgRating.toFixed(1),
      icon: Star,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      gradient: 'from-amber-500/10 to-transparent',
      link: '/books?sort=rating-desc',
      description: 'Average book rating',
    },
  ];

  return (
    <div className="space-y-7">

      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Overview
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome to your Dashboard
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor your book collection and track pricing insights.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            Dashboard Active
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.label}
              to={stat.link}
              className={`relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group bg-gradient-to-br ${stat.gradient}`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>

                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                  {stat.value}
                </h3>

                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  {stat.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Data Collection */}
      <section className="relative overflow-hidden rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-white dark:bg-slate-800 shadow-sm">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Data Collection
                  </h3>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    Web Scraper
                  </span>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
                  Fetch the latest book information and update your collection
                  directly from books.toscrape.com.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <ScrapeButton />
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Automated book collection
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Updated collection insights
            </div>
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
                <Layers3 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Top Categories
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Explore books grouped by category
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                {filteredCategories.length} shown
              </span>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="min-w-[155px] px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                <option value="all">All Categories</option>

                {Object.keys(categoryCounts)
                  .sort((a, b) => a.localeCompare(b))
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2 animate-pulse">
                  <div className="flex justify-between">
                    <div className="h-3 w-28 bg-slate-100 dark:bg-slate-700 rounded" />
                    <div className="h-3 w-16 bg-slate-100 dark:bg-slate-700 rounded" />
                  </div>

                  <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto space-y-5 pr-2 custom-scrollbar">
              {filteredCategories.length > 0 ? (
                filteredCategories.map(([name, count], index) => (
                  <Link
                    key={name}
                    to={`/books?category=${encodeURIComponent(name)}`}
                    className="block group rounded-xl p-3 -mx-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-300 shrink-0 group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:group-hover:bg-indigo-500/20 dark:group-hover:text-indigo-400 transition-colors">
                          {index + 1}
                        </span>

                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {count} books
                        </span>

                        <ArrowUpRight className="w-4 h-4 text-slate-300 dark:text-slate-500 group-hover:text-indigo-500 transition-colors" />
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500 group-hover:brightness-110"
                        style={{
                          width: `${(count / maxCategoryCount) * 100}%`,
                        }}
                      />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-12 text-center">
                  <Tag className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />

                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    No categories found
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Try selecting another category.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Showing your collection breakdown
          </span>

          <Link
            to="/books"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            View all books
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

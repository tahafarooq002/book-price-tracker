
import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBooks } from '../lib/api';
import BookCard from '../components/BookCard';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpDown,
  BookOpen,
  SlidersHorizontal,
  Sparkles,
  Tag,
  RotateCcw,
} from 'lucide-react';

type SortOption =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'title-asc';

export default function Books() {
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();

  const [category, setCategory] = useState(
    () => searchParams.get('category') || ''
  );

  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [availability, setAvailability] = useState('');
  const [rating, setRating] = useState('');

  const [sort, setSort] = useState<SortOption>(() => {
    const initialSort = searchParams.get('sort');

    return initialSort === 'price-asc' || initialSort === 'rating-desc'
      ? initialSort
      : 'default';
  });

  const [page, setPage] = useState(0);

  const limit = 12;

  const { data: allBooks = [], isLoading } = useQuery({
    queryKey: ['books', { limit: 1000 }],
    queryFn: () => getBooks({ limit: 1000 }),
  });

  const categories = useMemo(() => {
    return [...new Set(allBooks.map((b) => b.category).filter(Boolean))].sort();
  }, [allBooks]);

  const filteredBooks = useMemo(() => {
    let result = [...allBooks];

    if (category) {
      result = result.filter((b) => b.category === category);
    }

    if (minPrice) {
      result = result.filter((b) => b.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter((b) => b.price <= Number(maxPrice));
    }

    if (availability === 'in-stock') {
      result = result.filter((b) =>
        b.availability.toLowerCase().includes('in stock')
      );
    } else if (availability === 'out-of-stock') {
      result = result.filter(
        (b) => !b.availability.toLowerCase().includes('in stock')
      );
    }

    if (rating) {
      result = result.filter(
        (b) => (parseInt(b.rating) || 0) === Number(rating)
      );
    }

    if (search) {
      result = result.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;

      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;

      case 'rating-desc':
        result.sort(
          (a, b) =>
            (parseInt(b.rating) || 0) - (parseInt(a.rating) || 0)
        );
        break;

      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [
    allBooks,
    category,
    minPrice,
    maxPrice,
    availability,
    rating,
    search,
    sort,
  ]);

  const totalPages = Math.ceil(filteredBooks.length / limit) || 1;

  const paginatedBooks = filteredBooks.slice(
    page * limit,
    (page + 1) * limit
  );

  const hasActiveFilters =
    search || category || minPrice || maxPrice || availability || rating;

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setAvailability('');
    setRating('');
    setSort('default');
    setPage(0);
  };

  const removeFilter = (key: string) => {
    switch (key) {
      case 'search':
        setSearch('');
        break;

      case 'category':
        setCategory('');
        break;

      case 'minPrice':
        setMinPrice('');
        break;

      case 'maxPrice':
        setMaxPrice('');
        break;

      case 'availability':
        setAvailability('');
        break;

      case 'rating':
        setRating('');
        break;
    }

    setPage(0);
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 text-sm text-slate-700 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500';

  const selectClass =
    'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 text-sm text-slate-700 dark:text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500';

  return (
    <div className="space-y-7">

      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Collection
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Explore Books
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover, search, filter, and manage your book collection.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">
            {isLoading ? 'Loading...' : `${allBooks.length} Books`}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total Books
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {isLoading ? '—' : allBooks.length.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
            <Tag className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Categories
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {isLoading ? '—' : categories.length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
            <Filter className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Matching Books
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {isLoading ? '—' : filteredBooks.length.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6">

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Search & Filters
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Find exactly the books you're looking for
                </p>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search books by title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className={`${inputClass} pl-10 bg-slate-50 dark:bg-slate-700/40`}
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(0);
                }}
                className={selectClass}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Availability
              </label>

              <select
                value={availability}
                onChange={(e) => {
                  setAvailability(e.target.value);
                  setPage(0);
                }}
                className={selectClass}
              >
                <option value="">All Availability</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Rating
              </label>

              <select
                value={rating}
                onChange={(e) => {
                  setRating(e.target.value);
                  setPage(0);
                }}
                className={selectClass}
              >
                <option value="">Any Rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Minimum Price (£)
              </label>

              <input
                type="number"
                placeholder="Enter minimum price"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(0);
                }}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Maximum Price (£)
              </label>

              <input
                type="number"
                placeholder="Enter maximum price"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(0);
                }}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Sort Books
              </label>

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortOption);
                  setPage(0);
                }}
                className={selectClass}
              >
                <option value="default">Default Sorting</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: High to Low</option>
                <option value="title-asc">Title: A to Z</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Active filters:
                </span>

                {search && (
                  <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-medium px-3 py-1.5 rounded-full">
                    Search: {search}
                    <button onClick={() => removeFilter('search')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {category && (
                  <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-medium px-3 py-1.5 rounded-full">
                    {category}
                    <button onClick={() => removeFilter('category')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {availability && (
                  <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-medium px-3 py-1.5 rounded-full">
                    {availability === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                    <button onClick={() => removeFilter('availability')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {rating && (
                  <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-medium px-3 py-1.5 rounded-full">
                    {rating} Star{rating !== '1' ? 's' : ''}
                    <button onClick={() => removeFilter('rating')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {minPrice && (
                  <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-medium px-3 py-1.5 rounded-full">
                    Min £{minPrice}
                    <button onClick={() => removeFilter('minPrice')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {maxPrice && (
                  <span className="inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-medium px-3 py-1.5 rounded-full">
                    Max £{maxPrice}
                    <button onClick={() => removeFilter('maxPrice')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Book Collection
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Browse your available books and their details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Showing{' '}
              <strong className="text-slate-900 dark:text-white">
                {paginatedBooks.length}
              </strong>{' '}
              of{' '}
              <strong className="text-slate-900 dark:text-white">
                {filteredBooks.length}
              </strong>{' '}
              books
            </span>

            {sort !== 'default' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sorted
              </span>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 h-64 animate-pulse"
              />
            ))}
          </div>
        ) : paginatedBooks.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 sm:p-16 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-indigo-500" />
            </div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
              No books found
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              We couldn't find any books matching your current filters.
            </p>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginatedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Page{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {page + 1}
                  </strong>{' '}
                  of{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {totalPages}
                  </strong>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <button
                    onClick={() =>
                      setPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={page >= totalPages - 1}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

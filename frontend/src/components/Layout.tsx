
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  BookOpen,
  LayoutDashboard,
  Moon,
  Sun,
  Menu,
  X,
  ArrowUpRight,
  Activity,
  Layers3,
} from 'lucide-react';

import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';


const navItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Overview and insights',
  },
  {
    path: '/books',
    label: 'Books',
    icon: BookOpen,
    description: 'Manage collection',
  },
];

export default function Layout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isDashboard = location.pathname === '/';
  const pageTitle = isDashboard ? 'Dashboard' : 'Books Library';
  const pageDescription = isDashboard
    ? 'Your book collection at a glance'
    : 'Explore and manage your book collection';

  // Close mobile sidebar after navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72',
          'bg-slate-950 text-white flex flex-col',
          'border-r border-slate-800/80',
          'transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >

        {/* Brand */}
        <div className="h-[84px] px-6 flex items-center justify-between border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Book Tracker
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Price Monitoring
              </p>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-4 pt-7">
          <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'relative flex items-center gap-3 px-3.5 py-3 rounded-xl',
                    'transition-all duration-200 group',
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-950/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  )}
                >
                  <div
                    className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                      isActive
                        ? 'bg-white/15'
                        : 'bg-slate-800 group-hover:bg-slate-700'
                    )}
                  >
                    <Icon className="w-[19px] h-[19px]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">
                      {item.label}
                    </p>

                    <p
                      className={cn(
                        'text-[11px] mt-0.5',
                        isActive ? 'text-indigo-100' : 'text-slate-500'
                      )}
                    >
                      {item.description}
                    </p>
                  </div>

                  {isActive && (
                    <ArrowUpRight className="w-4 h-4 text-white/80" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Collection Info */}
        <div className="px-5 mt-9">
          <p className="px-2 mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Platform
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Layers3 className="w-4 h-4 text-indigo-400" />
              </div>

              <span className="text-sm font-semibold text-slate-200">
                Book Collection
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />

              <span className="text-xs text-slate-400">
                Price monitoring system
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-auto p-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-300">
                Book Tracker
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                FastAPI + React
              </p>
            </div>

            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen lg:ml-72 flex flex-col">

        {/* Header */}
        <header className="sticky top-0 z-20 h-[76px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-colors">
          <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

            {/* Page Title */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Open navigation menu"
                aria-expanded={sidebarOpen}
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {pageTitle}
                </h2>

                <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {pageDescription}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3 sm:gap-5">

              {/* Backend Status */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>

                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Backend Connected
                </span>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-105 transition-all duration-200"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle color theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 w-full max-w-[1800px] mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>

        {/* Main Footer */}
        <footer className="px-4 sm:px-8 py-4 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500">
            <p>Book Tracker · Price Monitoring Dashboard</p>
            <p>Powered by FastAPI & React</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { triggerScrape } from '../lib/api';
import { useQueryClient } from '@tanstack/react-query';

export default function ScrapeButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const queryClient = useQueryClient();

  const handleScrape = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await triggerScrape();
      setResult({
        type: 'success',
        message: `Successfully scraped ${data.scraped} books • ${data.inserted} new records added`,
      });
      // Refresh all book queries
      queryClient.invalidateQueries({ queryKey: ['books'] });
    } catch (err: any) {
      console.error(err);
      setResult({
        type: 'error',
        message:
          err?.response?.data?.detail ||
          err?.message ||
          'Scraping failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleScrape}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Scraping in progress...' : 'Scrape Now'}
      </button>

      {loading && (
        <p className="text-sm text-slate-500">
          This may take 1–2 minutes depending on the number of categories...
        </p>
      )}

      {result && (
        <div
          className={`flex items-start gap-2.5 text-sm px-4 py-3 rounded-lg ${
            result.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-100'
              : 'bg-red-50 text-red-800 border border-red-100'
          }`}
        >
          {result.type === 'success' ? (
            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          )}
          <span>{result.message}</span>
        </div>
      )}
    </div>
  );
}
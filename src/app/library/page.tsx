"use client";
import { useEffect, useState } from 'react';
import SignOutButton from '@/components/SignOutButton';

interface ContentItem {
  id: string;
  source_url: string;
  source_type: string;
  title: string;
  author: string | null;
  created_at: string;
}

export default function LibraryPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/library');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load');
        setItems(data.items || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Knowledge Library</h1>
        <SignOutButton className="text-gray-600 hover:bg-gray-100" />
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="text-gray-500">
          No content yet.{' '}
          <a href="/import/youtube" className="text-blue-600 underline">
            Import your first YouTube video
          </a>
          .
        </p>
      )}

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="border rounded p-4 hover:bg-gray-50 transition"
          >
            <a href={item.source_url} className="font-medium text-blue-700">
              {item.title}
            </a>
            <p className="text-sm text-gray-500">
              {item.source_type}
              {item.author ? ` • ${item.author}` : ''} •{' '}
              {new Date(item.created_at).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
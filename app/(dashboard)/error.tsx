'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="p-4 md:p-6">
      <div className="mb-8 space-y-4">
        <h1 className="font-semibold text-lg md:text-2xl">
          Database Setup Required
        </h1>
        <p>
          Create the <code className="bg-muted px-1 rounded">items</code> table in your PostgreSQL database:
        </p>
        <pre className="my-4 px-3 py-4 bg-black text-white rounded-lg max-w-2xl overflow-scroll flex text-wrap">
          <code>
            {`CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  website VARCHAR(255),
  image_url VARCHAR(255),
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`}
          </code>
        </pre>
        <p>Insert sample data for testing:</p>
        <pre className="my-4 px-3 py-4 bg-black text-white rounded-lg max-w-2xl overflow-scroll flex text-wrap">
          <code>
            {`INSERT INTO items (name, description, website) VALUES
  ('Sample Item 1', 'First sample item', 'https://example.com'),
  ('Sample Item 2', 'Second sample item', 'https://example.org');`}
          </code>
        </pre>
        <button
          onClick={() => reset()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}

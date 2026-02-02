'use client';

import { useEffect, useState } from 'react';

/**
 * Debug page to diagnose payment flow issues
 * Access at: /debug-payment?session_id=xxx&documentId=yyy
 */
export default function DebugPaymentPage() {
  const [debug, setDebug] = useState<any>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const documentId = urlParams.get('documentId');
    
    // Check localStorage
    const storedDocId = localStorage.getItem('current-document-id');
    const storedDoc = documentId ? localStorage.getItem(`document-${documentId}`) : null;
    const isPaid = documentId ? localStorage.getItem(`document-${documentId}-paid`) : null;

    setDebug({
      urlParams: {
        sessionId,
        documentId,
      },
      localStorage: {
        'current-document-id': storedDocId,
        [`document-${documentId}`]: storedDoc ? 'EXISTS' : 'MISSING',
        [`document-${documentId}-paid`]: isPaid,
      },
      env: {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_SKIP_PAYMENT: process.env.NEXT_PUBLIC_SKIP_PAYMENT,
      },
      browser: {
        url: window.location.href,
        origin: window.location.origin,
      },
    });
  }, []);

  if (!debug) {
    return <div className="p-8">Loading debug info...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
      <h1 className="text-2xl mb-6">🔍 Payment Flow Debug</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl mb-2 text-yellow-400">URL Parameters</h2>
          <pre className="bg-gray-900 p-4 rounded overflow-auto">
            {JSON.stringify(debug.urlParams, null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="text-xl mb-2 text-yellow-400">localStorage</h2>
          <pre className="bg-gray-900 p-4 rounded overflow-auto">
            {JSON.stringify(debug.localStorage, null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="text-xl mb-2 text-yellow-400">Environment</h2>
          <pre className="bg-gray-900 p-4 rounded overflow-auto">
            {JSON.stringify(debug.env, null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="text-xl mb-2 text-yellow-400">Browser Info</h2>
          <pre className="bg-gray-900 p-4 rounded overflow-auto">
            {JSON.stringify(debug.browser, null, 2)}
          </pre>
        </section>

        <section>
          <h2 className="text-xl mb-2 text-yellow-400">Quick Actions</h2>
          <div className="space-x-4">
            <button
              onClick={() => window.location.href = '/editor?' + new URLSearchParams(debug.urlParams).toString()}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Go to Editor
            </button>
            <button
              onClick={() => {
                console.log('All localStorage keys:', Object.keys(localStorage));
                alert('Check browser console for all localStorage keys');
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Log All localStorage
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

import React, { useState } from 'react';

const HomePage = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testDatabase = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);

    try {
      // Test connection
      const response = await fetch('http://localhost:3001/api/test/database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      setTestResult(result.message);
    } catch (err) {
      setError('Error testing database: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-900 p-4">
        <h1 className="text-2xl font-bold text-white">Study, Mate</h1>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Welcome to Study, Mate</h1>
          <p className="text-gray-400 mb-8">Your one-stop solution for buying and uploading study notes, finding tutors, and more.</p>
          <div className="space-y-4">
            <button
              onClick={testDatabase}
              className="block bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Test Database Connection
            </button>
            {loading && <p className="text-gray-400">Testing connection...</p>}
            {testResult && <p className="text-green-400">{testResult}</p>}
            {error && <p className="text-red-400">{error}</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
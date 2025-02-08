'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/Admin/Dashboard'); // Redirect to Dashboard on successful login
    } else {
      const data = await res.json();
      setError(data.message || 'Invalid email or password.');
    }

    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg border-2 border-black shadow-2xl w-96 space-y-6">
        <div className="flex items-center justify-center mb-6">
          <div className="text-3xl font-bold text-black ml-3">
            Admin Login
          </div>
        </div>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-black">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-black"
            disabled={isLoading}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-black">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-black"
            disabled={isLoading}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-black text-white text-lg font-medium rounded-md shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black transition duration-150 ease-in-out"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}


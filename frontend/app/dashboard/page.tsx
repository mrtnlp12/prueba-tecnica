'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:3001/api/v1';
  const router = useRouter();
  
  useEffect(() => {
    document.title = 'User Dashboard';
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }
        const response = await fetch(`${API_URL}/auth/verify`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'token': token },
        });

        if (response.status !== 200) {
          localStorage.removeItem('token');
          router.push('/auth/login');
          return;
        }

        fetchUsers();
      } catch {
        setError('An unexpected error occurred while verifying the token.');
        setLoading(false);
        return;
      }
    }
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/users`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          const { message } = await response.json();
          setError(message);
        }
      } catch {
        setError('An unexpected error occurred while fetching users.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [API_URL, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-4xl p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">User Dashboard</h1>

        {error && (
          <div className="mb-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {user.email}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
      <button
          onClick={handleLogout}
          className="text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none">
          Log out
        </button>
      </div>
    </div>
  );
}
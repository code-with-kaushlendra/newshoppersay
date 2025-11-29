import React, { useState, useMemo } from 'react';
import type { User } from '../types';
import { StarRating } from './StarRating';

interface AdminUsersProps {
  users: User[];
  onDelete: (userId: number) => void;
  onEdit: (user: User) => void;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ users, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Users ({users.length})</h2>
      <div className="mb-4">
        <label htmlFor="user-search" className="sr-only">Search by name or email</label>
        <input
          type="text"
          id="user-search"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm bg-gray-100 border border-transparent rounded-md py-2 px-4 text-sm placeholder-gray-500 focus:outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <caption className="sr-only">List of all registered users with actions to edit or delete.</caption>
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={user.avatar} alt={`${user.name}'s profile picture`} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">ID: {user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                  <div className="text-sm text-gray-500">{user.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.rating && (
                      <>
                        <StarRating rating={user.rating.average} size="sm" />
                        <span className="text-xs text-gray-400 ml-1.5">({user.rating.count})</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isAdmin ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Admin</span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">User</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => onEdit(user)} aria-label={`Edit user ${user.name}`} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => onDelete(user.id)} aria-label={`Delete user ${user.name}`} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {filteredUsers.length === 0 && <p className="text-center text-gray-500 py-8">No users found.</p>}
    </div>
  );
};

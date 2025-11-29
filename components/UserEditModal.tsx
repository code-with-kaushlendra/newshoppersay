import React, { useState, useEffect } from 'react';
import type { User } from '../types';

interface UserEditModalProps {
  user: User;
  onClose: () => void;
  onSave: (user: User) => void;
  showAdminControls?: boolean;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({ user, onClose, onSave, showAdminControls = false }) => {
  const [formData, setFormData] = useState<User>(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="edit-user-title" className="bg-white rounded-lg shadow-2xl w-full max-w-lg transform transition-all" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h2 id="edit-user-title" className="text-2xl font-bold text-gray-800">Edit User: {user.name}</h2>
              <button type="button" onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="tel" id="phone" name="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" id="address" name="address" value={formData.address || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
              </div>
              {showAdminControls && (
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input id="isAdmin" name="isAdmin" type="checkbox" checked={formData.isAdmin || false} onChange={handleChange} className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="isAdmin" className="font-medium text-gray-700">Admin Privileges</label>
                        <p className="text-gray-500">Grants this user access to the admin panel.</p>
                    </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4 rounded-b-lg">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};
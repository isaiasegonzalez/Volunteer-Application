'use client';
import React, { useState } from 'react';
import { Home, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const EditProfilePage = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newName, setNewName] = useState('');
  
  // This would come from your user context/state management
  const currentName = "John Doe";

  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your update logic here
    console.log('Updating name to:', newName);
  };

  const handleDeleteAccount = () => {
    // Add your delete account logic here
    console.log('Deleting account');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
          <Link 
            href="/dashboard" 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Home className="w-6 h-6 text-gray-600" />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <form onSubmit={handleUpdateName} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Name
              </label>
              <p className="text-gray-600 p-2 bg-gray-50 rounded-md">
                {currentName}
              </p>
            </div>

            <div>
              <label htmlFor="newName" className="block text-sm font-medium text-gray-700 mb-2">
                New Name
              </label>
              <input
                id="newName"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter new name"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-100 text-pink-600 py-2 px-4 rounded-md hover:bg-pink-200 transition-colors"
            >
              Update Name
            </button>
          </form>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Danger Zone</h2>
            
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-50 text-red-600 py-2 px-4 rounded-md hover:bg-red-100 transition-colors"
              >
                Delete Account
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start space-x-2 p-3 bg-red-50 rounded-md">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <p className="text-sm text-red-600">
                    This action cannot be undone. Your account and all associated data will be permanently deleted.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-100 text-gray-600 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
import React from 'react';

const PersonalSection = ({ profile, user, onChange }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
        Personal Information
      </h3>
      
      <div className="mb-4">
        <label 
          htmlFor="full_name" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Full Name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          value={profile.full_name}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      
      <div className="mb-4">
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={user?.email || ''}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 cursor-not-allowed dark:text-gray-300"
          disabled
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Email cannot be changed
        </p>
      </div>
      
      <div className="mb-4">
        <label 
          htmlFor="avatar_url" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Avatar URL
        </label>
        <input
          id="avatar_url"
          name="avatar_url"
          type="url"
          value={profile.avatar_url}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          URL to your profile image
        </p>
      </div>
    </div>
  );
};

export default PersonalSection;
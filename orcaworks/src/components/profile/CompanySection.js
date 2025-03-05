import React from 'react';

const CompanySection = ({ organization, onChange }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
        Company Information
      </h3>
      
      <div className="mb-4">
        <label 
          htmlFor="company_name" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Company Name
        </label>
        <input
          id="company_name"
          name="company_name"
          type="text"
          value={organization.company_name}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      
      <div className="mb-4">
        <label 
          htmlFor="nif" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          VAT Number
        </label>
        <input
          id="nif"
          name="nif"
          type="text"
          value={organization.nif}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
    </div>
  );
};

export default CompanySection;
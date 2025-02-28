import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';

const ProfilePage = ({ onClose }) => {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  
  const [profile, setProfile] = useState({
    full_name: '',
    avatar_url: ''
  });
  
  const [organization, setOrganization] = useState({
    company_name: '',
    nif: ''
  });
  
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await userService.getUserProfile(user.id);
        
        if (profileError) {
          setError('Failed to load profile information. Please try again.');
          setLoading(false);
          return;
        }
        
        setProfile({
          full_name: profileData.full_name || '',
          avatar_url: profileData.avatar_url || ''
        });
        
        // Fetch organization data if it exists
        const { data: orgData, error: orgError } = await userService.getUserOrganization(user.id);
        
        if (orgError) {
          setError('Failed to load organization information. Please try again.');
          setLoading(false);
          return;
        }
        
        // If organization exists, set the data
        if (orgData) {
          setOrganization({
            company_name: orgData.company_name || '',
            nif: orgData.nif || ''
          });
        } else {
          // Try to get company name and vat from user metadata
          const company_name = user.user_metadata?.company_name;
          const vat_number = user.user_metadata?.vat_number;
          
          if (company_name && vat_number) {
            setOrganization({
              company_name: company_name,
              nif: vat_number
            });
            
            // Auto-create the organization if it doesn't exist yet
            const { error: createOrgError } = await userService.createOrganization(
              company_name,
              vat_number,
              user.id
            );
            
            if (createOrgError) {
              console.error('Error auto-creating organization:', createOrgError);
            }
          }
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
        setError('An unexpected error occurred. Please try again later.');
      }
      
      setLoading(false);
    };
    
    loadProfile();
  }, [user]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleOrganizationChange = (e) => {
    const { name, value } = e.target;
    setOrganization(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    
    try {
      // Update profile
      const { error: profileError } = await userService.updateProfile(user.id, {
        full_name: profile.full_name,
        avatar_url: profile.avatar_url
      });
      
      if (profileError) {
        setError('Failed to update profile information. Please try again.');
        setSaving(false);
        return;
      }
      
      // Get current organization data
      const { data: orgData } = await userService.getUserOrganization(user.id);
      
      if (orgData) {
        // Update existing organization
        const { error: updateOrgError } = await userService.updateOrganization(orgData.id, {
          company_name: organization.company_name,
          nif: organization.nif
        });
        
        if (updateOrgError) {
          setError('Failed to update organization information. Please try again.');
          setSaving(false);
          return;
        }
      } else {
        // Create new organization if it doesn't exist
        const { error: createOrgError } = await userService.createOrganization(
          organization.company_name,
          organization.nif,
          user.id
        );
        
        if (createOrgError) {
          setError('Failed to create organization. Please try again.');
          setSaving(false);
          return;
        }
      }
      
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('An unexpected error occurred. Please try again later.');
    }
    
    setSaving(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Profile</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <>
          {error && (
            <div className="p-3 mb-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md">
              {error}
            </div>
          )}
          
          {message && (
            <div className="p-3 mb-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md">
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    onChange={handleProfileChange}
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
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    URL to your profile image
                  </p>
                </div>
              </div>
              
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
                    onChange={handleOrganizationChange}
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
                    onChange={handleOrganizationChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
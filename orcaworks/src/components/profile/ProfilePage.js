import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileForm from './ProfileForm';
import { useProfileData } from './hooks/useProfileData';
import { useOrgData } from './hooks/useOrgData';

const ProfilePage = ({ onClose }) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  
  // Custom hooks for data management
  const { 
    profile, 
    loading: profileLoading, 
    error: profileError, 
    updateProfileData, 
    saveProfile 
  } = useProfileData(user?.id);
  
  const { 
    organization, 
    loading: orgLoading, 
    error: orgError, 
    updateOrgData, 
    saveOrganization 
  } = useOrgData(user?.id, user?.user_metadata);
  
  // Combined loading and error states
  const isLoading = profileLoading || orgLoading;
  const error = profileError || orgError;
  
  // Form submission handler
  const handleSubmit = async () => {
    setSaving(true);
    setStatusMessage(null);
    
    // Save profile data
    const profileResult = await saveProfile();
    if (profileResult.error) {
      setStatusMessage(profileResult.error);
      setSaving(false);
      return;
    }
    
    // Save organization data
    const orgResult = await saveOrganization();
    if (orgResult.error) {
      setStatusMessage(orgResult.error);
      setSaving(false);
      return;
    }
    
    setStatusMessage('Profile updated successfully!');
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
      
      {isLoading ? (
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
          
          {statusMessage && (
            <div className="p-3 mb-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md">
              {statusMessage}
            </div>
          )}
          
          <ProfileForm
            user={user}
            profile={profile}
            organization={organization}
            onProfileChange={updateProfileData}
            onOrgChange={updateOrgData}
            onSubmit={handleSubmit}
            onCancel={onClose}
            saving={saving}
          />
        </>
      )}
    </div>
  );
};

export default ProfilePage;
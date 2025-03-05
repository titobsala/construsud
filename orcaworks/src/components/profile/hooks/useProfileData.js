import { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';

export const useProfileData = (userId) => {
  const [profile, setProfile] = useState({
    full_name: '',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const { data: profileData, error: profileError } = await userService.getUserProfile(userId);
        
        if (profileError) {
          setError('Failed to load profile information. Please try again.');
          setLoading(false);
          return;
        }
        
        setProfile({
          full_name: profileData.full_name || '',
          avatar_url: profileData.avatar_url || ''
        });
      } catch (err) {
        console.error('Error loading profile data:', err);
        setError('An unexpected error occurred while fetching profile data.');
      }
      
      setLoading(false);
    };
    
    fetchProfile();
  }, [userId]);

  const updateProfileData = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    if (!userId) return { error: 'User ID is required' };
    
    try {
      const { error: profileError } = await userService.updateProfile(userId, {
        full_name: profile.full_name,
        avatar_url: profile.avatar_url
      });
      
      if (profileError) {
        return { error: 'Failed to update profile information. Please try again.' };
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error updating profile:', err);
      return { error: 'An unexpected error occurred. Please try again later.' };
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfileData,
    saveProfile
  };
};
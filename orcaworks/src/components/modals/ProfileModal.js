import React from 'react';
import ProfilePage from '../profile/ProfilePage';

const ProfileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black opacity-25" onClick={onClose}></div>
        
        <div className="relative bg-white dark:bg-gray-800 w-full max-w-4xl rounded-lg shadow-lg z-10">
          <ProfilePage onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
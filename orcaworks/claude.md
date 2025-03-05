# React Component Modular Refactoring Prompt

## Overview

This document provides instructions for an LLM to refactor a large, monolithic React component into a more modular structure. This specific example focuses on refactoring a `ProfilePage` component, but the pattern can be applied to any large component.

## Current Issue

The current `ProfilePage` component has several issues:
- It's too large, handling multiple concerns
- It mixes data fetching, state management, UI rendering, and business logic
- It's difficult to maintain and test
- It doesn't follow separation of concerns principles

## Goal

Refactor the component into a modular structure that:
- Separates concerns (data fetching, UI, state management)
- Increases maintainability and testability
- Improves code organization
- Follows React best practices

## Target Folder Structure

```
/profile
  index.js              // Main export
  ProfilePage.jsx       // Container component
  ProfileForm.jsx       // Form wrapper
  PersonalSection.jsx   // Personal info section
  CompanySection.jsx    // Company info section
  hooks/
    useProfileData.js   // Custom hook for profile data
    useOrgData.js       // Custom hook for organization data
```

## Component Responsibilities

### index.js
Simple re-export of the main component:
```javascript
export { default } from './ProfilePage';
```

### useProfileData.js
Custom hook to handle profile data fetching and updating:
- Fetch profile data from API
- Manage loading and error states
- Provide methods to update and save profile data
- Return profile data and related functions

### useOrgData.js
Custom hook to handle organization data:
- Fetch organization data
- Handle creation or update of organization
- Manage loading and error states
- Provide methods to update and save organization data

### PersonalSection.jsx
UI component for rendering personal information:
- Display personal data form fields
- Pass changes up to parent component
- Handle validation and input formatting

### CompanySection.jsx
UI component for rendering company information:
- Display company data form fields
- Pass changes up to parent component
- Handle validation and input formatting

### ProfileForm.jsx
Container for form sections:
- Compose PersonalSection and CompanySection
- Handle form submission
- Provide form actions (submit, cancel)

### ProfilePage.jsx
Main container component:
- Use custom hooks for data management
- Manage overall component state
- Handle errors and loading states
- Coordinate data saving operations

## Refactoring Process

1. Create the folder structure
2. Extract custom hooks for data fetching and management
3. Extract UI components for form sections
4. Create a form container component
5. Refactor the main component to use the new structure
6. Update imports and ensure everything works

## Implementation Guidelines

### For Custom Hooks:
- Extract API-related logic into the appropriate hook
- Implement proper loading and error handling
- Create functions for updating and saving data
- Return only necessary data and functions

### For UI Components:
- Accept props for data and callbacks
- Keep internal state to a minimum
- Focus on rendering and user interaction
- Follow a consistent props pattern

### For Container Components:
- Use custom hooks for data management
- Handle coordination between components
- Manage application state
- Handle error and loading states

## Example Usage

When the refactoring is complete, the main component should look significantly simpler:

```jsx
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
    // Handle saving data...
  };
  
  return (
    <div className="container">
      <h2>Your Profile</h2>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {error && <ErrorMessage message={error} />}
          {statusMessage && <StatusMessage message={statusMessage} />}
          
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
```

## Testing Considerations

After refactoring, ensure:
1. All functionality works as before
2. Components render correctly
3. Data is fetched and displayed properly
4. Updates are saved correctly
5. Error handling works as expected

## Benefits

This modular approach provides:
- Better separation of concerns
- Increased maintainability
- Improved testability
- Enhanced reusability
- More scalable code organization
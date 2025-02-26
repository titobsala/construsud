import React, { useState } from 'react';
import Header from './components/layout/Header';
import ProjectSidebar from './components/layout/ProjectSidebar';
import Tabs from './components/layout/Tabs';
import ChapterList from './components/budget/ChapterList';
import InternalControl from './components/budget/InternalControl';
import EditItemModal from './components/modals/EditItemModal';
import NewChapterModal from './components/modals/NewChapterModal';
import NewProjectModal from './components/modals/NewProjectModal';
import AuthForm from './components/auth/AuthForm';
import { useBudget } from './context/BudgetContext';
import { useAuth } from './context/AuthContext';

function App() {
  const { 
    showEditItemModal, 
    showNewChapterModal,
    addProject,
    setActiveProjectById,
    loading: budgetLoading
  } = useBudget();
  
  const { user, loading: authLoading, signOut } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  
  const handleNewProject = async (projectData) => {
    console.log('New project data:', projectData);
    const newProjectId = await addProject(projectData);
    if (newProjectId) {
      await setActiveProjectById(newProjectId);
      // Only close the modal if the project was successfully created
      setShowNewProjectModal(false);
    } else {
      // If there was an error, we keep the modal open so the user can try again
      console.error('Failed to create project');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };
  
  // Show loading indicator while authentication state is being determined
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If no user is authenticated, show the auth form
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        onSignOut={handleSignOut}
        userEmail={user.email}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <ProjectSidebar 
          isOpen={sidebarOpen} 
          onNewProject={() => setShowNewProjectModal(true)}
        />
        
        <div className="flex-1 flex flex-col">
          <Tabs />
          
          {budgetLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-gray-700 dark:text-gray-300">Loading project data...</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col md:flex-row overflow-auto">
              <div className="w-full md:w-3/5 overflow-auto p-6">
                <ChapterList />
              </div>
              
              <div className="w-full md:w-2/5 overflow-auto p-6 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
                <InternalControl />
              </div>
            </div>
          )}
        </div>
      </div>

      {showEditItemModal && <EditItemModal />}
      {showNewChapterModal && <NewChapterModal />}
      <NewProjectModal 
        isOpen={showNewProjectModal} 
        onClose={() => setShowNewProjectModal(false)}
        onSave={handleNewProject}
      />
    </div>
  );
}

export default App;
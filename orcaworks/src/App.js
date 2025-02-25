import React, { useState } from 'react';
import Header from './components/layout/Header';
import ProjectSidebar from './components/layout/ProjectSidebar';
import Tabs from './components/layout/Tabs';
import ChapterList from './components/budget/ChapterList';
import InternalControl from './components/budget/InternalControl';
import EditItemModal from './components/modals/EditItemModal';
import NewChapterModal from './components/modals/NewChapterModal';
import NewProjectModal from './components/modals/NewProjectModal';
import { useBudget } from './context/BudgetContext';

function App() {
  const { 
    showEditItemModal, 
    showNewChapterModal,
    addProject,
    setActiveProjectById
  } = useBudget();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  
  const handleNewProject = (projectData) => {
    console.log('New project data:', projectData);
    const newProjectId = addProject(projectData);
    setActiveProjectById(newProjectId);
    setShowNewProjectModal(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        <ProjectSidebar 
          isOpen={sidebarOpen} 
          onNewProject={() => setShowNewProjectModal(true)}
        />
        
        <div className="flex-1 flex flex-col">
          <Tabs />
          
          <div className="flex-1 flex flex-col md:flex-row overflow-auto">
            <div className="w-full md:w-3/5 overflow-auto p-6">
              <ChapterList />
            </div>
            
            <div className="w-full md:w-2/5 overflow-auto p-6 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
              <InternalControl />
            </div>
          </div>
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
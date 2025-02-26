import React, { useState } from 'react';
import { useBudget } from '../../context/BudgetContext';

const ProjectSidebar = ({ isOpen, onNewProject }) => {
  const { budget, setActiveChapter, projects, setActiveProjectById } = useBudget();
  
  const [activeSection, setActiveSection] = useState('projects');
  const [activeView, setActiveView] = useState('project');
  const [expandedProjects, setExpandedProjects] = useState({
    'PROJ-001': true,
  });
  
  const toggleExpandProject = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
    
    // Set as active project
    setActiveProjectById(projectId);
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <aside 
      className={`${isOpen ? 'w-64' : 'w-0'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 ease-in-out overflow-hidden flex flex-col`}
    >

      
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
        <button 
          onClick={() => handleSectionClick('projects')}
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
            activeSection === 'projects' 
              ? 'text-red-600 dark:text-red-400 border-b-2 border-red-500 dark:border-red-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Orçamentos
        </button>
        <button 
          onClick={() => handleSectionClick('execution')}
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
            activeSection === 'execution' 
              ? 'text-red-600 dark:text-red-400 border-b-2 border-red-500 dark:border-red-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Execução
        </button>
        <button 
          onClick={() => handleSectionClick('financial')}
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
            activeSection === 'financial' 
              ? 'text-red-600 dark:text-red-400 border-b-2 border-red-500 dark:border-red-400' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Financeiro
        </button>
      </div>
      
      {/* View Mode Selector (only for execution and financial) */}
      {(activeSection === 'execution' || activeSection === 'financial') && (
        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700/30 flex space-x-1 text-xs">
          <button
            onClick={() => handleViewChange('project')}
            className={`flex-1 py-1.5 px-2 rounded-md ${
              activeView === 'project'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Por Projeto
          </button>
          <button
            onClick={() => handleViewChange('global')}
            className={`flex-1 py-1.5 px-2 rounded-md ${
              activeView === 'global'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Visão Global
          </button>
        </div>
      )}
      
      <div className="overflow-y-auto flex-1">
        {/* Projects Section */}
        {activeSection === 'projects' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">PROJETOS</h3>
              <button 
                onClick={onNewProject}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-xs font-medium"
              >
                Novo Projeto
              </button>
            </div>
            
            {projects.length > 0 ? (
              projects.map(project => (
                <div key={project.id} className="space-y-1">
                  <div 
                    className={`rounded-lg p-3 cursor-pointer transition-all duration-150 flex items-center justify-between ${
                      project.active 
                        ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent'
                    }`}
                    onClick={() => toggleExpandProject(project.id)}
                  >
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">{project.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{project.client}</div>
                    </div>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${expandedProjects[project.id] ? 'transform rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {expandedProjects[project.id] && (
                    <div className="pl-6 py-1 space-y-2">
                      <button 
                        className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700 font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        <span>Dashboard</span>
                      </button>
                      
                      <button 
                        className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>Orçamento</span>
                      </button>
                      
                      <button 
                        className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                        </svg>
                        <span>Dados Técnicos</span>
                      </button>
                      
                      <button 
                        className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                        </svg>
                        <span>Relatórios</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Nenhum projeto encontrado
                </p>
                <button 
                  onClick={onNewProject}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium"
                >
                  + Criar Novo Projeto
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Execution Section */}
        {activeSection === 'execution' && (
          <div className="p-4 space-y-4">
            {activeView === 'project' ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">PROJETOS</h3>
                </div>
                
                {projects.map(project => (
                  <div 
                    key={project.id}
                    className={`rounded-lg p-3 cursor-pointer transition-all duration-150 ${
                      project.active 
                        ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="font-medium text-gray-800 dark:text-gray-200">{project.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{project.client}</div>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">EXECUÇÃO</h3>
                  </div>
                  
                  <button className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>Cronograma</span>
                  </button>
                  
                  <button className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <span>Despesas Reais</span>
                  </button>
                  
                  <button className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    <span>Progresso</span>
                  </button>
                </div>
              </>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">VISÃO GLOBAL</h3>
                </div>
                
                <button className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700 font-medium mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Dashboard</span>
                </button>
                
                <button className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Cronograma Global</span>
                </button>
                
                <button className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  <span>Fluxo de Caixa</span>
                </button>
                
                <button className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                  <span>Análise de Desempenho</span>
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Financial Section */}
        {activeSection === 'financial' && (
          <div className="p-4 space-y-4">
            {activeView === 'project' ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">PROJETOS</h3>
                </div>
                
                {projects.map(project => (
                  <div 
                    key={project.id}
                    className={`rounded-lg p-3 cursor-pointer transition-all duration-150 ${
                      project.active 
                        ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="font-medium text-gray-800 dark:text-gray-200">{project.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{project.client}</div>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">FINANCEIRO</h3>
                  </div>
                  
                  <button className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <span>Faturas</span>
                  </button>
                  
                  <button className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    <span>Comparativo Orçado x Real</span>
                  </button>
                  
                  <button className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Projeção Financeira</span>
                  </button>
                </div>
              </>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">VISÃO GLOBAL</h3>
                </div>
                
                <button className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700 font-medium mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Dashboard Financeiro</span>
                </button>
                
                <button className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <span>Todas as Faturas</span>
                </button>
                
                <button className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                  <span>Resumo Financeiro</span>
                </button>
                
                <button className="w-full py-2 px-3 flex items-center space-x-3 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Relatórios Financeiros</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default ProjectSidebar;
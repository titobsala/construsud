import React, { useState } from 'react';
import { useBudget } from '../../context/BudgetContext';

const Header = ({ toggleSidebar, onSignOut, userEmail, onProfileClick, companyName }) => {
  const { budget, formatCurrency } = useBudget();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const sellValue = budget.CONTROLE_INTERNO?.VENDA?.items[0]?.Venda_Euro || 0;

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-red-600 dark:text-red-400">{companyName}</h1>
      </div>
      
      <div className="text-center flex-1">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          {budget.project?.name || 'No Project Selected'}
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Valor:</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(sellValue)}</span>
        </div>
        <button className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out shadow-sm">
          Salvar
        </button>
        <button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out shadow-sm">
          Exportar
        </button>
        
        {/* User menu */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 focus:outline-none"
          >
            <span className="mr-2">{userEmail}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onProfileClick();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Profile Settings
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onSignOut();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
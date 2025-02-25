import React from 'react';
import { useBudget } from '../../context/BudgetContext';

const Header = ({ toggleSidebar }) => {
  const { budget, formatCurrency } = useBudget();
  const sellValue = budget.CONTROLE_INTERNO.VENDA.items[0].Venda_Euro;

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">OrçaWorks</h1>
      </div>
      
      <div className="text-center flex-1">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          {budget.project.name}
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Valor:</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{formatCurrency(sellValue)}</span>
        </div>
        <button className="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out shadow-sm">
          Salvar
        </button>
        <button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out shadow-sm">
          Exportar
        </button>
      </div>
    </header>
  );
};

export default Header;
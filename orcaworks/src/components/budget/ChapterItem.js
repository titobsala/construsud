import React from 'react';
import { useBudget } from '../../context/BudgetContext';
import ItemList from './ItemList';

const ChapterItem = ({ chapterKey, chapter }) => {
  const { 
    activeChapter, 
    setActiveChapter, 
    calculateChapterTotal,
    formatCurrency,
    setShowEditItemModal,
    setCurrentItem
  } = useBudget();
  
  const isActive = activeChapter === chapterKey;
  const total = calculateChapterTotal(chapterKey);
  
  const handleAddItem = () => {
    setCurrentItem({
      chapterKey,
      item: {
        ITEM: '',
        UNIDADE: '',
        QTD: 0,
        VALOR_UNITARIO: 0,
        VALOR: 0
      },
      isNew: true
    });
    setShowEditItemModal(true);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 transition-all duration-200 hover:shadow-md">
      <div 
        className={`flex justify-between items-center py-4 px-5 cursor-pointer ${
          isActive 
            ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400' 
            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 border-l-4 border-transparent'
        }`}
        onClick={() => setActiveChapter(chapterKey)}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isActive ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
            {chapterKey}
          </div>
          <h3 className="font-medium text-gray-800 dark:text-gray-200">{chapter.header}</h3>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`font-medium ${isActive ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
            {formatCurrency(total)}
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 text-gray-400 transition-transform ${isActive ? 'transform rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isActive && (
        <div className="bg-white dark:bg-gray-800 p-5 border-t border-gray-100 dark:border-gray-700">
          <ItemList 
            chapterKey={chapterKey} 
            items={chapter.items} 
          />
          
          <button
            className="mt-4 w-full py-3 px-4 border border-dashed border-red-300 dark:border-red-600 rounded-lg text-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer flex items-center justify-center space-x-1"
            onClick={handleAddItem}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Adicionar Item</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChapterItem;
import React from 'react';
import { useBudget } from '../../context/BudgetContext';
import ChapterItem from './ChapterItem';
import Summary from './Summary';

const ChapterList = () => {
  const { budget, setShowNewChapterModal, activeProject } = useBudget();
  const chapterEntries = Object.entries(budget.chapters || {});
  const hasChapters = chapterEntries.length > 0;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 px-5 py-4 rounded-xl mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Capítulos do Orçamento</h2>
        <button 
          className="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out shadow-sm flex items-center space-x-1"
          onClick={() => setShowNewChapterModal(true)}
          disabled={!activeProject}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Novo Capítulo</span>
        </button>
      </div>

      <div className="space-y-6 flex-grow overflow-auto mb-6">
        {hasChapters ? (
          chapterEntries.map(([key, chapter]) => (
            <ChapterItem key={key} chapterKey={key} chapter={chapter} />
          ))
        ) : (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
            {activeProject ? (
              <>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nenhum capítulo encontrado
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Comece adicionando um novo capítulo ao seu orçamento.
                </p>
                <button 
                  className="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out shadow-sm inline-flex items-center space-x-1"
                  onClick={() => setShowNewChapterModal(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Adicionar Capítulo</span>
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nenhum projeto selecionado
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Selecione um projeto existente ou crie um novo projeto para começar.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <Summary />
    </div>
  );
};

export default ChapterList;
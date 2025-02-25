import React from 'react';
import ItemRow from './ItemRow';

const ItemList = ({ chapterKey, items }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p>Nenhum item adicionado neste capítulo.</p>
        <p className="text-sm mt-1">Adicione itens para começar o orçamento.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <th className="px-4 py-3">Material</th>
            <th className="px-4 py-3">Un</th>
            <th className="px-4 py-3">Qtd</th>
            <th className="px-4 py-3">V.Unit</th>
            <th className="px-4 py-3 text-right">Valor</th>
            <th className="px-4 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
          {items.map((item) => (
            <ItemRow 
              key={item.id} 
              chapterKey={chapterKey} 
              item={item} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;
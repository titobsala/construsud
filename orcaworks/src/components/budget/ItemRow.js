import React from 'react';
import { useBudget } from '../../context/BudgetContext';

const ItemRow = ({ chapterKey, item }) => {
  const { setCurrentItem, setShowEditItemModal, formatCurrency } = useBudget();
  
  const handleEdit = () => {
    setCurrentItem({
      chapterKey,
      item,
      isNew: false
    });
    setShowEditItemModal(true);
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 font-medium">{item.MATERIAL}</td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{item.UNIDADE}</td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        {typeof item.QTD === 'number' 
          ? item.QTD.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
          : item.QTD
        }
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        {typeof item.VALOR_UNITARIO === 'number' 
          ? item.VALOR_UNITARIO.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
          : item.VALOR_UNITARIO
        }
      </td>
      <td className="px-4 py-3 text-sm text-right font-medium text-gray-800 dark:text-gray-200">
        {formatCurrency(item.VALOR)}
      </td>
      <td className="px-4 py-3 text-right">
        <button 
          className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          onClick={handleEdit}
          aria-label="Editar item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default ItemRow;
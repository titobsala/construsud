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

  const hasInternalControl = item.internal_control && (
    item.internal_control.real_cost || 
    item.internal_control.supplier || 
    item.internal_control.item_margin ||
    item.internal_control.notes
  );

  const getStatusColor = () => {
    if (!hasInternalControl || !item.internal_control.real_cost) return null;
    
    const realCost = parseFloat(item.internal_control.real_cost);
    if (isNaN(realCost)) return null;
    
    if (item.VALOR > realCost) return "text-green-600 dark:text-green-400";
    if (item.VALOR < realCost) return "text-red-600 dark:text-red-400";
    return null;
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 font-medium">
        <div className="flex items-center">
          {item.ITEM}
          {hasInternalControl && (
            <span 
              className={`ml-2 ${getStatusColor() || "text-blue-600 dark:text-blue-400"}`}
              title="Possui controle interno"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
      </td>
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
      <td className={`px-4 py-3 text-sm text-right font-medium ${getStatusColor() || "text-gray-800 dark:text-gray-200"}`}>
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
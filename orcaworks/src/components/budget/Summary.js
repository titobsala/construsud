import React from 'react';
import { useBudget } from '../../context/BudgetContext';

const Summary = () => {
  const { 
    calculateTotalMaterialCost,
    formatCurrency
  } = useBudget();
  
  const totalMaterialCost = calculateTotalMaterialCost();

  return (
    <div className="mt-6 p-6 bg-gray-100 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">Total de Custos Materiais:</span>
        <span className="text-gray-900 font-bold text-lg">
          {formatCurrency(totalMaterialCost)}
        </span>
      </div>
    </div>
  );
};

export default Summary;
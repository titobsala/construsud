import React from 'react';
import { useBudget } from '../../context/BudgetContext';
import ControlSection from './ControlSection';

const InternalControl = () => {
  const { 
    budget, 
    updateMarginPercentage,
    updateDiverseCosts,
    formatCurrency 
  } = useBudget();
  
  const { CONTROLE_INTERNO } = budget;
  
  const handleMarginChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      updateMarginPercentage(value);
    }
  };
  
  const handleDiverseCostChange = (type, e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      const diverseCosts = { ...CONTROLE_INTERNO.DIVERSOS.items[0] };
      diverseCosts[type] = value;
      updateDiverseCosts(diverseCosts);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white dark:bg-gray-800 px-5 py-4 rounded-xl mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Controle Interno (Uso Exclusivo)
        </h2>
      </div>
      
      <div className="space-y-6 flex-grow overflow-auto">
        {/* VENDA Section */}
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 dark:border-indigo-400 py-3 px-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">VENDA</h3>
          </div>
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Custo Seco:</span>
                <p className="font-medium text-lg text-gray-800 dark:text-gray-200">
                  {formatCurrency(CONTROLE_INTERNO.VENDA.items[0].Custo_Seco_Euro)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Custo Total:</span>
                <p className="font-medium text-lg text-gray-800 dark:text-gray-200">
                  {formatCurrency(CONTROLE_INTERNO.VENDA.items[0].Custo_Total_Euro)}
                </p>
              </div>
            </div>
            
            <div className="border-t border-b border-gray-100 dark:border-gray-700 py-4">
              <div className="flex items-end">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Margem (%):</span>
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      value={CONTROLE_INTERNO.VENDA.items[0].Margem_Percentual} 
                      onChange={handleMarginChange}
                      className="w-24 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-700 dark:text-gray-200"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                    <span className="ml-2 text-gray-600 dark:text-gray-400">%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Venda:</span>
                <p className="font-medium text-lg text-gray-800 dark:text-gray-200">
                  {formatCurrency(CONTROLE_INTERNO.VENDA.items[0].Venda_Euro)}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500 dark:border-green-400">
                <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Margem (€):</span>
                <p className="font-medium text-lg text-green-600 dark:text-green-400">
                  {formatCurrency(CONTROLE_INTERNO.VENDA.items[0].Margem_Euro)}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* DIVERSOS Section */}
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
          <div className="bg-gray-50 dark:bg-gray-700 py-3 px-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">DIVERSOS</h3>
          </div>
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Alimentação (€):</label>
                <input 
                  type="number" 
                  value={CONTROLE_INTERNO.DIVERSOS.items[0].Alimentacao_Euro} 
                  onChange={(e) => handleDiverseCostChange('Alimentacao_Euro', e)}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-700 dark:text-gray-200"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Passagens (€):</label>
                <input 
                  type="number" 
                  value={CONTROLE_INTERNO.DIVERSOS.items[0].Passagens_Euro} 
                  onChange={(e) => handleDiverseCostChange('Passagens_Euro', e)}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-700 dark:text-gray-200"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Outros (€):</label>
              <input 
                type="number" 
                value={CONTROLE_INTERNO.DIVERSOS.items[0].Outros_Euro} 
                onChange={(e) => handleDiverseCostChange('Outros_Euro', e)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-700 dark:text-gray-200"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
        
        {/* SUB-EMPREITEIROS Section */}
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
          <div className="bg-gray-50 dark:bg-gray-700 py-3 px-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">SUB-EMPREITEIROS</h3>
          </div>
          <div className="p-5">
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Fornecedor 1
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Fornecedor 2
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Fornecedor 3
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        defaultValue="0.00" 
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-700 dark:text-gray-200"
                        min="0"
                        step="0.01"
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        defaultValue="0.00" 
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-700 dark:text-gray-200"
                        min="0"
                        step="0.01"
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        defaultValue="0.00" 
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-700 dark:text-gray-200"
                        min="0"
                        step="0.01"
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">0,00 €</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* AMORTIZACOES Section */}
        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
          <div className="bg-gray-50 dark:bg-gray-700 py-3 px-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">AMORTIZAÇÕES</h3>
          </div>
          <div className="p-5">
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      E/O/A
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Duração (h)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total (€)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Material</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">-</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">-</td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        defaultValue="0.00" 
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-700 dark:text-gray-200"
                        min="0"
                        step="0.01"
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Mão de Obra</td>
                    <td className="px-4 py-3">
                      <select className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-700 dark:text-gray-200">
                        <option value="E">E</option>
                        <option value="O">O</option>
                        <option value="A">A</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        defaultValue="24.00" 
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-700 dark:text-gray-200"
                        min="0"
                        step="0.5"
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        defaultValue="0.00" 
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 dark:bg-gray-700 dark:text-gray-200"
                        min="0"
                        step="0.01"
                        readOnly
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalControl;
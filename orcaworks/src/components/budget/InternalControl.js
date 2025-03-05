import React, { useState } from 'react';
import { useBudget } from '../../context/BudgetContext';

// Navigable Index Component
const NavigableIndex = ({ chapters, onSelect, selectedItem }) => {
  const [expandedChapters, setExpandedChapters] = useState({});

  const toggleChapter = (chapterKey) => {
    setExpandedChapters({
      ...expandedChapters,
      [chapterKey]: !expandedChapters[chapterKey]
    });
  };

  return (
    <div className="w-full md:w-64 border-r border-gray-200 dark:border-gray-700 overflow-y-auto mr-4">
      <ul className="space-y-1">
        <li>
          <button 
            onClick={() => onSelect({ type: 'overview' })}
            className={`w-full px-4 py-2 text-left rounded-md transition-colors ${
              selectedItem?.type === 'overview' 
                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-medium' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Visão Geral do Projeto
            </div>
          </button>
        </li>

        {Object.keys(chapters).map((chapterKey) => (
          <li key={chapterKey}>
            <div className="space-y-1">
              <button 
                onClick={() => toggleChapter(chapterKey)}
                className={`w-full px-4 py-2 text-left rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
                      <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                    </svg>
                    {chapterKey}
                  </div>
                  <span>
                    {expandedChapters[chapterKey] ? '▼' : '►'}
                  </span>
                </div>
              </button>

              {expandedChapters[chapterKey] && (
                <ul className="pl-8 space-y-1">
                  {chapters[chapterKey].items.map((item, index) => (
                    <li key={`${chapterKey}-item-${index}`}>
                      <button 
                        onClick={() => onSelect({ type: 'item', chapterKey, itemIndex: index })}
                        className={`w-full px-3 py-1.5 text-left rounded text-sm transition-colors ${
                          selectedItem?.type === 'item' && 
                          selectedItem?.chapterKey === chapterKey && 
                          selectedItem?.itemIndex === index
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {item.ITEM}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Item-specific internal control component
const ItemInternalControl = ({ chapterKey, item, onUpdate, formatCurrency }) => {
  const [formData, setFormData] = useState({
    real_cost: item.internal_control?.real_cost || '',
    supplier: item.internal_control?.supplier || '',
    item_margin: item.internal_control?.item_margin || '',
    notes: item.internal_control?.notes || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onUpdate(chapterKey, item.id, {
      ...item,
      internal_control: formData
    });
  };

  return (
    <div className="space-y-6 flex-1">
      <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {chapterKey} - {item.ITEM}
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {item.UNIDADE} | Qtd: {item.QTD} | Valor: {formatCurrency(item.VALOR)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Custo Real (€)
            </label>
            <input
              type="number"
              name="real_cost"
              value={formData.real_cost}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Margem do Item (%)
            </label>
            <input
              type="number"
              name="item_margin"
              value={formData.item_margin}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
              step="0.01"
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fornecedor
          </label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Observações
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Salvar Alterações
          </button>
        </div>
      </div>

      {/* Item financial summary */}
      <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Resumo Financeiro do Item
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
            <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Valor Orçado:</span>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {formatCurrency(item.VALOR)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
            <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Custo Real:</span>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {formData.real_cost ? formatCurrency(parseFloat(formData.real_cost)) : '-'}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${
            formData.real_cost && item.VALOR > parseFloat(formData.real_cost)
              ? 'bg-green-50 dark:bg-green-900/20'
              : formData.real_cost && item.VALOR < parseFloat(formData.real_cost)
                ? 'bg-red-50 dark:bg-red-900/20'
                : 'bg-gray-50 dark:bg-gray-700/30'
          }`}>
            <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Diferença:</span>
            <p className={`font-medium ${
              formData.real_cost && item.VALOR > parseFloat(formData.real_cost)
                ? 'text-green-600 dark:text-green-400'
                : formData.real_cost && item.VALOR < parseFloat(formData.real_cost)
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-800 dark:text-gray-200'
            }`}>
              {formData.real_cost 
                ? formatCurrency(item.VALOR - parseFloat(formData.real_cost))
                : '-'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Internal Control component
const InternalControl = () => {
  const { 
    budget, 
    updateMarginPercentage,
    updateDiverseCosts,
    formatCurrency,
    updateItem 
  } = useBudget();
  
  const { CONTROLE_INTERNO, chapters } = budget;
  const [selectedItem, setSelectedItem] = useState({ type: 'overview' });
  
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

  const handleInternalControlUpdate = (chapterKey, itemId, updatedItem) => {
    updateItem(chapterKey, itemId, updatedItem);
  };

  const renderProjectOverview = () => (
    <div className="space-y-6 flex-grow overflow-auto">
      {/* VENDA Section */}
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 py-3 px-5">
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
                    className="w-24 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
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
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
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
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
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
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
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
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
                      min="0"
                      step="0.01"
                      readOnly
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="number" 
                      defaultValue="0.00" 
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
                      min="0"
                      step="0.01"
                      readOnly
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="number" 
                      defaultValue="0.00" 
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
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
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Item</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">-</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">-</td>
                  <td className="px-4 py-3">
                    <input 
                      type="number" 
                      defaultValue="0.00" 
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
                      min="0"
                      step="0.01"
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Mão de Obra</td>
                  <td className="px-4 py-3">
                    <select className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200">
                      <option value="E">E</option>
                      <option value="O">O</option>
                      <option value="A">A</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="number" 
                      defaultValue="24.00" 
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
                      min="0"
                      step="0.5"
                      readOnly
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="number" 
                      defaultValue="0.00" 
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
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
  );

  const renderItemControl = () => {
    if (selectedItem.type !== 'item') return null;
    
    const item = budget.chapters[selectedItem.chapterKey].items[selectedItem.itemIndex];
    return (
      <ItemInternalControl 
        chapterKey={selectedItem.chapterKey}
        item={item}
        onUpdate={handleInternalControlUpdate}
        formatCurrency={formatCurrency}
      />
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white dark:bg-gray-800 px-5 py-4 rounded-xl mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Controle Interno (Uso Exclusivo)
        </h2>
      </div>
      
      <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        <NavigableIndex 
          chapters={chapters} 
          onSelect={setSelectedItem} 
          selectedItem={selectedItem} 
        />
        
        <div className="flex-1 overflow-auto">
          {selectedItem.type === 'overview' ? renderProjectOverview() : renderItemControl()}
        </div>
      </div>
    </div>
  );
};

export default InternalControl;
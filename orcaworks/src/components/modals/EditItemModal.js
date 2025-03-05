import React, { useState, useEffect } from 'react';
import { useBudget } from '../../context/BudgetContext';

const EditItemModal = () => {
  const { 
    currentItem, 
    setShowEditItemModal, 
    addItem, 
    updateItem, 
    deleteItem,
    formatCurrency
  } = useBudget();
  
  const [formData, setFormData] = useState({
    ITEM: '',
    UNIDADE: '',
    QTD: 0,
    VALOR_UNITARIO: 0,
    VALOR: 0,
    internal_control: {
      real_cost: '',
      supplier: '',
      item_margin: '',
      notes: ''
    }
  });
  
  const [activeTab, setActiveTab] = useState('general');
  
  useEffect(() => {
    if (currentItem && currentItem.item) {
      setFormData({
        ...currentItem.item,
        internal_control: currentItem.item.internal_control || {
          real_cost: '',
          supplier: '',
          item_margin: '',
          notes: ''
        }
      });
    }
  }, [currentItem]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = name === 'QTD' || name === 'VALOR_UNITARIO' ? parseFloat(value) : value;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: numValue };
      
      // Calculate total value if QTD or VALOR_UNITARIO changes
      if (name === 'QTD' || name === 'VALOR_UNITARIO') {
        const qty = name === 'QTD' ? numValue : prev.QTD;
        const unitPrice = name === 'VALOR_UNITARIO' ? numValue : prev.VALOR_UNITARIO;
        newData.VALOR = parseFloat((qty * unitPrice).toFixed(2));
      }
      
      return newData;
    });
  };
  
  const handleInternalControlChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      internal_control: {
        ...prev.internal_control,
        [name]: value
      }
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.ITEM || !formData.UNIDADE) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    
    if (currentItem.isNew) {
      addItem(currentItem.chapterKey, formData);
    } else {
      updateItem(currentItem.chapterKey, currentItem.item.id, formData);
    }
    
    setShowEditItemModal(false);
  };
  
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      deleteItem(currentItem.chapterKey, currentItem.item.id);
      setShowEditItemModal(false);
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-3xl">
        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {currentItem?.isNew ? 'Adicionar Item' : 'Editar Item'} - {currentItem?.chapterKey}
            </h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowEditItemModal(false)}
            >
              &times;
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-red-500 text-red-600 dark:border-red-400 dark:text-red-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('general')}
            >
              Informações Gerais
            </button>
            <button
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'internal'
                  ? 'border-red-500 text-red-600 dark:border-red-400 dark:text-red-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('internal')}
            >
              Controle Interno
            </button>
          </nav>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* General Information Tab */}
          {activeTab === 'general' && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ITEM
                </label>
                <input
                  type="text"
                  name="ITEM"
                  value={formData.ITEM}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UNIDADE
                  </label>
                  <input
                    type="text"
                    name="UNIDADE"
                    value={formData.UNIDADE}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    QUANTIDADE
                  </label>
                  <input
                    type="number"
                    name="QTD"
                    value={formData.QTD}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    VALOR UNITÁRIO
                  </label>
                  <input
                    type="number"
                    name="VALOR_UNITARIO"
                    value={formData.VALOR_UNITARIO}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    VALOR TOTAL
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={formatCurrency(formData.VALOR)}
                      className="form-input bg-gray-100"
                      readOnly
                    />
                    <span className="ml-2 text-xs text-gray-500">(calculado)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Internal Control Tab */}
          {activeTab === 'internal' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custo Real (€)
                  </label>
                  <input
                    type="number"
                    name="real_cost"
                    value={formData.internal_control.real_cost}
                    onChange={handleInternalControlChange}
                    className="form-input"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Margem do Item (%)
                  </label>
                  <input
                    type="number"
                    name="item_margin"
                    value={formData.internal_control.item_margin}
                    onChange={handleInternalControlChange}
                    className="form-input"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fornecedor
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.internal_control.supplier}
                  onChange={handleInternalControlChange}
                  className="form-input"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  name="notes"
                  value={formData.internal_control.notes}
                  onChange={handleInternalControlChange}
                  rows="3"
                  className="form-input w-full"
                ></textarea>
              </div>
              
              {formData.internal_control.real_cost && (
                <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resumo Financeiro
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">Valor Orçado:</span>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {formatCurrency(formData.VALOR)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">Custo Real:</span>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {formData.internal_control.real_cost ? formatCurrency(parseFloat(formData.internal_control.real_cost)) : '-'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">Diferença:</span>
                      <p className={`font-medium ${
                        formData.internal_control.real_cost && formData.VALOR > parseFloat(formData.internal_control.real_cost)
                          ? 'text-green-600 dark:text-green-400'
                          : formData.internal_control.real_cost && formData.VALOR < parseFloat(formData.internal_control.real_cost)
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {formData.internal_control.real_cost 
                          ? formatCurrency(formData.VALOR - parseFloat(formData.internal_control.real_cost))
                          : '-'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-between">
            <div className="space-x-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowEditItemModal(false)}
              >
                Cancelar
              </button>
              
              {!currentItem?.isNew && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Excluir
                </button>
              )}
            </div>
            
            <button
              type="submit"
              className="btn btn-primary"
            >
              {currentItem?.isNew ? 'Adicionar' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;
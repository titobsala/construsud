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
    VALOR: 0
  });
  
  useEffect(() => {
    if (currentItem && currentItem.item) {
      setFormData({
        ...currentItem.item
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
      <div className="modal-content">
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
        
        <form onSubmit={handleSubmit} className="p-6">
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
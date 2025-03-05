import React, { useState, useEffect } from 'react';

const SupplierModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  supplier = null, 
  title = "Adicionar Fornecedor" 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    service_price: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If supplier is provided, we're in edit mode
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        description: supplier.description || '',
        service_price: supplier.service_price ? supplier.service_price.toString() : ''
      });
    } else {
      // Reset form for new supplier
      setFormData({
        name: '',
        description: '',
        service_price: ''
      });
    }
    
    // Reset errors when modal is opened/closed
    setErrors({});
  }, [supplier, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome do fornecedor é obrigatório';
    }
    
    if (!formData.service_price) {
      newErrors.service_price = 'Preço de serviço é obrigatório';
    } else if (isNaN(parseFloat(formData.service_price)) || parseFloat(formData.service_price) < 0) {
      newErrors.service_price = 'Preço de serviço deve ser um número positivo';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const supplierData = {
        ...formData,
        service_price: parseFloat(formData.service_price)
      };
      
      onSave(supplierData, supplier?.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome do Fornecedor *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-gray-200 ${
                  errors.name ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-gray-200"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label htmlFor="service_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preço de Serviço (€) *
              </label>
              <input
                type="number"
                id="service_price"
                name="service_price"
                value={formData.service_price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-gray-200 ${
                  errors.service_price ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.service_price && (
                <p className="text-red-500 text-xs mt-1">{errors.service_price}</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 mr-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {supplier ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupplierModal;
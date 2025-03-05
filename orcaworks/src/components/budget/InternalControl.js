import React, { useState, useEffect } from 'react';
import { useBudget } from '../../context/BudgetContext';
import CollapsibleSection from '../ui/CollapsibleSection';
import LaborCostTable from './LaborCostTable';
import SupplierModal from '../modals/SupplierModal';
import { supplierService } from '../../services/supplierService';

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

// Item-specific internal control component with collapsible sections
const ItemInternalControl = ({ chapterKey, item, onUpdate, formatCurrency }) => {
  const { activeProject } = useBudget();
  const [formData, setFormData] = useState({
    real_cost: item.internal_control?.real_cost || '',
    supplier: item.internal_control?.supplier || '',
    item_margin: item.internal_control?.item_margin || '',
    notes: item.internal_control?.notes || ''
  });
  const [collapsedSections, setCollapsedSections] = useState({
    details: false,
    suppliers: false,
    labor: false
  });
  // eslint-disable-next-line no-unused-vars
  const [suppliers, setSuppliers] = useState([]);
  const [itemSuppliers, setItemSuppliers] = useState([]);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [laborCosts, setLaborCosts] = useState(
    item.internal_control?.labor_costs || [{ e_o_a: 'E', duration_hours: 0, total_euro: 0 }]
  );

  // Load suppliers on component mount
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        // Load all available suppliers
        const { data: suppliersData, error: suppliersError } = await supplierService.getSuppliers();
        if (!suppliersError && suppliersData) {
          setSuppliers(suppliersData);
        }

        // Load suppliers specific to this item
        if (activeProject && item.id) {
          const { data: itemSuppliersData, error: itemSuppliersError } = 
            await supplierService.getBudgetSuppliers(activeProject, item.id);
          
          if (!itemSuppliersError && itemSuppliersData) {
            setItemSuppliers(itemSuppliersData);
          }
        }
      } catch (err) {
        console.error('Error loading suppliers:', err);
      }
    };

    loadSuppliers();
  }, [activeProject, item.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionToggle = (isCollapsed, sectionId) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: isCollapsed
    }));
  };

  const handleSave = () => {
    onUpdate(chapterKey, item.id, {
      ...item,
      internal_control: {
        ...formData,
        labor_costs: laborCosts
      }
    });
  };

  const handleAddSupplier = () => {
    setCurrentSupplier(null);
    setShowSupplierModal(true);
  };

  const handleEditSupplier = (supplier) => {
    setCurrentSupplier(supplier);
    setShowSupplierModal(true);
  };

  const handleSaveSupplier = async (supplierData, id) => {
    try {
      let result;
      if (id) {
        // Update existing supplier
        result = await supplierService.updateSupplier(id, supplierData);
      } else {
        // Create new supplier
        result = await supplierService.createSupplier(supplierData);
      }

      if (result.error) {
        console.error('Error saving supplier:', result.error);
        return;
      }

      // Refresh suppliers list
      const { data: refreshedSuppliers } = await supplierService.getSuppliers();
      setSuppliers(refreshedSuppliers || []);
    } catch (err) {
      console.error('Error saving supplier:', err);
    }
  };

  const handleLaborCostsUpdate = (updatedLaborCosts) => {
    setLaborCosts(updatedLaborCosts);
  };

  const calculateTotalSuppliersCost = () => {
    return itemSuppliers.reduce((sum, item) => sum + (item.value || 0), 0);
  };

  return (
    <div className="space-y-6 flex-1">
      {/* Item header */}
      <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {chapterKey} - {item.ITEM}
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {item.UNIDADE} | Qtd: {item.QTD} | Valor: {formatCurrency(item.VALOR)}
          </div>
        </div>

        {/* Item financial summary */}
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

      {/* Details Section */}
      <CollapsibleSection
        title="Detalhes do Item"
        defaultCollapsed={collapsedSections.details}
        onToggle={(isCollapsed) => handleSectionToggle(isCollapsed, 'details')}
        id="details"
      >
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
      </CollapsibleSection>

      {/* Suppliers Section */}
      <CollapsibleSection
        title="Fornecedores do Item"
        defaultCollapsed={collapsedSections.suppliers}
        onToggle={(isCollapsed) => handleSectionToggle(isCollapsed, 'suppliers')}
        id="suppliers"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Fornecedores</h4>
            <button
              onClick={handleAddSupplier}
              className="inline-flex items-center px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Adicionar Fornecedor
            </button>
          </div>
          
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Preço (€)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Valor Aplicado (€)
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {itemSuppliers.length > 0 ? (
                  itemSuppliers.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.supplier.name}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.supplier.description || '-'}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatCurrency(item.supplier.service_price)}</td>
                      <td className="px-4 py-3">
                        <input 
                          type="number" 
                          value={item.value} 
                          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
                          min="0"
                          step="0.01"
                          readOnly
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleEditSupplier(item.supplier)}
                          className="inline-flex items-center justify-center p-1 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20 focus:outline-none mr-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      Nenhum fornecedor adicionado para este item.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <td className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300" colSpan="3">
                    Total
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatCurrency(calculateTotalSuppliersCost())}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        {/* Supplier Modal */}
        <SupplierModal 
          isOpen={showSupplierModal}
          onClose={() => setShowSupplierModal(false)}
          onSave={handleSaveSupplier}
          supplier={currentSupplier}
          title={currentSupplier ? "Editar Fornecedor" : "Adicionar Fornecedor"}
        />
      </CollapsibleSection>

      {/* Labor Costs Section */}
      <CollapsibleSection
        title="Mão de Obra"
        defaultCollapsed={collapsedSections.labor}
        onToggle={(isCollapsed) => handleSectionToggle(isCollapsed, 'labor')}
        id="labor"
      >
        <LaborCostTable 
          laborCosts={laborCosts}
          onUpdate={handleLaborCostsUpdate}
          formatCurrency={formatCurrency}
        />
      </CollapsibleSection>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Salvar Alterações
        </button>
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
  
  // eslint-disable-next-line no-unused-vars
  const handleMarginChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      updateMarginPercentage(value);
    }
  };
  
  // eslint-disable-next-line no-unused-vars
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

  // Project overview component with collapsible sections
  const ProjectInternalControl = () => {
    const { 
      budget, 
      activeProject,
      updateMarginPercentage, 
      updateDiverseCosts, 
      formatCurrency 
    } = useBudget();
    
    const { CONTROLE_INTERNO } = budget;
    const [collapsedSections, setCollapsedSections] = useState({
      venda: false,
      diversos: false,
      subcontratados: false,
      maoDeObra: false
    });
    // eslint-disable-next-line no-unused-vars
    const [suppliers, setSuppliers] = useState([]);
    const [budgetSuppliers, setBudgetSuppliers] = useState([]);
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState(null);
    const [laborCosts, setLaborCosts] = useState([
      { e_o_a: 'E', duration_hours: 0, total_euro: 0 }
    ]);

    // Load suppliers on component mount
    useEffect(() => {
      const loadSuppliers = async () => {
        try {
          // Load all available suppliers
          const { data: suppliersData, error: suppliersError } = await supplierService.getSuppliers();
          if (!suppliersError && suppliersData) {
            setSuppliers(suppliersData);
          }

          // Load suppliers specific to this budget
          if (activeProject) {
            const { data: budgetSuppliersData, error: budgetSuppliersError } = 
              await supplierService.getBudgetSuppliers(activeProject);
            
            if (!budgetSuppliersError && budgetSuppliersData) {
              setBudgetSuppliers(budgetSuppliersData);
            }
          }
        } catch (err) {
          console.error('Error loading suppliers:', err);
        }
      };

      // Load labor costs from budget data if available
      if (CONTROLE_INTERNO.LABOR && CONTROLE_INTERNO.LABOR.items && CONTROLE_INTERNO.LABOR.items.length > 0) {
        setLaborCosts(CONTROLE_INTERNO.LABOR.items);
      }

      loadSuppliers();
    }, [activeProject, CONTROLE_INTERNO.LABOR]);

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

    const handleSectionToggle = (isCollapsed, sectionId) => {
      setCollapsedSections(prev => ({
        ...prev,
        [sectionId]: isCollapsed
      }));
    };

    const handleAddSupplier = () => {
      setCurrentSupplier(null);
      setShowSupplierModal(true);
    };

    const handleEditSupplier = (supplier) => {
      setCurrentSupplier(supplier);
      setShowSupplierModal(true);
    };

    const handleSaveSupplier = async (supplierData, id) => {
      try {
        let result;
        if (id) {
          // Update existing supplier
          result = await supplierService.updateSupplier(id, supplierData);
        } else {
          // Create new supplier
          result = await supplierService.createSupplier(supplierData);
        }

        if (result.error) {
          console.error('Error saving supplier:', result.error);
          return;
        }

        // Refresh suppliers list
        const { data: refreshedSuppliers } = await supplierService.getSuppliers();
        setSuppliers(refreshedSuppliers || []);
      } catch (err) {
        console.error('Error saving supplier:', err);
      }
    };

    const handleDeleteSupplier = async (id) => {
      if (!window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
        return;
      }

      try {
        const { error } = await supplierService.deleteSupplier(id);
        if (error) {
          console.error('Error deleting supplier:', error);
          return;
        }

        // Refresh suppliers list
        const { data: refreshedSuppliers } = await supplierService.getSuppliers();
        setSuppliers(refreshedSuppliers || []);
      } catch (err) {
        console.error('Error deleting supplier:', err);
      }
    };

    const handleLaborCostsUpdate = (updatedLaborCosts) => {
      setLaborCosts(updatedLaborCosts);
      // Here you would also update this in your budget context
      // updateLaborCosts(updatedLaborCosts);
    };

    const calculateTotalSuppliersCost = () => {
      return budgetSuppliers.reduce((sum, item) => sum + (item.value || 0), 0);
    };

    return (
      <div className="space-y-6 flex-grow overflow-auto">
        {/* VENDA Section */}
        <CollapsibleSection
          title="VENDA"
          defaultCollapsed={collapsedSections.venda}
          onToggle={(isCollapsed) => handleSectionToggle(isCollapsed, 'venda')}
          headerClassName="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400"
          id="venda"
        >
          <div className="space-y-5">
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
        </CollapsibleSection>
        
        {/* DIVERSOS Section */}
        <CollapsibleSection
          title="DIVERSOS"
          defaultCollapsed={collapsedSections.diversos}
          onToggle={(isCollapsed) => handleSectionToggle(isCollapsed, 'diversos')}
          id="diversos"
        >
          <div className="space-y-5">
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
        </CollapsibleSection>
        
        {/* SUB-EMPREITEIROS Section */}
        <CollapsibleSection
          title="SUB-EMPREITEIROS"
          defaultCollapsed={collapsedSections.subcontratados}
          onToggle={(isCollapsed) => handleSectionToggle(isCollapsed, 'subcontratados')}
          id="subcontratados"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Fornecedores do Projeto</h4>
              <button
                onClick={handleAddSupplier}
                className="inline-flex items-center px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Adicionar Fornecedor
              </button>
            </div>
            
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Preço (€)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Valor Aplicado (€)
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                  {budgetSuppliers.length > 0 ? (
                    budgetSuppliers.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.supplier.name}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{item.supplier.description || '-'}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatCurrency(item.supplier.service_price)}</td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            value={item.value} 
                            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
                            min="0"
                            step="0.01"
                            readOnly
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleEditSupplier(item.supplier)}
                            className="inline-flex items-center justify-center p-1 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20 focus:outline-none mr-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteSupplier(item.supplier.id)}
                            className="inline-flex items-center justify-center p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 focus:outline-none"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                        Nenhum fornecedor adicionado. Clique em "Adicionar Fornecedor" para começar.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300" colSpan="3">
                      Total
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formatCurrency(calculateTotalSuppliersCost())}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          {/* Supplier Modal */}
          <SupplierModal 
            isOpen={showSupplierModal}
            onClose={() => setShowSupplierModal(false)}
            onSave={handleSaveSupplier}
            supplier={currentSupplier}
            title={currentSupplier ? "Editar Fornecedor" : "Adicionar Fornecedor"}
          />
        </CollapsibleSection>
        
        {/* MÃO DE OBRA Section */}
        <CollapsibleSection
          title="MÃO DE OBRA"
          defaultCollapsed={collapsedSections.maoDeObra}
          onToggle={(isCollapsed) => handleSectionToggle(isCollapsed, 'maoDeObra')}
          id="maoDeObra"
        >
          <LaborCostTable 
            laborCosts={laborCosts}
            onUpdate={handleLaborCostsUpdate}
            formatCurrency={formatCurrency}
          />
        </CollapsibleSection>
      </div>
    );
  };

  const renderProjectOverview = () => (
    <ProjectInternalControl />
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
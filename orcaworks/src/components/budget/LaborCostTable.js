import React, { useState, useEffect } from 'react';

/**
 * Component for displaying and editing labor costs
 * @param {Object} props
 * @param {Array} props.laborCosts - Array of labor cost entries
 * @param {function} props.onUpdate - Function to update labor costs
 * @param {function} props.formatCurrency - Function to format currency values
 */
const LaborCostTable = ({ laborCosts = [], onUpdate, formatCurrency }) => {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    // Initialize with provided labor costs or create a default empty row
    if (laborCosts && laborCosts.length > 0) {
      setItems(laborCosts);
    } else {
      setItems([{ e_o_a: 'E', duration_hours: 0, total_euro: 0 }]);
    }
  }, [laborCosts]);
  
  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    
    // Convert string numbers to actual numbers
    if (field === 'duration_hours' || field === 'total_euro') {
      value = parseFloat(value) || 0;
    }
    
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    setItems(updatedItems);
    onUpdate(updatedItems);
  };
  
  const addRow = () => {
    setItems([...items, { e_o_a: 'E', duration_hours: 0, total_euro: 0 }]);
  };
  
  const removeRow = (index) => {
    if (items.length <= 1) return; // Keep at least one row
    
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    onUpdate(updatedItems);
  };
  
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total_euro, 0);
  };
  
  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                E/O/A
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Duração (h)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total (€)
              </th>
              <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
            {items.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-3">
                  <select
                    value={item.e_o_a}
                    onChange={(e) => handleChange(index, 'e_o_a', e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
                  >
                    <option value="E">E</option>
                    <option value="O">O</option>
                    <option value="A">A</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={item.duration_hours}
                    onChange={(e) => handleChange(index, 'duration_hours', e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
                    min="0"
                    step="0.5"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={item.total_euro}
                    onChange={(e) => handleChange(index, 'total_euro', e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400 dark:bg-gray-700 dark:text-gray-200"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => removeRow(index)}
                    className="inline-flex items-center justify-center p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 focus:outline-none"
                    disabled={items.length <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <td className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300" colSpan="2">
                Total
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {formatCurrency(calculateTotal())}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className="mt-2 flex justify-end">
        <button
          onClick={addRow}
          className="inline-flex items-center px-3 py-1.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Adicionar Linha
        </button>
      </div>
    </div>
  );
};

export default LaborCostTable;
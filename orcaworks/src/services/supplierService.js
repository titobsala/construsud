import { supabase } from '../lib/supabase';

/**
 * Service for managing suppliers
 */
export const supplierService = {
  /**
   * Get all suppliers
   * @returns {Promise} with data and error
   */
  getSuppliers: async () => {
    return await supabase
      .from('suppliers')
      .select('*')
      .order('name');
  },

  /**
   * Get a specific supplier by ID
   * @param {string} id - Supplier ID
   * @returns {Promise} with data and error
   */
  getSupplier: async (id) => {
    return await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();
  },

  /**
   * Create a new supplier
   * @param {Object} supplier - Supplier data
   * @returns {Promise} with data and error
   */
  createSupplier: async (supplier) => {
    return await supabase
      .from('suppliers')
      .insert([supplier])
      .select()
      .single();
  },

  /**
   * Update an existing supplier
   * @param {string} id - Supplier ID
   * @param {Object} updates - Updated supplier data
   * @returns {Promise} with data and error
   */
  updateSupplier: async (id, updates) => {
    return await supabase
      .from('suppliers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
  },

  /**
   * Delete a supplier
   * @param {string} id - Supplier ID
   * @returns {Promise} with data and error
   */
  deleteSupplier: async (id) => {
    return await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);
  },

  /**
   * Get suppliers for a specific budget item
   * @param {string} budgetId - Budget ID
   * @param {string} itemId - Item ID (optional)
   * @returns {Promise} with data and error
   */
  getBudgetSuppliers: async (budgetId, itemId = null) => {
    let query = supabase
      .from('budget_suppliers')
      .select(`
        id,
        value,
        is_override,
        supplier:supplier_id (
          id,
          name,
          description,
          service_price
        )
      `)
      .eq('budget_id', budgetId);
    
    if (itemId) {
      query = query.eq('item_id', itemId);
    } else {
      query = query.is('item_id', null);
    }
    
    return await query;
  },

  /**
   * Add a supplier to a budget item
   * @param {string} budgetId - Budget ID
   * @param {string} supplierId - Supplier ID
   * @param {number} value - Value
   * @param {string} itemId - Item ID (optional)
   * @param {boolean} isOverride - Whether this is a manual override
   * @returns {Promise} with data and error
   */
  addBudgetSupplier: async (budgetId, supplierId, value, itemId = null, isOverride = false) => {
    return await supabase
      .from('budget_suppliers')
      .insert([{
        budget_id: budgetId,
        supplier_id: supplierId,
        item_id: itemId,
        value,
        is_override: isOverride
      }])
      .select()
      .single();
  },

  /**
   * Update a budget supplier
   * @param {string} id - Budget supplier ID
   * @param {number} value - New value
   * @param {boolean} isOverride - Whether this is a manual override
   * @returns {Promise} with data and error
   */
  updateBudgetSupplier: async (id, value, isOverride = true) => {
    return await supabase
      .from('budget_suppliers')
      .update({ value, is_override: isOverride })
      .eq('id', id)
      .select()
      .single();
  },

  /**
   * Remove a supplier from a budget item
   * @param {string} id - Budget supplier ID
   * @returns {Promise} with data and error
   */
  removeBudgetSupplier: async (id) => {
    return await supabase
      .from('budget_suppliers')
      .delete()
      .eq('id', id);
  }
};

export default supplierService;
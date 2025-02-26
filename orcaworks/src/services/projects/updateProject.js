// src/services/projects/updateProject.js
import { supabase } from '../../lib/supabase';

/**
 * Update a project
 * @param {string} id - Project ID
 * @param {Object} updates - Project updates
 * @returns {Promise<{data?: any, error?: Error}>}
 */
export const updateProject = async (id, updates) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating project:', error);
    return { error };
  }
  
  return { data };
};
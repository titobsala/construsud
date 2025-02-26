// src/services/projects/getProjects.js
import { supabase } from '../../lib/supabase';

/**
 * Fetch all projects for the current user
 * @returns {Promise<{data?: any[], error?: Error}>}
 */
export const getProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    return { error };
  }
  
  return { data };
};

/**
 * Fetch a single project by ID
 * @param {string} id - Project ID
 * @returns {Promise<{data?: any, error?: Error}>}
 */
export const getProject = async (id) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching project:', error);
    return { error };
  }
  
  return { data };
};
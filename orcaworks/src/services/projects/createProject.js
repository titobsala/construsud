// src/services/projects/createProject.js
import { supabase } from '../../lib/supabase';
import { getInitialInternalControlData } from './internalControl';

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @returns {Promise<{data?: any, error?: Error}>}
 */
export const createProject = async (projectData) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating project:', error);
    return { error };
  }
  
  // Create project settings
  const { error: settingsError } = await supabase
    .from('project_settings')
    .insert([{
      project_id: data.id,
      currency: projectData.currency || 'EUR',
      number_format: 'PT-PT',
      decimal_places: 2,
      show_all_chapters: true,
      default_margin: 30.00,
    }]);
  
  if (settingsError) {
    console.error('Error creating project settings:', settingsError);
    return { error: settingsError };
  }
  
  // Initialize internal control sections
  const internalControlData = getInitialInternalControlData(data.id);
  
  for (const controlItem of internalControlData) {
    const { error: controlError } = await supabase
      .from('internal_control')
      .insert([controlItem]);
    
    if (controlError) {
      console.error(`Error creating internal control (${controlItem.type}):`, controlError);
      return { error: controlError };
    }
  }
  
  return { data };
};
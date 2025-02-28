// src/services/projects/createProject.js
import { supabase } from '../../lib/supabase';
import { getInitialInternalControlData } from './internalControl';

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @returns {Promise<{data?: any, error?: Error}>}
 */
export const createProject = async (projectData) => {
  try {
    // Retrieve the user from the session
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError || !authData.session) {
      console.error('Error fetching session:', authError);
      return { error: new Error('Authentication required') };
    }
    const user = authData.session.user;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile?.organization_id) {
      console.error('Error fetching user organization:', profileError);
      return { error: new Error('User not associated with any organization') };
    }
    
    // 2. Adicionar o organization_id correto ao projectData
    const projectWithOrg = {
      ...projectData,
      organization_id: profile.organization_id
    };
    
    // 3. Criar o projeto com o organization_id correto
    const { data, error } = await supabase
      .from('projects')
      .insert([projectWithOrg])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating project:', error);
      return { error };
    }
    
    // O resto do código permanece igual
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
  } catch (err) {
    console.error('Unexpected error:', err);
    return { error: err };
  }
};
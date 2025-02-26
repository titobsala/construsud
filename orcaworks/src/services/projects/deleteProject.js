// src/services/projects/deleteProject.js
import { supabase } from '../../lib/supabase';

/**
 * Delete a project and all related data
 * @param {string} id - Project ID
 * @returns {Promise<{success?: boolean, error?: Error}>}
 */
export const deleteProject = async (id) => {
  // Delete related data first (cascade doesn't work with RLS)
  // 1. Get all chapters for this project
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('id')
    .eq('project_id', id);
  
  if (chaptersError) {
    console.error('Error fetching chapters for deletion:', chaptersError);
    return { error: chaptersError };
  }
  
  // 2. Delete all budget items for each chapter
  for (const chapter of chapters) {
    const { error: itemsError } = await supabase
      .from('budget_items')
      .delete()
      .eq('chapter_id', chapter.id);
    
    if (itemsError) {
      console.error('Error deleting budget items:', itemsError);
      return { error: itemsError };
    }
  }
  
  // 3. Delete all chapters
  const { error: chapterDeleteError } = await supabase
    .from('chapters')
    .delete()
    .eq('project_id', id);
  
  if (chapterDeleteError) {
    console.error('Error deleting chapters:', chapterDeleteError);
    return { error: chapterDeleteError };
  }
  
  // 4. Delete internal control data
  const { error: controlDeleteError } = await supabase
    .from('internal_control')
    .delete()
    .eq('project_id', id);
  
  if (controlDeleteError) {
    console.error('Error deleting internal control data:', controlDeleteError);
    return { error: controlDeleteError };
  }
  
  // 5. Delete project settings
  const { error: settingsDeleteError } = await supabase
    .from('project_settings')
    .delete()
    .eq('project_id', id);
  
  if (settingsDeleteError) {
    console.error('Error deleting project settings:', settingsDeleteError);
    return { error: settingsDeleteError };
  }
  
  // 6. Finally delete the project
  const { error: projectDeleteError } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (projectDeleteError) {
    console.error('Error deleting project:', projectDeleteError);
    return { error: projectDeleteError };
  }
  
  return { success: true };
};
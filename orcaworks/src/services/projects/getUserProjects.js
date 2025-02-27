import { supabase } from '../../lib/supabase';

/**
 * Fetch all projects for the current user's organization
 * @returns {Promise<{data?: any[], error?: Error}>}
 */
export const getUserProjects = async () => {
  // First we need to get the current user's organization_id
  const { data: authData } = await supabase.auth.getSession();
  const userId = authData.session?.user?.id;
  
  if (!userId) {
    console.error('No authenticated user found when fetching projects');
    return { error: new Error('Authentication required') };
  }
  
  // Get the user's organization
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', userId)
    .single();
  
  if (profileError) {
    console.error('Error fetching user organization:', profileError);
    return { error: profileError };
  }
  
  if (!profileData.organization_id) {
    console.error('User has no organization assigned');
    return { data: [] }; // Return empty array if no organization
  }
  
  // Fetch projects for the organization
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('organization_id', profileData.organization_id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    return { error };
  }
  
  return { data };
}; 
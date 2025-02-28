import { supabase } from '../lib/supabase';

export const userService = {
  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return { error };
    }
    
    return { data };
  },
  
  // Update user profile
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select('*')
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      return { error };
    }
    
    return { data };
  },
  
  // Get user organization
  async getUserOrganization(userId) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Error fetching user profile for organization:', profileError);
      return { error: profileError };
    }
    
    if (!profile.organization_id) {
      return { data: null };
    }
    
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', profile.organization_id)
      .single();
    
    if (orgError) {
      console.error('Error fetching organization:', orgError);
      return { error: orgError };
    }
    
    return { data: organization };
  },
  
  // Create a new organization
  async createOrganization(company_name, nif, adminId) {
    const { data, error } = await supabase
      .from('organizations')
      .insert([
        { company_name, nif, admin_id: adminId }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating organization:', error);
      return { error };
    }
    
    // Update the user's profile to link to this organization
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        organization_id: data.id,
        role: 'admin' // First user is the admin
      })
      .eq('id', adminId);
    
    if (profileError) {
      console.error('Error updating profile with organization:', profileError);
      return { error: profileError };
    }
    
    return { data };
  },
  
  // Update organization
  async updateOrganization(id, updates) {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating organization:', error);
      return { error };
    }
    
    return { data };
  }
};
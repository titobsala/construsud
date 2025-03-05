import { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';

export const useOrgData = (userId, userMetadata) => {
  const [organization, setOrganization] = useState({
    company_name: '',
    nif: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orgId, setOrgId] = useState(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      if (!userId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch organization data if it exists
        const { data: orgData, error: orgError } = await userService.getUserOrganization(userId);
        
        if (orgError) {
          setError('Failed to load organization information. Please try again.');
          setLoading(false);
          return;
        }
        
        // If organization exists, set the data
        if (orgData) {
          setOrganization({
            company_name: orgData.company_name || '',
            nif: orgData.nif || ''
          });
          setOrgId(orgData.id);
        } else {
          // Try to get company name and vat from user metadata
          const company_name = userMetadata?.company_name;
          const vat_number = userMetadata?.vat_number;
          
          if (company_name && vat_number) {
            setOrganization({
              company_name: company_name,
              nif: vat_number
            });
            
            // Auto-create the organization if it doesn't exist yet
            const { data: createdOrg, error: createOrgError } = await userService.createOrganization(
              company_name,
              vat_number,
              userId
            );
            
            if (createOrgError) {
              console.error('Error auto-creating organization:', createOrgError);
            } else if (createdOrg) {
              setOrgId(createdOrg.id);
            }
          }
        }
      } catch (err) {
        console.error('Error loading organization data:', err);
        setError('An unexpected error occurred while fetching organization data.');
      }
      
      setLoading(false);
    };
    
    fetchOrganization();
  }, [userId, userMetadata]);

  const updateOrgData = (e) => {
    const { name, value } = e.target;
    setOrganization(prev => ({ ...prev, [name]: value }));
  };

  const saveOrganization = async () => {
    if (!userId) return { error: 'User ID is required' };
    
    try {
      // Get current organization data if we don't have orgId yet
      if (!orgId) {
        const { data: orgData } = await userService.getUserOrganization(userId);
        
        if (orgData) {
          setOrgId(orgData.id);
          
          // Update existing organization
          const { error: updateOrgError } = await userService.updateOrganization(orgData.id, {
            company_name: organization.company_name,
            nif: organization.nif
          });
          
          if (updateOrgError) {
            return { error: 'Failed to update organization information. Please try again.' };
          }
        } else {
          // Create new organization if it doesn't exist
          const { data: newOrg, error: createOrgError } = await userService.createOrganization(
            organization.company_name,
            organization.nif,
            userId
          );
          
          if (createOrgError) {
            return { error: 'Failed to create organization. Please try again.' };
          }
          
          if (newOrg) {
            setOrgId(newOrg.id);
          }
        }
      } else {
        // We already have orgId, so just update
        const { error: updateOrgError } = await userService.updateOrganization(orgId, {
          company_name: organization.company_name,
          nif: organization.nif
        });
        
        if (updateOrgError) {
          return { error: 'Failed to update organization information. Please try again.' };
        }
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error updating organization:', err);
      return { error: 'An unexpected error occurred. Please try again later.' };
    }
  };

  return {
    organization,
    loading,
    error,
    updateOrgData,
    saveOrganization
  };
};
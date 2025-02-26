import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error(error);
        setAuthError(error.message);
      }
      
      setSession(data.session);
      setUser(data.session?.user || null);
      setLoading(false);
    };

    getSession();

    // Listen for changes to auth state
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Supabase auth event: ${event}`);
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = async ({ email, password, fullName, companyName, vatNumber }) => {
    setLoading(true);
    setAuthError(null);
    
    // First, create the organization
    const { data: orgData, error: orgError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName,
          vat_number: vatNumber,
        },
      },
    });

    if (orgError) {
      setAuthError(orgError.message);
      setLoading(false);
      return { error: orgError };
    }
    
    // Once registered, the trigger in the database will create a profile
    // and handle_new_user() will set up the basic profile.
    // The organization creation will be handled after email confirmation
    // when the user first signs in.

    setLoading(false);
    return { data: orgData };
  };

  // Sign in with email and password
  const signIn = async ({ email, password }) => {
    setLoading(true);
    setAuthError(null);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
      return { error };
    }

    setLoading(false);
    return { data };
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      setAuthError(error.message);
      setLoading(false);
      return { error };
    }

    setSession(null);
    setUser(null);
    setLoading(false);
    return { success: true };
  };

  // Get user profile
  const getUserProfile = async () => {
    if (!user) return { data: null };

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return { error };
    }

    return { data };
  };

  // Update user profile
  const updateProfile = async (updates) => {
    if (!user) return { data: null };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return { error };
    }

    return { data };
  };

  // Reset password
  const resetPassword = async (email) => {
    setLoading(true);
    setAuthError(null);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
      return { error };
    }

    setLoading(false);
    return { success: true };
  };

  // Update password
  const updatePassword = async (password) => {
    setLoading(true);
    setAuthError(null);
    
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
      return { error };
    }

    setLoading(false);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        authError,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        getUserProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
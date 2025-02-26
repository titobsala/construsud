import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState(null);
  
  const { signIn, signUp, authError } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    
    try {
      if (isLogin) {
        const { data, error } = await signIn({ email, password });
        
        if (error) {
          setMessage({ type: 'error', text: error.message });
          return;
        }
        
        // Successfully signed in
        setMessage({ type: 'success', text: 'Signed in successfully!' });
      } else {
        if (!fullName) {
          setMessage({ type: 'error', text: 'Please enter your full name' });
          return;
        }
        
        const { data, error } = await signUp({ email, password, fullName });
        
        if (error) {
          setMessage({ type: 'error', text: error.message });
          return;
        }
        
        setMessage({ 
          type: 'success', 
          text: 'Registration successful! Please check your email for confirmation.'
        });
        
        // Reset form and switch to login
        setIsLogin(true);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };
  
  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        {isLogin ? 'Sign In' : 'Create Account'}
      </h2>
      
      {message && (
        <div className={`p-3 mb-4 rounded-md ${
          message.type === 'error' 
            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        }`}>
          {message.text}
        </div>
      )}
      
      {authError && (
        <div className="p-3 mb-4 rounded-md bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {authError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-4">
            <label 
              htmlFor="fullName" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        )}
        
        <div className="mb-4">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        
        <div className="mb-6">
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
          
          {isLogin && (
            <button
              type="button"
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              Forgot password?
            </button>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
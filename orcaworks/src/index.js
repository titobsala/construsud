import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BudgetProvider } from './context/BudgetContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BudgetProvider>
        <App />
      </BudgetProvider>
    </AuthProvider>
  </React.StrictMode>
);
import React, { useState } from 'react';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('orcamento');

  return (
    <div className="flex border-b border-gray-200 bg-gray-50">
      <div 
        className={`tab ${activeTab === 'detalhes' ? 'active' : 'bg-white text-gray-700'}`}
        onClick={() => setActiveTab('detalhes')}
      >
        Detalhes
      </div>
      
      <div 
        className={`tab ${activeTab === 'orcamento' ? 'active' : 'bg-white text-gray-700'}`}
        onClick={() => setActiveTab('orcamento')}
      >
        Orçamento
      </div>
      
      <div 
        className={`tab ${activeTab === 'documentos' ? 'active' : 'bg-white text-gray-700'}`}
        onClick={() => setActiveTab('documentos')}
      >
        Documentos
      </div>
    </div>
  );
};

export default Tabs;
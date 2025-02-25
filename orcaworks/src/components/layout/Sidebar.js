import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-52 bg-gray-50 border-r border-gray-200">
      <nav className="p-4 space-y-2">
        <div className="bg-indigo-500 text-white px-4 py-3 rounded-md">
          <span className="font-medium">Orçamentação</span>
        </div>
        
        <div className="bg-white text-gray-700 px-4 py-3 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer">
          <span className="font-medium">Cronograma</span>
        </div>
        
        <div className="bg-white text-gray-700 px-4 py-3 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer">
          <span className="font-medium">Gestão Financeira</span>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
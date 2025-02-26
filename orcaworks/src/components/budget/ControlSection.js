import React, { useState } from 'react';

const ControlSection = ({ title, content }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="control-section mb-4">
      <div 
        className="control-header flex justify-between items-center cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <span className="text-gray-500">
          {isCollapsed ? '▼' : '▲'}
        </span>
      </div>
      
      {!isCollapsed && (
        <div className="p-4">
          {content}
        </div>
      )}
    </div>
  );
};

export default ControlSection;
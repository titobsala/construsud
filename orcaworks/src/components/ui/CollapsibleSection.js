import React, { useState, useEffect } from 'react';

/**
 * A reusable collapsible section component
 * @param {Object} props
 * @param {string} props.title - The section title
 * @param {React.ReactNode} props.children - Content to be displayed inside the section
 * @param {boolean} props.defaultCollapsed - Whether the section should be collapsed by default
 * @param {string} props.headerClassName - Optional additional CSS classes for header
 * @param {function} props.onToggle - Optional callback when section is toggled
 * @param {string} props.id - Optional id for the section
 */
const CollapsibleSection = ({ 
  title, 
  children, 
  defaultCollapsed = false,
  headerClassName = "",
  onToggle,
  id
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  
  useEffect(() => {
    setIsCollapsed(defaultCollapsed);
  }, [defaultCollapsed]);

  const handleToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState, id);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 mb-4">
      <div className={`flex justify-between items-center py-3 px-5 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30 ${headerClassName}`} 
           onClick={handleToggle}>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        <button
          type="button"
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-transform duration-200"
          aria-expanded={!isCollapsed}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isCollapsed ? '' : 'transform rotate-180'}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'}`}
      >
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
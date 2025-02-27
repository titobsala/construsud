// src/services/projects/schema.js

/**
 * @typedef {Object} Project
 * @property {string} id - Unique identifier for the project
 * @property {string} name - Project name
 * @property {string} [client] - Client name
 * @property {string} [description] - Project description
 * @property {string} [type] - Project type (e.g., 'residential', 'commercial')
 * @property {string} [start_date] - Project start date (ISO format string)
 * @property {string} [currency] - Project currency (default: 'EUR')
 * @property {string} organization_id - ID of the organization that owns the project
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

/**
 * @typedef {Object} Chapter
 * @property {string} id - Unique identifier for the chapter
 * @property {string} chapterKey - Key/code for the chapter (e.g., 'CAR 1')
 * @property {string} header - Chapter title
 * @property {string} projectId - ID of the project this chapter belongs to
 * @property {number} position - Order position in the project
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} BudgetItem
 * @property {string} id - Unique identifier for the budget item
 * @property {string} material - Material name
 * @property {string} unit - Unit of measurement
 * @property {number} quantity - Amount of the material
 * @property {number} unitPrice - Price per unit
 * @property {number} totalValue - Total value (quantity * unitPrice)
 * @property {string} chapterId - ID of the chapter this item belongs to
 * @property {number} position - Order position in the chapter
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} InternalControl
 * @property {string} id - Unique identifier
 * @property {string} projectId - ID of the project
 * @property {string} type - Control type ('VENDA', 'DIVERSOS', 'SUB_EMPREITEIROS', 'AMORTIZACOES')
 * @property {Object} data - Control data (schema depends on type)
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} ProjectSettings
 * @property {string} id - Unique identifier
 * @property {string} projectId - ID of the project
 * @property {string} currency - Currency code (default: 'EUR')
 * @property {string} numberFormat - Number format locale (default: 'PT-PT')
 * @property {number} decimalPlaces - Number of decimal places (default: 2)
 * @property {boolean} showAllChapters - Whether to show all chapters (default: true)
 * @property {number} defaultMargin - Default margin percentage (default: 30.00)
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} CompleteProject
 * @property {string} id - Project ID
 * @property {string} name - Project name
 * @property {string} [client] - Client name
 * @property {string} [description] - Project description
 * @property {string} [type] - Project type
 * @property {string} [startDate] - Project start date
 * @property {string} [currency] - Project currency
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 * @property {Object} budget - Budget data
 * @property {Object} budget.project - Project summary
 * @property {Object} budget.chapters - Chapters and their items
 * @property {Object} budget.CONTROLE_INTERNO - Internal control data
 * @property {Object} budget.configuracoes - Project settings
 */

// Default values for new projects
export const DEFAULT_PROJECT = {
    name: '',
    client: '',
    description: '',
    type: 'residential',
    start_date: '',
    currency: 'EUR'
  };
  
  // Validation schema (you can implement actual validation logic here)
  export const validateProject = (project) => {
    const errors = {};
    
    if (!project.name || project.name.trim() === '') {
      errors.name = 'Project name is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
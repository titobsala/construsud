import React, { createContext, useState, useContext, useEffect } from 'react';
import initialBudget from '../data/initialBudget';

const BudgetContext = createContext();

export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
  const [projects, setProjects] = useState([
    { 
      id: 'PROJ-001', 
      name: 'Moradia S. Pedro Estoril', 
      client: 'Cliente Exemplo', 
      active: true,
      budget: initialBudget
    }
  ]);
  const [activeProject, setActiveProject] = useState('PROJ-001');
  const [budget, setBudget] = useState(initialBudget);
  const [activeChapter, setActiveChapter] = useState('CAR 1');
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [showNewChapterModal, setShowNewChapterModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  
  // Recalculate all values when budget changes
  useEffect(() => {
    recalculateBudget();
  }, []);

  // Calculate item value
  const calculateItemValue = (qty, unitPrice) => {
    return Number((qty * unitPrice).toFixed(2));
  };

  // Calculate chapter total
  const calculateChapterTotal = (chapterKey) => {
    if (!budget.chapters[chapterKey]?.items) return 0;
    return budget.chapters[chapterKey].items.reduce(
      (sum, item) => sum + item.VALOR,
      0
    );
  };

  // Calculate total material costs
  const calculateTotalMaterialCost = () => {
    return Object.keys(budget.chapters).reduce(
      (sum, chapterKey) => sum + calculateChapterTotal(chapterKey),
      0
    );
  };

  // Recalculate all budget values
  const recalculateBudget = () => {
    // Recalculate each item value
    const updatedChapters = { ...budget.chapters };
    
    Object.keys(updatedChapters).forEach(chapterKey => {
      updatedChapters[chapterKey].items = updatedChapters[chapterKey].items.map(item => ({
        ...item,
        VALOR: calculateItemValue(item.QTD, item.VALOR_UNITARIO)
      }));
    });
    
    // Recalculate total costs
    const custoSeco = calculateTotalMaterialCost();
    
    // Calculate additional costs
    const diversos = budget.CONTROLE_INTERNO.DIVERSOS.items[0];
    const diversosTotal = 
      diversos.Alimentacao_Euro + 
      diversos.Passagens_Euro + 
      diversos.Outros_Euro;
    
    const subEmpreiteirosTotal = budget.CONTROLE_INTERNO.SUB_EMPREITEIROS.items[0].Total_Euro;
    
    const amortizacoesTotal = budget.CONTROLE_INTERNO.AMORTIZACOES.items.reduce(
      (sum, item) => sum + item.Total_Euro, 
      0
    );
    
    // Calculate total cost
    const custoTotal = custoSeco + diversosTotal + subEmpreiteirosTotal + amortizacoesTotal;
    
    // Calculate margin and sale value
    const margemPercentual = budget.CONTROLE_INTERNO.VENDA.items[0].Margem_Percentual;
    const vendaEuro = custoTotal / (1 - (margemPercentual / 100));
    const margemEuro = vendaEuro - custoTotal;
    
    // Update internal control values
    const updatedControleInterno = { ...budget.CONTROLE_INTERNO };
    updatedControleInterno.VENDA.items[0] = {
      ...updatedControleInterno.VENDA.items[0],
      Custo_Seco_Euro: Number(custoSeco.toFixed(2)),
      Custo_Total_Euro: Number(custoTotal.toFixed(2)),
      Venda_Euro: Number(vendaEuro.toFixed(2)),
      Margem_Euro: Number(margemEuro.toFixed(2))
    };
    
    // Update budget state
    setBudget({
      ...budget,
      chapters: updatedChapters,
      CONTROLE_INTERNO: updatedControleInterno
    });
  };

  // Add new item to chapter
  const addItem = (chapterKey, newItem) => {
    const chapter = budget.chapters[chapterKey];
    const updatedItems = [...chapter.items, {
      ...newItem,
      id: `${chapterKey.split(' ')[1]}-${chapter.items.length + 1}`,
      VALOR: calculateItemValue(newItem.QTD, newItem.VALOR_UNITARIO)
    }];
    
    const updatedChapters = {
      ...budget.chapters,
      [chapterKey]: {
        ...chapter,
        items: updatedItems
      }
    };
    
    setBudget({
      ...budget,
      chapters: updatedChapters
    });
    
    recalculateBudget();
  };

  // Update existing item
  const updateItem = (chapterKey, itemId, updatedItem) => {
    const chapter = budget.chapters[chapterKey];
    const itemIndex = chapter.items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) return;
    
    const updatedItems = [...chapter.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      ...updatedItem,
      VALOR: calculateItemValue(updatedItem.QTD, updatedItem.VALOR_UNITARIO)
    };
    
    const updatedChapters = {
      ...budget.chapters,
      [chapterKey]: {
        ...chapter,
        items: updatedItems
      }
    };
    
    setBudget({
      ...budget,
      chapters: updatedChapters
    });
    
    recalculateBudget();
  };

  // Delete item
  const deleteItem = (chapterKey, itemId) => {
    const chapter = budget.chapters[chapterKey];
    const updatedItems = chapter.items.filter(item => item.id !== itemId);
    
    const updatedChapters = {
      ...budget.chapters,
      [chapterKey]: {
        ...chapter,
        items: updatedItems
      }
    };
    
    setBudget({
      ...budget,
      chapters: updatedChapters
    });
    
    recalculateBudget();
  };

  // Add new chapter
  const addChapter = (chapterKey, header) => {
    if (budget.chapters[chapterKey]) return false; // Chapter already exists
    
    const updatedChapters = {
      ...budget.chapters,
      [chapterKey]: {
        header,
        items: []
      }
    };
    
    setBudget({
      ...budget,
      chapters: updatedChapters
    });
    
    return true;
  };

  // Update margin percentage
  const updateMarginPercentage = (percentage) => {
    const updatedControleInterno = { ...budget.CONTROLE_INTERNO };
    updatedControleInterno.VENDA.items[0].Margem_Percentual = percentage;
    
    setBudget({
      ...budget,
      CONTROLE_INTERNO: updatedControleInterno
    });
    
    recalculateBudget();
  };

  // Update diverse costs
  const updateDiverseCosts = (diverseCosts) => {
    const updatedControleInterno = { ...budget.CONTROLE_INTERNO };
    updatedControleInterno.DIVERSOS.items[0] = {
      ...updatedControleInterno.DIVERSOS.items[0],
      ...diverseCosts
    };
    
    setBudget({
      ...budget,
      CONTROLE_INTERNO: updatedControleInterno
    });
    
    recalculateBudget();
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  // Add new project
  const addProject = (projectData) => {
    const projectId = `PROJ-${String(projects.length + 1).padStart(3, '0')}`;
    const newProject = {
      id: projectId,
      name: projectData.name,
      client: projectData.client,
      description: projectData.description,
      type: projectData.type,
      startDate: projectData.startDate,
      currency: projectData.currency,
      active: false,
      budget: JSON.parse(JSON.stringify(initialBudget)) // Deep copy
    };
    
    // Update all projects (set previous active to false)
    const updatedProjects = projects.map(project => ({
      ...project,
      active: false
    }));
    
    setProjects([...updatedProjects, newProject]);
    return projectId;
  };
  
  // Set active project
  const setActiveProjectById = (projectId) => {
    setActiveProject(projectId);
    
    // Update projects active state
    const updatedProjects = projects.map(project => ({
      ...project,
      active: project.id === projectId
    }));
    
    setProjects(updatedProjects);
    
    // Set the active project's budget
    const activeProjectData = projects.find(project => project.id === projectId);
    if (activeProjectData) {
      setBudget(activeProjectData.budget);
    }
  };

  return (
    <BudgetContext.Provider
      value={{
        // Budget data and operations
        budget,
        activeChapter,
        setActiveChapter,
        showEditItemModal,
        setShowEditItemModal,
        showNewChapterModal,
        setShowNewChapterModal,
        currentItem,
        setCurrentItem,
        addItem,
        updateItem,
        deleteItem,
        addChapter,
        calculateChapterTotal,
        calculateTotalMaterialCost,
        updateMarginPercentage,
        updateDiverseCosts,
        formatCurrency,
        recalculateBudget,
        
        // Project management
        projects,
        activeProject,
        addProject,
        setActiveProjectById
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetContext;
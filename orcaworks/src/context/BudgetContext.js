import React, { createContext, useState, useContext, useEffect } from 'react';
import initialBudget from '../data/initialBudget';
import { getProjects } from '../services/projects/getProjects';
import { createProject } from '../services/projects/createProject';
import { getCompleteProject } from '../services/projects/getCompleteProject';
import { budgetService } from '../services/budgetService';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const BudgetContext = createContext();

export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [budget, setBudget] = useState({
    project: {
      name: 'Nenhum Projeto Selecionado',
      client: '',
      date_created: new Date().toISOString(),
      last_modified: new Date().toISOString(),
      status: "em_andamento"
    },
    chapters: {},
    CONTROLE_INTERNO: {
      VENDA: {
        header: "Venda",
        items: [
          {
            Custo_Seco_Euro: 0,
            Custo_Total_Euro: 0,
            Margem_Percentual: 30.00,
            Venda_Euro: 0,
            Margem_Euro: 0
          }
        ]
      },
      DIVERSOS: {
        header: "Diversos",
        items: [{ Alimentacao_Euro: 0, Passagens_Euro: 0, Outros_Euro: 0 }]
      },
      SUB_EMPREITEIROS: {
        header: "Sub-Empreiteiros",
        items: [{ Fornecedor_1_Euro: 0, Total_Euro: 0 }]
      },
      AMORTIZACOES: {
        header: "Amortizações",
        items: [{ tipo: "Material", Total_Euro: 0 }]
      }
    },
    configuracoes: {
      moeda: 'EUR',
      formato_numero: 'PT-PT',
      casas_decimais: 2,
      mostrar_todos_capitulos: true,
      margem_padrao: 30.00
    }
  });
  const [activeChapter, setActiveChapter] = useState('CAR 1');
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [showNewChapterModal, setShowNewChapterModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [operationInProgress, setOperationInProgress] = useState(false);
  const [error, setError] = useState(null);
  
  // Load user projects when user is authenticated
  useEffect(() => {
    const loadProjects = async () => {
      if (!user) {
        setProjects([]);
        setBudget(initialBudget);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const { data, error } = await getProjects();
        
        if (error) {
          console.error('Error loading projects:', error);
          setError(error.message);
          setLoading(false);
          return;
        }
        
        if (data && data.length > 0) {
          const projectsWithActive = data.map((project, index) => ({
            ...project,
            active: index === 0 // First project is active by default
          }));
          
          setProjects(projectsWithActive);
          setActiveProject(projectsWithActive[0].id);
          
          // Load the first project's budget
          await loadProjectBudget(projectsWithActive[0].id);
        } else {
          // If no projects, use default budget
          setProjects([]);
          setBudget(initialBudget);
        }
      } catch (err) {
        console.error('Unexpected error loading projects:', err);
        setError('Failed to load projects. Please try again later.');
      }
      
      setLoading(false);
    };
    
    loadProjects();
  }, [user]);
  
  // Setup subscription to update projects list and budget data in real-time
  useEffect(() => {
    if (!user) return;
    
    const setupSubscription = async () => {
      try {
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('organization_id')
          .eq('id', user.id)
          .single();
        
        if (profileError || !userProfile?.organization_id) {
          console.error('Error loading organization information for subscription:', profileError);
          return;
        }
        
        const organization_id = userProfile.organization_id;
        
        // Create a channel for all subscriptions
        const channel = supabase.channel('realtime-updates');
        
        // Subscribe to project changes
        channel.on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'projects',
          filter: `organization_id=eq.${organization_id}`
        }, async (payload) => {
          console.log('Projects change received!', payload);
          
          // Reload the projects
          const { data } = await getProjects();
          if (data) {
            const projectsWithActive = data.map(project => ({
              ...project,
              active: project.id === activeProject
            }));
            
            setProjects(projectsWithActive);
          }
        });
        
        // Subscribe to chapter changes if there's an active project
        if (activeProject) {
          channel.on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'chapters',
            filter: `project_id=eq.${activeProject}`
          }, async (payload) => {
            console.log('Chapter change received!', payload);
            // Reload the complete project data
            await loadProjectBudget(activeProject);
          });
          
          // Subscribe to budget items changes
          channel.on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'budget_items'
          }, async (payload) => {
            console.log('Budget item change received!', payload);
            // Get the chapter id from the payload
            const chapterId = payload.new?.chapter_id || payload.old?.chapter_id;
            
            if (chapterId) {
              // Check if this chapter belongs to the current project
              const { data: chapter } = await supabase
                .from('chapters')
                .select('project_id')
                .eq('id', chapterId)
                .single();
                
              if (chapter && chapter.project_id === activeProject) {
                // Reload the complete project data
                await loadProjectBudget(activeProject);
              }
            }
          });
          
          // Subscribe to internal control changes
          channel.on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'internal_control',
            filter: `project_id=eq.${activeProject}`
          }, async (payload) => {
            console.log('Internal control change received!', payload);
            // Reload the complete project data
            await loadProjectBudget(activeProject);
          });
        }
        
        // Subscribe to the channel
        channel.subscribe(status => {
          console.log('Realtime subscription status:', status);
        });
        
        return () => {
          channel.unsubscribe();
        };
      } catch (err) {
        console.error('Error setting up subscriptions:', err);
      }
    };
    
    setupSubscription();
  }, [user, activeProject]);
  
  // Load complete project data including budget
  const loadProjectBudget = async (projectId) => {
    try {
      const { data, error } = await getCompleteProject(projectId);
      
      if (error) {
        console.error('Error loading project budget:', error);
        setError(error.message);
        return;
      }
      
      setBudget(data.budget);
      
      // Set first chapter as active
      const chapterKeys = Object.keys(data.budget.chapters);
      if (chapterKeys.length > 0) {
        setActiveChapter(chapterKeys[0]);
      }
      
    } catch (err) {
      console.error('Unexpected error loading project budget:', err);
      setError('Failed to load project data. Please try again later.');
    }
  };

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
    
    // Recalculate total costs - using item-level real costs when available
    let custoSeco = 0;
    let itemRealCostTotal = 0;
    let itemsWithRealCost = 0;
    
    // Calculate costs considering items with internal_control data
    Object.keys(updatedChapters).forEach(chapterKey => {
      updatedChapters[chapterKey].items.forEach(item => {
        custoSeco += item.VALOR;
        
        // If item has real cost data, use it for internal calculations
        if (item.internal_control && item.internal_control.real_cost) {
          const realCost = parseFloat(item.internal_control.real_cost);
          if (!isNaN(realCost)) {
            itemRealCostTotal += realCost;
            itemsWithRealCost++;
          }
        }
      });
    });
    
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
    
    // Use real costs when available for calculations
    const adjustedCustoSeco = itemsWithRealCost > 0 ? itemRealCostTotal : custoSeco;
    
    // Calculate total cost
    const custoTotal = adjustedCustoSeco + diversosTotal + subEmpreiteirosTotal + amortizacoesTotal;
    
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
    
    // If connected to Supabase, update internal control data
    if (user && activeProject) {
      budgetService.updateInternalControl(
        activeProject, 
        'VENDA', 
        updatedControleInterno.VENDA
      );
    }
  };

  // Add new item to chapter
  const addItem = async (chapterKey, newItem) => {
    const chapter = budget.chapters[chapterKey];
    
    setOperationInProgress(true);
    
    // Create item for immediate UI update
    const localItemId = `${chapterKey.split(' ')[1]}-${chapter.items.length + 1}`;
    const calculatedValue = calculateItemValue(newItem.QTD, newItem.VALOR_UNITARIO);
    
    const localNewItem = {
      ...newItem,
      id: localItemId,
      VALOR: calculatedValue
    };
    
    const updatedItems = [...chapter.items, localNewItem];
    
    const updatedChapters = {
      ...budget.chapters,
      [chapterKey]: {
        ...chapter,
        items: updatedItems
      }
    };
    
    // Update local state immediately
    setBudget({
      ...budget,
      chapters: updatedChapters
    });
    
    // If connected to Supabase, persist to database
    if (user && activeProject) {
      try {
        // Find the chapter ID
        const { data: chapters, error: chaptersError } = await supabase
          .from('chapters')
          .select('id')
          .eq('project_id', activeProject)
          .eq('chapter_key', chapterKey)
          .single();
        
        if (chaptersError) {
          console.error('Error finding chapter:', chaptersError);
          // Revert local state
          const revertedItems = chapter.items.filter(item => item.id !== localItemId);
          
          const revertedChapters = {
            ...budget.chapters,
            [chapterKey]: {
              ...chapter,
              items: revertedItems
            }
          };
          
          setBudget({
            ...budget,
            chapters: revertedChapters
          });
          
          setOperationInProgress(false);
          return;
        }
        
        // Add item to database
        const { data, error } = await budgetService.createItem(chapters.id, newItem);
        
        if (error) {
          console.error('Error adding item to database:', error);
          // Revert local state
          const revertedItems = chapter.items.filter(item => item.id !== localItemId);
          
          const revertedChapters = {
            ...budget.chapters,
            [chapterKey]: {
              ...chapter,
              items: revertedItems
            }
          };
          
          setBudget({
            ...budget,
            chapters: revertedChapters
          });
          
          setOperationInProgress(false);
          return;
        }
        
        // If we have a server-generated ID, update the local item
        if (data && data.id && data.id !== localItemId) {
          const updatedItemsWithServerId = chapter.items.map(item => 
            item.id === localItemId ? { ...item, id: data.id } : item
          );
          
          const updatedChaptersWithServerId = {
            ...budget.chapters,
            [chapterKey]: {
              ...chapter,
              items: updatedItemsWithServerId
            }
          };
          
          setBudget({
            ...budget,
            chapters: updatedChaptersWithServerId
          });
        }
        
        recalculateBudget();
        setOperationInProgress(false);
      } catch (err) {
        console.error('Unexpected error adding item:', err);
        setOperationInProgress(false);
      }
    } else {
      // If not connected to Supabase, just update local state
      recalculateBudget();
      setOperationInProgress(false);
    }
  };

  // Update existing item
  const updateItem = async (chapterKey, itemId, updatedItem) => {
    const chapter = budget.chapters[chapterKey];
    const itemIndex = chapter.items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) return;
    
    // If connected to Supabase, persist to database
    if (user && activeProject) {
      try {
        // Find the database ID of this item
        const { data: chapters, error: chaptersError } = await supabase
          .from('chapters')
          .select('id')
          .eq('project_id', activeProject)
          .eq('chapter_key', chapterKey)
          .single();
        
        if (chaptersError) {
          console.error('Error finding chapter:', chaptersError);
          return;
        }
        
        const { data: items, error: itemsError } = await supabase
          .from('budget_items')
          .select('id')
          .eq('chapter_id', chapters.id)
          .eq('position', itemIndex) // Using position to match
          .single();
        
        if (itemsError) {
          console.error('Error finding item:', itemsError);
          return;
        }
        
        // Update item in database
        const { error } = await budgetService.updateItem(items.id, updatedItem);
        
        if (error) {
          console.error('Error updating item in database:', error);
          return;
        }
        
        // Also update local state for immediate UI feedback
        // This ensures UI is updated even before the Supabase subscription fires
        const calculatedValue = calculateItemValue(updatedItem.QTD, updatedItem.VALOR_UNITARIO);
        
        const updatedItems = [...chapter.items];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          ...updatedItem,
          VALOR: calculatedValue
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
      } catch (err) {
        console.error('Unexpected error updating item:', err);
      }
    } else {
      // If not connected to Supabase, just update local state
      const calculatedValue = calculateItemValue(updatedItem.QTD, updatedItem.VALOR_UNITARIO);
      
      const updatedItems = [...chapter.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        ...updatedItem,
        VALOR: calculatedValue
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
    }
  };

  // Delete item
  const deleteItem = async (chapterKey, itemId) => {
    const chapter = budget.chapters[chapterKey];
    const itemIndex = chapter.items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) return;
    
    // If connected to Supabase, persist to database
    if (user && activeProject) {
      try {
        // Find the database ID of this item
        const { data: chapters, error: chaptersError } = await supabase
          .from('chapters')
          .select('id')
          .eq('project_id', activeProject)
          .eq('chapter_key', chapterKey)
          .single();
        
        if (chaptersError) {
          console.error('Error finding chapter:', chaptersError);
          return;
        }
        
        const { data: items, error: itemsError } = await supabase
          .from('budget_items')
          .select('id')
          .eq('chapter_id', chapters.id)
          .eq('position', itemIndex) // Using position to match
          .single();
        
        if (itemsError) {
          console.error('Error finding item:', itemsError);
          return;
        }
        
        // Delete item from database
        const { error } = await budgetService.deleteItem(items.id);
        
        if (error) {
          console.error('Error deleting item from database:', error);
          return;
        }
        
        // Also update local state for immediate UI feedback
        // This ensures UI is updated even before the Supabase subscription fires
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
      } catch (err) {
        console.error('Unexpected error deleting item:', err);
      }
    } else {
      // If not connected to Supabase, just update local state
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
    }
  };

  // Add new chapter
  const addChapter = async (chapterKey, header) => {
    if (budget.chapters[chapterKey]) return false; // Chapter already exists
    
    setOperationInProgress(true);
    
    // If connected to Supabase, persist to database
    if (user && activeProject) {
      try {
        // Also update local state for immediate UI feedback
        // This ensures UI is updated even before the database operation completes
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
        
        const { error } = await budgetService.createChapter(activeProject, chapterKey, header);
        
        if (error) {
          console.error('Error adding chapter to database:', error);
          // Revert the local state change
          const revertedChapters = { ...budget.chapters };
          delete revertedChapters[chapterKey];
          
          setBudget({
            ...budget,
            chapters: revertedChapters
          });
          
          setOperationInProgress(false);
          return false;
        }
        
        setOperationInProgress(false);
        return true;
      } catch (err) {
        console.error('Unexpected error adding chapter:', err);
        setOperationInProgress(false);
        return false;
      }
    } else {
      // If not connected to Supabase, just update local state
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
      
      setOperationInProgress(false);
      return true;
    }
  };

  // Update margin percentage
  const updateMarginPercentage = async (percentage) => {
    // Update local state first for immediate UI feedback
    const updatedControleInterno = { ...budget.CONTROLE_INTERNO };
    updatedControleInterno.VENDA.items[0].Margem_Percentual = percentage;
    
    setBudget({
      ...budget,
      CONTROLE_INTERNO: updatedControleInterno
    });
    
    // If connected to Supabase, persist to database
    if (user && activeProject) {
      try {
        const { error } = await budgetService.updateInternalControl(
          activeProject,
          'VENDA',
          updatedControleInterno.VENDA
        );
        
        if (error) {
          console.error('Error updating margin in database:', error);
          // Could revert local state here if needed
        }
      } catch (err) {
        console.error('Unexpected error updating margin:', err);
      }
    }
    
    recalculateBudget();
  };

  // Update diverse costs
  const updateDiverseCosts = async (diverseCosts) => {
    // Update local state first for immediate UI feedback
    const updatedControleInterno = { ...budget.CONTROLE_INTERNO };
    updatedControleInterno.DIVERSOS.items[0] = {
      ...updatedControleInterno.DIVERSOS.items[0],
      ...diverseCosts
    };
    
    setBudget({
      ...budget,
      CONTROLE_INTERNO: updatedControleInterno
    });
    
    // If connected to Supabase, persist to database
    if (user && activeProject) {
      try {
        const { error } = await budgetService.updateInternalControl(
          activeProject,
          'DIVERSOS',
          updatedControleInterno.DIVERSOS
        );
        
        if (error) {
          console.error('Error updating diverse costs in database:', error);
          // Could revert local state here if needed
        }
      } catch (err) {
        console.error('Unexpected error updating diverse costs:', err);
      }
    }
    
    recalculateBudget();
  };

  // Format currency
  const formatCurrency = (value) => {
    const currency = budget?.configuracoes?.moeda || 'EUR';
    const locale = budget?.configuracoes?.formato_numero || 'pt-PT';
    const decimals = budget?.configuracoes?.casas_decimais || 2;
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals
    }).format(value);
  };
  
  // Add new project
  const addProject = async (projectData) => {
    if (!user) return null;
    
    try {
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching user profile for organization:', profileError);
        setError('Failed to get organization information. Please try again later.');
        return null;
      }
      
      if (!userProfile.organization_id) {
        setError('No organization found. Please complete your profile setup first.');
        return null;
      }
      
      const organization_id = userProfile.organization_id;
      // Use organization_id in project creation
      const projectPayload = {
        ...projectData,
        organization_id
      };
      
      const { data, error } = await createProject(projectPayload);
      
      if (error) {
        console.error('Error creating project:', error);
        setError(error.message);
        return null;
      }
      
      // Add the project to local state for immediate UI feedback
      const newProject = {
        ...data,
        active: true // Make the new project active
      };
      
      // Update other projects to be inactive
      const updatedProjects = projects.map(project => ({
        ...project,
        active: false
      }));
      
      setProjects([...updatedProjects, newProject]);
      setActiveProject(newProject.id);
      
      // Load the new project's budget
      await loadProjectBudget(newProject.id);
      
      // The Supabase subscription in the useEffect will handle updating the
      // projects list when the server confirms the creation, ensuring data consistency
      
      return newProject.id;
    } catch (err) {
      console.error('Unexpected error creating project:', err);
      setError('Failed to create project. Please try again later.');
      return null;
    }
  };
  
  // Set active project
  const setActiveProjectById = async (projectId) => {
    if (!projectId) return;
    
    setActiveProject(projectId);
    
    // Update projects active state
    const updatedProjects = projects.map(project => ({
      ...project,
      active: project.id === projectId
    }));
    
    setProjects(updatedProjects);
    
    // Load the selected project's budget
    await loadProjectBudget(projectId);
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
        setActiveProjectById,
        
        // Status
        loading,
        operationInProgress,
        error
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetContext;
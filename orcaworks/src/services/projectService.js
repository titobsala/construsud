import { supabase } from '../lib/supabase';

export const projectService = {
  // Fetch all projects for the current user
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      return { error };
    }
    
    return { data };
  },
  
  // Fetch a single project by ID
  async getProject(id) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching project:', error);
      return { error };
    }
    
    return { data };
  },
  
  // Create a new project
  async createProject(projectData) {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating project:', error);
      return { error };
    }
    
    // Create project settings
    const { error: settingsError } = await supabase
      .from('project_settings')
      .insert([{
        project_id: data.id,
        currency: projectData.currency || 'EUR',
        number_format: 'PT-PT',
        decimal_places: 2,
        show_all_chapters: true,
        default_margin: 30.00,
      }]);
    
    if (settingsError) {
      console.error('Error creating project settings:', settingsError);
      return { error: settingsError };
    }
    
    // Initialize internal control sections
    const internalControlData = [
      {
        project_id: data.id,
        type: 'VENDA',
        data: {
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
        }
      },
      {
        project_id: data.id,
        type: 'DIVERSOS',
        data: {
          header: "Diversos",
          items: [
            {
              Alimentacao_Euro: 0,
              Passagens_Euro: 0,
              Outros_Euro: 0
            }
          ]
        }
      },
      {
        project_id: data.id,
        type: 'SUB_EMPREITEIROS',
        data: {
          header: "Sub-Empreiteiros",
          items: [
            {
              Fornecedor_1_Euro: 0,
              Fornecedor_2_Euro: 0,
              Fornecedor_3_Euro: 0,
              Fornecedor_4_Euro: 0,
              Fornecedor_5_Euro: 0,
              Total_Euro: 0
            }
          ]
        }
      },
      {
        project_id: data.id,
        type: 'AMORTIZACOES',
        data: {
          header: "Amortizações",
          items: [
            {
              tipo: "Material",
              Total_Euro: 0
            },
            {
              tipo: "Mão de Obra",
              Total_Euro: 0,
              E_O_A: "E",
              Duracao_Horas: 0,
              Total_Euro_Mao_de_Obra: 0
            }
          ]
        }
      }
    ];
    
    for (const controlItem of internalControlData) {
      const { error: controlError } = await supabase
        .from('internal_control')
        .insert([controlItem]);
      
      if (controlError) {
        console.error(`Error creating internal control (${controlItem.type}):`, controlError);
        return { error: controlError };
      }
    }
    
    return { data };
  },
  
  // Update a project
  async updateProject(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating project:', error);
      return { error };
    }
    
    return { data };
  },
  
  // Delete a project
  async deleteProject(id) {
    // Delete related data first (cascade doesn't work with RLS)
    // 1. Get all chapters for this project
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('id')
      .eq('project_id', id);
    
    if (chaptersError) {
      console.error('Error fetching chapters for deletion:', chaptersError);
      return { error: chaptersError };
    }
    
    // 2. Delete all budget items for each chapter
    for (const chapter of chapters) {
      const { error: itemsError } = await supabase
        .from('budget_items')
        .delete()
        .eq('chapter_id', chapter.id);
      
      if (itemsError) {
        console.error('Error deleting budget items:', itemsError);
        return { error: itemsError };
      }
    }
    
    // 3. Delete all chapters
    const { error: chapterDeleteError } = await supabase
      .from('chapters')
      .delete()
      .eq('project_id', id);
    
    if (chapterDeleteError) {
      console.error('Error deleting chapters:', chapterDeleteError);
      return { error: chapterDeleteError };
    }
    
    // 4. Delete internal control data
    const { error: controlDeleteError } = await supabase
      .from('internal_control')
      .delete()
      .eq('project_id', id);
    
    if (controlDeleteError) {
      console.error('Error deleting internal control data:', controlDeleteError);
      return { error: controlDeleteError };
    }
    
    // 5. Delete project settings
    const { error: settingsDeleteError } = await supabase
      .from('project_settings')
      .delete()
      .eq('project_id', id);
    
    if (settingsDeleteError) {
      console.error('Error deleting project settings:', settingsDeleteError);
      return { error: settingsDeleteError };
    }
    
    // 6. Finally delete the project
    const { error: projectDeleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (projectDeleteError) {
      console.error('Error deleting project:', projectDeleteError);
      return { error: projectDeleteError };
    }
    
    return { success: true };
  },
  
  // Fetch the complete project data (project + chapters + items + settings + internal control)
  async getCompleteProject(id) {
    // Fetch the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (projectError) {
      console.error('Error fetching project:', projectError);
      return { error: projectError };
    }
    
    // Fetch project settings
    const { data: settings, error: settingsError } = await supabase
      .from('project_settings')
      .select('*')
      .eq('project_id', id)
      .single();
    
    if (settingsError && settingsError.code !== 'PGRST116') { // Ignore "no rows returned" error
      console.error('Error fetching project settings:', settingsError);
      return { error: settingsError };
    }
    
    // Fetch chapters
    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('*')
      .eq('project_id', id)
      .order('position', { ascending: true });
    
    if (chaptersError) {
      console.error('Error fetching chapters:', chaptersError);
      return { error: chaptersError };
    }
    
    // Fetch budget items for each chapter
    const chaptersWithItems = {};
    
    for (const chapter of chapters) {
      const { data: items, error: itemsError } = await supabase
        .from('budget_items')
        .select('*')
        .eq('chapter_id', chapter.id)
        .order('position', { ascending: true });
      
      if (itemsError) {
        console.error('Error fetching budget items:', itemsError);
        return { error: itemsError };
      }
      
      // Transform items to match the existing data structure
      const transformedItems = items.map(item => ({
        id: item.id,
        MATERIAL: item.material,
        UNIDADE: item.unit,
        QTD: item.quantity,
        VALOR_UNITARIO: item.unit_price,
        VALOR: item.total_value
      }));
      
      chaptersWithItems[chapter.chapter_key] = {
        header: chapter.header,
        items: transformedItems
      };
    }
    
    // Fetch internal control data
    const { data: internalControl, error: controlError } = await supabase
      .from('internal_control')
      .select('*')
      .eq('project_id', id);
    
    if (controlError) {
      console.error('Error fetching internal control data:', controlError);
      return { error: controlError };
    }
    
    // Transform internal control data to match existing structure
    const controleInterno = {};
    
    internalControl.forEach(control => {
      controleInterno[control.type] = control.data;
    });
    
    // Construct the complete budget object
    const completeProject = {
      id: project.id,
      name: project.name,
      client: project.client,
      description: project.description,
      type: project.type,
      startDate: project.start_date,
      currency: project.currency,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      budget: {
        project: {
          id: project.id,
          name: project.name,
          client: project.client,
          date_created: project.created_at,
          last_modified: project.updated_at,
          status: "em_andamento"
        },
        chapters: chaptersWithItems,
        CONTROLE_INTERNO: controleInterno,
        configuracoes: settings ? {
          moeda: settings.currency,
          formato_numero: settings.number_format,
          casas_decimais: settings.decimal_places,
          mostrar_todos_capitulos: settings.show_all_chapters,
          margem_padrao: settings.default_margin
        } : {
          moeda: 'EUR',
          formato_numero: 'PT-PT',
          casas_decimais: 2,
          mostrar_todos_capitulos: true,
          margem_padrao: 30.00
        }
      }
    };
    
    return { data: completeProject };
  }
};
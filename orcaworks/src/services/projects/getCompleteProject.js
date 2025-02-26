// src/services/projects/getCompleteProject.js
import { supabase } from '../../lib/supabase';

/**
 * Fetch the complete project data (project + chapters + items + settings + internal control)
 * @param {string} id - Project ID
 * @returns {Promise<{data?: any, error?: Error}>}
 */
export const getCompleteProject = async (id) => {
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
    start_date: project.start_date,
    currency: project.currency,
    created_at: project.created_at,
    updated_at: project.updated_at,
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
};
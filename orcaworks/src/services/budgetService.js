import { supabase } from '../lib/supabase';

export const budgetService = {
  // Create a new chapter
  async createChapter(projectId, chapterKey, header) {
    // Get the highest position value to place this chapter at the end
    const { data: chapters, error: fetchError } = await supabase
      .from('chapters')
      .select('position')
      .eq('project_id', projectId)
      .order('position', { ascending: false })
      .limit(1);
    
    if (fetchError) {
      console.error('Error fetching chapters for position:', fetchError);
      return { error: fetchError };
    }
    
    const position = chapters.length > 0 ? chapters[0].position + 1 : 0;
    
    const { data, error } = await supabase
      .from('chapters')
      .insert([{
        project_id: projectId,
        chapter_key: chapterKey,
        header,
        position
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating chapter:', error);
      return { error };
    }
    
    return { data };
  },
  
  // Update a chapter
  async updateChapter(chapterId, updates) {
    const { data, error } = await supabase
      .from('chapters')
      .update(updates)
      .eq('id', chapterId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating chapter:', error);
      return { error };
    }
    
    return { data };
  },
  
  // Delete a chapter
  async deleteChapter(chapterId) {
    // First, get the chapter to know its project and position
    const { data: chapter, error: fetchError } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching chapter for deletion:', fetchError);
      return { error: fetchError };
    }
    
    // Delete all budget items in this chapter
    const { error: itemsError } = await supabase
      .from('budget_items')
      .delete()
      .eq('chapter_id', chapterId);
    
    if (itemsError) {
      console.error('Error deleting budget items:', itemsError);
      return { error: itemsError };
    }
    
    // Delete the chapter
    const { error: deleteError } = await supabase
      .from('chapters')
      .delete()
      .eq('id', chapterId);
    
    if (deleteError) {
      console.error('Error deleting chapter:', deleteError);
      return { error: deleteError };
    }
    
    // Update positions of remaining chapters
    const { error: updateError } = await supabase
      .from('chapters')
      .update({ position: supabase.raw('position - 1') })
      .eq('project_id', chapter.project_id)
      .gt('position', chapter.position);
    
    if (updateError) {
      console.error('Error updating chapter positions:', updateError);
      return { error: updateError };
    }
    
    return { success: true };
  },
  
  // Reorder chapters
  async reorderChapters(projectId, chapterOrder) {
    // chapterOrder should be an array of chapter IDs in the new order
    for (let i = 0; i < chapterOrder.length; i++) {
      const { error } = await supabase
        .from('chapters')
        .update({ position: i })
        .eq('id', chapterOrder[i])
        .eq('project_id', projectId);
      
      if (error) {
        console.error('Error reordering chapters:', error);
        return { error };
      }
    }
    
    return { success: true };
  },
  
  // Create a new budget item
  async createItem(chapterId, itemData) {
    // Get the chapter to validate project access and determine chapter_key
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .single();
    
    if (chapterError) {
      console.error('Error fetching chapter for item creation:', chapterError);
      return { error: chapterError };
    }
    
    // Get the highest position value to place this item at the end
    const { data: items, error: fetchError } = await supabase
      .from('budget_items')
      .select('position')
      .eq('chapter_id', chapterId)
      .order('position', { ascending: false })
      .limit(1);
    
    if (fetchError) {
      console.error('Error fetching items for position:', fetchError);
      return { error: fetchError };
    }
    
    const position = items.length > 0 ? items[0].position + 1 : 0;
    
    // Create a unique item ID in the format used by the app (e.g., "1-1")
    const itemNumber = position + 1;
    const itemId = `${chapter.chapter_key.split(' ')[1]}-${itemNumber}`;
    
    // Calculate the total value
    const totalValue = itemData.QTD * itemData.VALOR_UNITARIO;
    
    // Prepare internal control data if it exists
    const internalControlData = itemData.internal_control ? {
      internal_control: itemData.internal_control
    } : {};
    
    const { data, error } = await supabase
      .from('budget_items')
      .insert([{
        chapter_id: chapterId,
        item: itemData.ITEM,
        unit: itemData.UNIDADE,
        quantity: itemData.QTD,
        unit_price: itemData.VALOR_UNITARIO,
        total_value: totalValue,
        position,
        ...internalControlData
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating budget item:', error);
      return { error };
    }
    
    // Transform the item to match the app's data structure
    const transformedItem = {
      id: itemId,
      ITEM: data.item,
      UNIDADE: data.unit,
      QTD: data.quantity,
      VALOR_UNITARIO: data.unit_price,
      VALOR: data.total_value,
      internal_control: data.internal_control
    };
    
    return { data: transformedItem };
  },
  
  // Update a budget item
// [MermaidChart: c23db52b-e0cf-4e90-87b3-0d4559baad52]
// [MermaidChart: c23db52b-e0cf-4e90-87b3-0d4559baad52]
// [MermaidChart: 6bf32b1a-a570-444b-b0be-660ebe749576]
// [MermaidChart: 6bf32b1a-a570-444b-b0be-660ebe749576]
// [MermaidChart: 6bf32b1a-a570-444b-b0be-660ebe749576]
// [MermaidChart: c23db52b-e0cf-4e90-87b3-0d4559baad52]
  async updateItem(itemId, updates) {
    // Calculate the total value
    const totalValue = updates.QTD * updates.VALOR_UNITARIO;
    
    // Prepare update data with internal control if provided
    const updateData = {
      item: updates.ITEM,
      unit: updates.UNIDADE,
      quantity: updates.QTD,
      unit_price: updates.VALOR_UNITARIO,
      total_value: totalValue
    };
    
    // Add internal control data if it exists
    if (updates.internal_control) {
      updateData.internal_control = updates.internal_control;
    }
    
    const { data, error } = await supabase
      .from('budget_items')
      .update(updateData)
      .eq('id', itemId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating budget item:', error);
      return { error };
    }
    
    // Transform the item to match the app's data structure
    const transformedItem = {
      id: data.id,
      ITEM: data.item,
      UNIDADE: data.unit,
      QTD: data.quantity,
      VALOR_UNITARIO: data.unit_price,
      VALOR: data.total_value,
      internal_control: data.internal_control
    };
    
    return { data: transformedItem };
  },
  
  // Delete a budget item
  async deleteItem(itemId) {
    // First, get the item to know its chapter and position
    const { data: item, error: fetchError } = await supabase
      .from('budget_items')
      .select('*')
      .eq('id', itemId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching item for deletion:', fetchError);
      return { error: fetchError };
    }
    
    // Delete the item
    const { error: deleteError } = await supabase
      .from('budget_items')
      .delete()
      .eq('id', itemId);
    
    if (deleteError) {
      console.error('Error deleting budget item:', deleteError);
      return { error: deleteError };
    }
    
    // Update positions of remaining items
    const { error: updateError } = await supabase
      .from('budget_items')
      .update({ position: supabase.raw('position - 1') })
      .eq('chapter_id', item.chapter_id)
      .gt('position', item.position);
    
    if (updateError) {
      console.error('Error updating item positions:', updateError);
      return { error: updateError };
    }
    
    return { success: true };
  },
  
  // Reorder budget items within a chapter
  async reorderItems(chapterId, itemOrder) {
    // itemOrder should be an array of item IDs in the new order
    for (let i = 0; i < itemOrder.length; i++) {
      const { error } = await supabase
        .from('budget_items')
        .update({ position: i })
        .eq('id', itemOrder[i])
        .eq('chapter_id', chapterId);
      
      if (error) {
        console.error('Error reordering items:', error);
        return { error };
      }
    }
    
    return { success: true };
  },
  
  // Update internal control data
  async updateInternalControl(projectId, type, data) {
    const { error } = await supabase
      .from('internal_control')
      .update({ data })
      .eq('project_id', projectId)
      .eq('type', type);
    
    if (error) {
      console.error('Error updating internal control data:', error);
      return { error };
    }
    
    return { success: true };
  },
  
  // Update project settings
  async updateSettings(projectId, settings) {
    const { error } = await supabase
      .from('project_settings')
      .update({
        currency: settings.moeda,
        number_format: settings.formato_numero,
        decimal_places: settings.casas_decimais,
        show_all_chapters: settings.mostrar_todos_capitulos,
        default_margin: settings.margem_padrao
      })
      .eq('project_id', projectId);
    
    if (error) {
      console.error('Error updating project settings:', error);
      return { error };
    }
    
    return { success: true };
  }
};
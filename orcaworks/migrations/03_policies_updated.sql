-- 1. Atualizar políticas restantes da tabela projects
DROP POLICY IF EXISTS "Users can insert their own projects" ON projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON projects;

-- Substituir com uma única política "Access based on organization" (que você já criou)

-- 2. Atualizar políticas para chapters
DROP POLICY IF EXISTS "Users can view chapters in their projects" ON chapters;
DROP POLICY IF EXISTS "Users can insert chapters in their projects" ON chapters;
DROP POLICY IF EXISTS "Users can update chapters in their projects" ON chapters;
DROP POLICY IF EXISTS "Users can delete chapters in their projects" ON chapters;

CREATE POLICY "Access chapters based on organization" ON chapters FOR ALL USING (
  EXISTS (
    SELECT 1 FROM projects
    JOIN profiles ON profiles.organization_id = projects.organization_id
    WHERE projects.id = chapters.project_id
    AND profiles.id = auth.uid()
  )
);

-- 3. Atualizar políticas para budget_items
DROP POLICY IF EXISTS "Users can view items in their projects" ON budget_items;
DROP POLICY IF EXISTS "Users can insert items in their projects" ON budget_items;
DROP POLICY IF EXISTS "Users can update items in their projects" ON budget_items;
DROP POLICY IF EXISTS "Users can delete items in their projects" ON budget_items;

CREATE POLICY "Access budget items based on organization" ON budget_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM chapters
    JOIN projects ON chapters.project_id = projects.id
    JOIN profiles ON profiles.organization_id = projects.organization_id
    WHERE chapters.id = budget_items.chapter_id
    AND profiles.id = auth.uid()
  )
);

-- 4. Atualizar políticas para internal_control
DROP POLICY IF EXISTS "Users can view internal control for their projects" ON internal_control;
DROP POLICY IF EXISTS "Users can insert internal control for their projects" ON internal_control;
DROP POLICY IF EXISTS "Users can update internal control for their projects" ON internal_control;
DROP POLICY IF EXISTS "Users can delete internal control for their projects" ON internal_control;

CREATE POLICY "Access internal control based on organization" ON internal_control FOR ALL USING (
  EXISTS (
    SELECT 1 FROM projects
    JOIN profiles ON profiles.organization_id = projects.organization_id
    WHERE projects.id = internal_control.project_id
    AND profiles.id = auth.uid()
  )
);

-- 5. Atualizar políticas para project_settings
DROP POLICY IF EXISTS "Users can view settings for their projects" ON project_settings;
DROP POLICY IF EXISTS "Users can insert settings for their projects" ON project_settings;
DROP POLICY IF EXISTS "Users can update settings for their projects" ON project_settings;
DROP POLICY IF EXISTS "Users can delete settings for their projects" ON project_settings;

CREATE POLICY "Access project settings based on organization" ON project_settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM projects
    JOIN profiles ON profiles.organization_id = projects.organization_id
    WHERE projects.id = project_settings.project_id
    AND profiles.id = auth.uid()
  )
);
-- Db as for 26/02/2025

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT NOT NULL,
  company TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  client TEXT,
  description TEXT,
  type TEXT,
  start_date DATE,
  currency TEXT DEFAULT 'EUR',
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_key TEXT NOT NULL,
  header TEXT NOT NULL,
  project_id UUID REFERENCES projects NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(project_id, chapter_key)
);

-- Create budget_items table
CREATE TABLE IF NOT EXISTS budget_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material TEXT NOT NULL,
  unit TEXT NOT NULL,
  quantity NUMERIC(12, 2) NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  total_value NUMERIC(12, 2) NOT NULL,
  chapter_id UUID REFERENCES chapters NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create internal_control table
CREATE TABLE IF NOT EXISTS internal_control (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects NOT NULL,
  type TEXT NOT NULL, -- 'VENDA', 'DIVERSOS', 'SUB_EMPREITEIROS', 'AMORTIZACOES'
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(project_id, type)
);

-- Create project_settings table
CREATE TABLE IF NOT EXISTS project_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects NOT NULL,
  currency TEXT DEFAULT 'EUR',
  number_format TEXT DEFAULT 'PT-PT',
  decimal_places INTEGER DEFAULT 2,
  show_all_chapters BOOLEAN DEFAULT TRUE,
  default_margin NUMERIC(5, 2) DEFAULT 30.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(project_id)
);

-- Create RLS (Row Level Security) policies

-- Profiles: users can only read/write their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Projects: users can only read/write their own projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Chapters: users can only read/write chapters in their own projects
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view chapters in their projects"
  ON chapters FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = chapters.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert chapters in their projects"
  ON chapters FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = chapters.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update chapters in their projects"
  ON chapters FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = chapters.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete chapters in their projects"
  ON chapters FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = chapters.project_id
    AND projects.user_id = auth.uid()
  ));

-- Budget items: users can only read/write items in their own projects
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items in their projects"
  ON budget_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM chapters
    JOIN projects ON chapters.project_id = projects.id
    WHERE chapters.id = budget_items.chapter_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert items in their projects"
  ON budget_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM chapters
    JOIN projects ON chapters.project_id = projects.id
    WHERE chapters.id = budget_items.chapter_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update items in their projects"
  ON budget_items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM chapters
    JOIN projects ON chapters.project_id = projects.id
    WHERE chapters.id = budget_items.chapter_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete items in their projects"
  ON budget_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM chapters
    JOIN projects ON chapters.project_id = projects.id
    WHERE chapters.id = budget_items.chapter_id
    AND projects.user_id = auth.uid()
  ));

-- Internal control: users can only read/write their own internal control data
ALTER TABLE internal_control ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view internal control for their projects"
  ON internal_control FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = internal_control.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert internal control for their projects"
  ON internal_control FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = internal_control.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update internal control for their projects"
  ON internal_control FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = internal_control.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete internal control for their projects"
  ON internal_control FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = internal_control.project_id
    AND projects.user_id = auth.uid()
  ));

-- Project settings: users can only read/write settings for their own projects
ALTER TABLE project_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view settings for their projects"
  ON project_settings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_settings.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert settings for their projects"
  ON project_settings FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_settings.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update settings for their projects"
  ON project_settings FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_settings.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete settings for their projects"
  ON project_settings FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = project_settings.project_id
    AND projects.user_id = auth.uid()
  ));

-- Create functions for handling updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers for all tables
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_chapters_updated_at
  BEFORE UPDATE ON chapters
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_budget_items_updated_at
  BEFORE UPDATE ON budget_items
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_internal_control_updated_at
  BEFORE UPDATE ON internal_control
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_project_settings_updated_at
  BEFORE UPDATE ON project_settings
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create trigger for creating user profiles after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
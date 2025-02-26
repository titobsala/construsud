-- Garantir que a extensão uuid-ossp está disponível
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Criar tabela de organizações
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    nif TEXT NOT NULL UNIQUE,
    admin_id UUID REFERENCES auth.users NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Modificar a tabela de perfis
ALTER TABLE profiles 
    ADD COLUMN organization_id UUID REFERENCES organizations,
    ADD COLUMN role TEXT NOT NULL DEFAULT 'member';

-- 3. Atualizar a tabela de projetos
ALTER TABLE projects RENAME COLUMN user_id TO organization_id;
ALTER TABLE projects ALTER COLUMN organization_id SET NOT NULL;

-- 4. Criar tabela de convites
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(organization_id, email)
);

-- 5. Atualizar as políticas de RLS
DROP POLICY IF EXISTS "Users can view their own projects" ON projects;
CREATE POLICY "Access based on organization" ON projects FOR ALL USING (
    EXISTS (
        SELECT 1 
        FROM profiles 
        WHERE profiles.organization_id = projects.organization_id 
        AND profiles.id = auth.uid()
    )
);

-- 6. Update the handle_new_user function to capture company info
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  
  -- If company_name and vat_number are provided in the user metadata,
  -- we will handle organization creation when the user first signs in
  -- This is because we need the user to verify their email first
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
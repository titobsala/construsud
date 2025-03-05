-- Create suppliers table
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  service_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger to update the updated_at field
CREATE TRIGGER set_suppliers_updated_at
BEFORE UPDATE ON suppliers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Create table to relate suppliers to budget items
CREATE TABLE budget_suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  item_id TEXT,  -- NULL for general control
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  value DECIMAL(10, 2) NOT NULL,
  is_override BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger to update the updated_at field
CREATE TRIGGER set_budget_suppliers_updated_at
BEFORE UPDATE ON budget_suppliers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Add indexes for better performance
CREATE INDEX idx_budget_suppliers_budget_id ON budget_suppliers(budget_id);
CREATE INDEX idx_budget_suppliers_supplier_id ON budget_suppliers(supplier_id);
CREATE INDEX idx_budget_suppliers_item_id ON budget_suppliers(item_id);

-- Check and fix the item name issue
-- Verify if the items table has a name column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'budget_items' AND column_name = 'name'
  ) THEN
    ALTER TABLE budget_items ADD COLUMN name TEXT;
  END IF;
END $$;
# Internal Control Module Refactoring - OrçaWorks

## Context

The "OrçaWorks" budgeting system needs improvements to the Internal Control module interface to make it more functional and modern. Currently, the internal control section shows various panels (SALES, MISCELLANEOUS, SUBCONTRACTORS), but in a fixed format, without options to collapse or expand sections, and without the ability to dynamically create new suppliers.

## Modification Requirements

### 1. Collapsible Structure for Internal Control

- Each section of internal control (SALES, MISCELLANEOUS, SUBCONTRACTORS, LABOR) should be individually collapsible
- Implement expansion/contraction buttons for each section
- Maintain expansion/contraction state when navigating between items
- Add smooth animations to improve user experience

### 2. Functionality to Create Suppliers

- In the SUBCONTRACTORS section, add a button to "Create Supplier"
- Implement a modal for supplier registration with:
  - Supplier name (required)
  - Description (optional)
  - Service price (required)
- After creation, the supplier should be added to the list of available suppliers
- **IMPORTANT:** Ensure supplier information is saved to the database so names can be reused across different projects
- Allow editing and deletion of existing suppliers

### 3. Item and Project-wide Visualization

- Each budget item should have its own internal control visualization
- Add a new tab or section for project-wide visualization
- The general view should sum or consolidate data from all items
- Allow fine adjustments to general values without affecting individual items
- Visually highlight where values have been manually adjusted

### 4. Modern and Functional Interface

- Use card design with soft shadows
- Implement section headers with intuitive icons
- Use color coding for positive/negative values or above/below target
- Add explanatory tooltips for complex fields
- Ensure responsiveness across different screen sizes

### 5. Labor Cost Handling

- Keep only the labor cost table as shown in the reference image
- **REMOVE AMORTIZATIONS** section completely
- Labor cost table should include:
  - E/O/A column (Equipment/Other/Auxiliary)
  - Duration (h) column
  - Total (€) column

## Database Verification

- Verify why item names don't appear in the chapter table
- Check if there's a database field for item names that isn't being populated
- Ensure this is fixed in the new implementation

## Necessary Technical Changes

### Data Model Changes

We need to add or modify the following structures:

1. Suppliers Table:
```json
{
  "id": "uuid",
  "name": "string",
  "description": "string?",
  "service_price": "decimal",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

2. Modification to the Internal Control structure:
```json
"INTERNAL_CONTROL": {
  "item_id": "string?",  // null for project-wide control
  "SALES": { /* ... */ },
  "MISCELLANEOUS": { /* ... */ },
  "SUBCONTRACTORS": {
    "header": "Subcontractors",
    "collapsed": false,  // new field for collapse state
    "items": [
      {
        "supplier_id": "uuid",  // reference to supplier
        "value": "decimal",
        "is_override": false  // indicates if the value was manually adjusted
      }
    ]
  },
  "LABOR": {
    "header": "Labor",
    "collapsed": false,  // new field for collapse state
    "items": [
      {
        "e_o_a": "string",  // "E", "O", or "A"
        "duration_hours": "decimal",
        "total_euro": "decimal"
      }
    ]
  }
}
```

### Create SQL Migration

Create a file `20250305_add_suppliers_table.sql` in the `migrations` folder with:

```sql
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
```

## UI Components to Create/Modify

### 1. CollapsibleSection.jsx
Reusable component for collapsible sections.

### 2. SupplierModal.jsx
Modal for creating and editing suppliers.

### 3. InternalControlContainer.jsx
Container component to organize internal controls.

### 4. ProjectInternalControl.jsx
Project-wide view of internal control.

### 5. ItemInternalControl.jsx
Item-specific internal control view.

### 6. LaborCostTable.jsx
Component for displaying and editing labor costs.

## Proposed Interaction Flow

1. User navigates to the Budget tab
2. Selects a specific item or the project-wide view
3. Expands/collapses internal control sections as needed
4. To add a supplier:
   - Clicks the "Create Supplier" button
   - Fills out the form in the modal
   - Confirms creation
5. The supplier appears in the list and can be associated with specific values
6. Totals are automatically recalculated
7. User can toggle between item view and general view
8. Labor costs can be edited directly in the table

## Recommended UX Improvements

1. Visual feedback when expanding/collapsing sections
2. Smooth animations for transitions
3. Explanatory tooltips for technical fields
4. Visual highlighting for manually altered values
5. Option to undo changes (rollback)
6. Confirmation before deleting suppliers
7. Auto-save functionality to prevent data loss
8. Real-time validation for numeric inputs

## Technical Considerations

1. Ensure that expansion/contraction state is persisted
2. Implement form validation
3. Optimize calculations for performance
4. Ensure the structure is easily extensible for future improvements
5. Use memoization techniques to avoid unnecessary renders
6. Implement tests for new functionalities
7. Ensure supplier data is properly stored in the database and can be reused across projects
8. Fix the item name display issue in chapter tables

## Reference UI Example

Based on the provided screenshots, implement a labor cost section that looks like:

```
+-----------------------------+
|       Mão de Obra           |
+------+-----------+----------+
| E/O/A| Duração(h)| Total(€) |
+------+-----------+----------+
|  E   |    0.00   |  0.00 €  |
+------+-----------+----------+
```

Make sure the Item names appear properly in the chapter table view, and verify if there's a database issue causing them not to display currently.

Be precise and follow the best codding conduct

Any questions about the Database it's best ask and check before do anything
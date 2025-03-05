# Construction Budget System Modification

## Context
The current "OrçaWorks" system allows creating construction budgets with chapters (CAR) containing detailed items. The Internal Control functions at the general project level, with aggregated information about sales, miscellaneous expenses, subcontractors, and amortizations.

## Requested Change
Modify the system so that Internal Control is linked to individual items within each chapter, while maintaining the current overview. Add a navigable index in the Internal Control tab that lists all items grouped by chapter.

## Technical Specifications

### 1. New Data Structure
```javascript
{
  "CAR_1": {
    "header": "SURFACE FOUNDATION - B. S.C/BEAM",
    "items": [
      {
        "MATERIAL": "SAND",
        "UNIT": "M³",
        "QTY": "7.33",
        "UNIT_VALUE": "73.96",
        "VALUE": "542.14",
        "internal_control": {
          "real_cost": "520.00",
          "supplier": "Supplier A",
          "item_margin": "25.00",
          "notes": "Material available in stock"
        }
      },
      // Other items with their respective internal controls...
    ]
  },
  // Other chapters...

  // Maintains the overview for the entire project
  "INTERNAL_CONTROL": {
    // Existing data...
  }
}
```

### 2. User Interface
- Modify the Internal Control panel to include an index/navigator on the left
- Use an expandable tree menu that groups items by chapter
- When selecting an item in the index, display its internal control details on the right
- Maintain an "Overview" option to display the internal control of the entire project

### 3. Navigable Index
- Create a hierarchical tree component on the left side of the Internal Control panel
- Structure as:
  - Project Overview
  - CAR 1: SURFACE FOUNDATION
    - SAND
    - WOODEN FORM FOR FOOTING
    - ...
  - CAR 2: EARTHWORK
    - SAND
    - COARSE SAND
    - ...
  - ...

### 4. Editing Flow
- When clicking on an item in the index, load its specific internal control view
- Allow editing of internal control data at the item level
- Automatically update overview calculations when item values are changed
- Add buttons for quick navigation between related items

### 5. Calculations and Aggregations
- The internal controls of items should aggregate to form the totals at the chapter level
- Chapter totals should aggregate to form project totals
- Implement bidirectional calculations: changes at the item level affect totals, and adjustments to totals can be proportionally distributed to items

Implement these modifications while maintaining a cohesive user experience and ensuring that all calculations remain accurate at all levels of the system.
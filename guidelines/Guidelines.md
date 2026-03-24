# design-rules.md

This document serves as the **single source of truth** for design implementation fidelity. It outlines strict rules for layout, behavior, and styling that must be followed when regenerating or expanding this codebase.

## 1. General Implementation Principles

### 1.1. Layout & Sizing
- **Hug vs. Fill**:
    - **Buttons & Chips**: Always **Hug Contents**. Never set fixed widths unless specifically required for a grid.
    - **Inputs & Search Bars**:
        - Default: **Hug Contents** or Fixed Width (e.g., `w-64`).
        - **FORBIDDEN**: Do `width: 100%` or `flex: 1` on search inputs within a toolbar context unless explicitly the main feature of a mobile view.
    - **Cards**: **Fill Container** width in grids, but **Hug Contents** height (let content drive height).

### 1.2. Design Tokens
- **Colors**: **NEVER** hardcode hex values (e.g., `#FFFFFF`, `#000000`). Always use semantic classes:
    - `bg-background`, `bg-card`, `bg-primary`
    - `text-foreground`, `text-muted-foreground`, `text-primary-foreground`
    - `border-border`, `border-input`
- **Spacing**: Use standard tailwind spacing (multiples of 4px). Avoid arbitrary values like `13px`.
- **Radius**: Use `rounded-md`, `rounded-sm`, or `rounded-lg` variables. Do not hardcode pixels.
- **Borders**: 
    - **CRITICAL**: Always use the standard Tailwind `border` class for border width (defaults to 1px).
    - **FORBIDDEN**: Do NOT use arbitrary values like `border-[var(--border-width)]` or `border-[1px]`.
    - **Correct Usage**: `border border-border` for standard borders.
    - **Rationale**: Arbitrary values with CSS variables for border widths may not render properly. Use Tailwind's default `border` class which provides consistent 1px borders.
- **Typography & Fonts**:
    - **Font Faces**: Only use fonts defined in the design system:
        - **Inter**: Default font for all UI text (headings, paragraphs, labels, buttons)
        - **Roboto Mono**: Monospace font for numbers, dates, and numeric data
    - **Font Variables**: Use CSS variables from design system:
        - Font sizes: `var(--text-h1)`, `var(--text-h2)`, `var(--text-h3)`, `var(--text-h4)`, `var(--text-base)`, `var(--text-label)`, `var(--text-sm)`, `var(--text-xs)`
        - Font weights: `var(--font-weight-normal)`, `var(--font-weight-medium)`, `var(--font-weight-semibold)`
    - **Usage**:
        - General text: Use `style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-normal)' }}`
        - Numbers/Dates: Add `className="font-mono"` to use Roboto Mono

### 1.2.1. Number and Date Formatting (CRITICAL)
**Purpose**: Ensure consistent, readable display of numeric data and dates across the application.

**Roboto Mono for All Numbers**:
- **Rule**: ALL numeric values MUST use Roboto Mono font via the `font-mono` class
- **Rationale**: Monospace fonts ensure proper vertical alignment in tables and consistent character width for numeric data
- **Application**: This applies to:
    - Currency amounts (₹1,234.56)
    - Quantities (12.50)
    - Percentages (18.0%)
    - Counts (42 items)
    - HSN codes, product codes, and other numeric identifiers
    - Tax rates and calculations
    - Any numeric value displayed in tables, forms, or summaries

**Implementation Patterns**:
```tsx
// Static numbers in table cells
<TableCell className="text-right font-mono" style={{ fontSize: 'var(--text-base)' }}>
  {amount.toFixed(2)}
</TableCell>

// Currency values
<span className="font-mono" style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>
  {formatCurrency(total)}
</span>

// Numeric input fields
<Input
  type="number"
  className="text-right font-mono"
  defaultValue={quantity.toFixed(2)}
/>
```

**Dates with Roboto Mono**:
- **Format**: `DD-MMM-YY, hh:mm AM/PM` (e.g., `26-FEB-25, 04:30 PM`)
- **Font**: MUST use `font-mono` class
- **Implementation**:
```tsx
<span className="font-mono" style={{ fontSize: 'var(--text-base)' }}>
  {formatDate(dateString)}
</span>
```

**Number Alignment**:
- **Left-aligned**: Text values, labels, names
- **Right-aligned**: ALL numeric values in tables (always with `font-mono`)
- **Table Headers**: Match column content alignment

**Input Field Alignment (CRITICAL)**:
- **Editable Input Fields**: ALWAYS left-aligned, regardless of data type (numbers, text, currency)
    - Rationale: Natural typing direction for data entry
    - Apply to: All `<Input>` elements that users can type into
- **Read-Only Input Fields NOT in Tables**: ALWAYS left-aligned
    - Rationale: Treated as form fields, not table data
    - Apply to: Read-only inputs in forms, modals, detail sections
- **Read-Only Input Fields INSIDE Tables**: Right-aligned with `font-mono` for numeric data
    - Rationale: Acts as table cell display for visual scanning
    - Apply to: Read-only inputs within `<TableCell>` components
- **Implementation**:
```tsx
// Editable numeric input - LEFT aligned
<Input
  type="number"
  className="font-mono"
  value={quantity}
  onChange={(e) => setQuantity(e.target.value)}
/>

// Read-only input in form - LEFT aligned
<Input
  value={formatCurrency(orderAmt)}
  readOnly
  className="bg-muted font-mono text-muted-foreground"
/>

// Read-only input in table - RIGHT aligned
<TableCell>
  <Input
    value={batch.availableQty}
    readOnly
    className="bg-muted font-mono text-right text-muted-foreground"
  />
</TableCell>

// Static table cell - RIGHT aligned
<TableCell className="text-right font-mono">
  {amount.toFixed(2)}
</TableCell>
```

**Critical Rules**:
- **NEVER** display numbers without `font-mono` class
- **ALWAYS** right-align numeric columns in tables (static display)
- **ALWAYS** left-align editable input fields (including numeric inputs)
- **ALWAYS** left-align read-only inputs in forms/modals (NOT in tables)
- **ALWAYS** use monospace for currency and numeric data
- **DO NOT** mix fonts within numeric contexts

### 1.3. Icons
- **Library**: Use **Lucide React** (`lucide-react`) exclusively.
- **Size**: Default icon size should be `size-4` (16px) for inner component icons, or `size-5` (20px) for navigation.

### 1.4. Conditional Subtext
- **Usage**: Descriptions under page, modal, or table titles should be used only when necessary for clarity. Avoid including subtext if the title is self-explanatory to prevent visual clutter.

### 1.5. Scrollbars
- **Theme**: Must use **Light Theme** / Neutral styling. Avoid dark or heavy scrollbars.

---

## 2. Component-Specific Rules

### 2.1. Search Bar & Inputs
- **Width**: As stated above, **Hug the content** or use a specific max-width. Do not fill the parent container aggressively.
- **Icon Placement**:
    - **Search Icon**: Left side (prefix).
    - **Calendar/Date Icon**: **RIGHT SIDE (Suffix)**.
        - **Critical**: The date picker trigger icon must be on the far right.
        - **Rationale**: Prevents confusion with text input start position.
- **Clear Actions**: "X" clear buttons must always be on the right.

### 2.2. Buttons
- **Variants**: Strictly adhere to `variant` props (`default`, `secondary`, `ghost`, `outline`, `destructive`).
- **Icons**:
    - Leading icon: `mr-2 size-4`
    - Trailing icon: `ml-2 size-4`
- **States**: Ensure `disabled` states are visually distinct (opacity-50).

### 2.3. Calendar & Date Picker
- **Composition**: Use a `Popover` > `PopoverTrigger` > `Button` (mimicking input) structure.
- **Calendar Component**:
    - Navigation arrows must be **Lucide Icons** (`ChevronLeft`, `ChevronRight`).
    - Selected state must use `bg-primary` text `text-primary-foreground`.
    - Today's date must be highlighted (e.g., `bg-accent text-accent-foreground`).

### 2.4. Cards & Containers
- **Borders**: All cards must have `border border-border`.
- **Shadows**: Use `shadow-sm` for standard cards. `shadow-md` for floating elements.
- **Header/Content/Footer**: Strictly separate these sections to maintain padding consistency.
- **Usage**: **Avoid Overusing Cards**. Only use cards when content needs distinct encapsulation or groupings. Do not use cards for simple lists or layouts where whitespace is sufficient.

### 2.5. Dialogs & Sheets (Modals)
- **Overlay**: Must include a backdrop blur (`backdrop-blur-sm`).
- **Fixed Modal**: **Upload Documents / View Modals** must use a **Fixed Modal** layout.
    - **Usage**: Use a **Fixed Modal** (Dialog) for Document Upload and Preview tasks.
    - **Single Column**: Do not use multi-column layouts for simple document uploads.
    - **Max Width**: Set a consistent max-width (e.g., `max-w-md` or `max-w-lg`) effectively.
- **Positions**:
    - **Dialog**: Centered.
    - **Sheet**: Side-anchored (usually Right).
- **Close Button**: Must be present in the top-right corner (`X` icon).

#### 2.5.1. Upload Document Modal
**Purpose**: Standardized modal for uploading files (documents, images, CSVs) across the application.

**Structure & Layout**:
- **Title**: "Upload Document" (use `var(--text-h4)` with semibold weight)
- **Max Width**: `sm:max-w-[500px]`
- **Single Column Layout**: No multi-column layouts

**Dropzone Area**:
- **Border**: `border-2 border-dashed` with `rounded-lg`
- **Padding**: `p-8` for spacious feel
- **Hover State**: `hover:border-primary/50` with `transition-colors`
- **Cursor**: `cursor-pointer` on the entire dropzone area
- **Click Behavior**: Entire dropzone is clickable to trigger file input

**Icon & Content**:
- **Icon**: `CloudUpload` from Lucide React
    - Size: `size-16` (64px)
    - Color: `text-primary`
    - Stroke: `strokeWidth={1.5}`
    - Position: Centered horizontally
- **Primary Text**: "Drag and Drop Files here"
    - Style: `var(--text-base)` with semibold weight
- **File Type Info**: Light colored text (`text-muted-foreground`)
    - Style: `var(--text-sm)`
    - Content: Accepted file types and size limit (e.g., "Only png, jpg, docx, xlsx are accepted and the maximum file size is 10MB.")
- **Additional Info**: Optional muted text for mandatory fields or requirements
- **Template Link**: Optional download link in `text-primary` with `hover:underline`
    - Must use `onClick={(e) => e.stopPropagation()}` to prevent dropzone trigger
- **Select Files Button**: `variant="outline"` button inside dropzone
    - Must use `onClick={(e) => { e.stopPropagation(); ... }}` to prevent dropzone trigger

**File Input**:
- **Hidden Input**: Use `className="hidden"` on file input
- **Accept Attribute**: Specify accepted file types (e.g., `accept=".png,.jpg,.jpeg,.docx,.xlsx,.csv"`)
- **Multiple Files**: Support `multiple` attribute for multi-file uploads

**Uploaded Files List**:
- **Visibility**: Only show when `uploadedFiles.length > 0`
- **Container**: `space-y-2` with `max-h-32 overflow-y-auto` for scrolling
- **File Item**:
    - Border: `border` with `rounded-md`
    - Background: `bg-muted/50`
    - Padding: `p-2`
    - Layout: `flex items-center justify-between`
    - File Info: File name + formatted size (e.g., "document.pdf (2.5 MB)")
    - Remove Button: `variant="ghost"` with `size="sm"` and `X` icon

**Footer Actions**:
- **Cancel Button**: `variant="outline"` on the left
    - Behavior: Close modal and clear uploaded files
- **Upload Button**: Primary button with Upload icon on the right
    - Text: "Upload Document"
    - Icon: `Upload` icon with `size-4`

**Typography Compliance**:
- All text must use CSS variables: `var(--text-h4)`, `var(--text-base)`, `var(--text-sm)`
- Font weights: `var(--font-weight-semibold)`, `var(--font-weight-normal)`

**Do's**:
- Center the cloud upload icon
- Make the entire dropzone clickable
- Show file size in human-readable format (KB, MB, GB)
- Provide clear guidance on accepted file types
- Reset uploaded files when modal closes

**Don'ts**:
- Do NOT use small icons (minimum `size-16` for upload icon)
- Do NOT forget to stop propagation on nested clickable elements
- Do NOT show uploaded files list when empty
- Do NOT use hardcoded colors (always use semantic classes)

### 2.6. Sidebar
- **State**: Must support `expanded` and `collapsed` states via data attributes (`data-state="expanded"`).
- **Mobile**: Must render as a `Sheet` (Drawer) on mobile viewports.
- **Menu Items**: Use `SidebarMenuButton` with `asChild` for custom links.
- **Toggle Methods**: The sidebar must support multiple toggle methods:
    - **Header Toggle Icon**: Use `SidebarTrigger` component in the header (left side, before breadcrumbs).
        - **Placement**: Far left of the header, followed by a vertical separator.
        - **Component**: Import and use `SidebarTrigger` from `../ui/sidebar`.
        - **Styling**: Automatically styled with `variant="ghost"`, `size="icon"`, and `size-7`.
        - **Accessibility**: Include `aria-label="Toggle Sidebar"` for screen readers.
    - **Sidebar Rail**: Users can hover and click the sidebar edge to toggle (existing functionality).
    - **Keyboard Shortcut**: Cmd/Ctrl + B to toggle (existing functionality).
- **Implementation**:
    ```tsx
    import { SidebarTrigger } from "../ui/sidebar"
    
    // In header component:
    <SidebarTrigger aria-label="Toggle Sidebar" />
    ```

### 2.7. Tables (Data Table)
**Core Principle**: Tables are for comparison, scanning, and batch actions. They must **NOT** be used to represent workflows or step-by-step tasks.

#### 2.7.1. Structure & Layout
- **Top Bar Layout**:
    - **Top Left**: Date Picker (if present) -> Search Bar -> Tabs -> Filters.
    - **Top Right**: Primary Action Buttons.
- **Columns**:
    - **First Column**: By default, the first column should be **Sr. No.** (Serial Number).
- **Footer Area**:
    - Must contain **Table Brief** (e.g., "Showing 1-10 of 100") and **Pagination**.
- **Table Width Behavior**:
    - **Hug Content**: When tables have **fewer columns** (e.g., 3-5 columns), use `w-fit` to hug content and avoid unnecessary whitespace.
    - **Fill Container**: When tables have **many columns** (e.g., 6+ columns) or need horizontal scrolling, allow the table to fill the container width.
    - **Rationale**: Tables with fewer columns look better when they only take up the space they need, while tables with many columns benefit from full width for better readability and layout.
    - **Implementation**: Use conditional classes based on column count or product type.
        ```tsx
        <div className={`border rounded-md overflow-auto ${
          columnCount <= 5 ? "w-fit" : ""
        }`}>
          <Table>...</Table>
        </div>
        ```
- **Styling**:
    - **Header Background**: White/transparent by default. Grey (`bg-muted/50`) appears ONLY on hover.
    - **Header Text**: `text-muted-foreground`, `font-medium`, `text-sm` (12px).
    - **Rows**: Hover effect `hover:bg-muted/50`.
    - **Cells**: Padding `p-4`, vertically aligned middle.
    - **Typography**: Headers use `var(--text-sm)`, cells use `var(--text-base)`.

#### 2.7.2. Column Customization
- **Visibility**: Provide a **Dropdown Menu** (e.g., "Columns") in the top-right toolbar to toggle column visibility.
- **Reordering**: Users must be able to **drag and drop** items *within the dropdown list* to reorder columns in the table.
- **Locking**: Include a **Lock Icon** next to each item in the dropdown.
    - **Behavior**: Clicking the lock fixes the column's position, preventing it from being reordered or hidden.
- **Fixed Columns**: Certain columns (e.g., Sr. No., primary identifiers, Actions) must be marked as **fixed** by default.
    - **Behavior**: Fixed columns cannot be unlocked, hidden, or reordered. They remain in their designated positions permanently.
    - **Visual**: Fixed columns show no lock/unlock button and no drag handle. Checkbox is disabled.

**Column Management Component**:
**Purpose**: A comprehensive column customization system that allows users to control visibility, order, and lock state of table columns through a dropdown menu.

**Structure & Behavior**:
- **Trigger Button**:
    - Must use `variant="outline"` with `Columns` icon from Lucide React
    - Label: "Columns" with trailing `ChevronDown` icon
    - Placement: Top-right toolbar area alongside other action buttons
    - Size: Icon should be `size-4`

- **Dropdown Menu**:
    - **Container**: Use `DropdownMenuContent` with `align="end"` and `w-64` width
    - **Padding**: Apply `p-2` to the dropdown content wrapper
    - **Spacing**: Use `space-y-1` between column items

- **Column Items** (Draggable):
    - **Layout**: `flex items-center justify-between` with `px-3 py-2`
    - **Hover State**: `hover:bg-accent rounded-sm transition-colors`
    - **Left Section**: Contains drag handle, checkbox, and column label
        - **Drag Handle Icon**: `GripVertical` with `size-4 text-muted-foreground`
            - Only visible when column is **unlocked**
            - Indicates drag capability
        - **Checkbox**: Controls column visibility
            - `checked={column.visible}` state
            - `disabled={column.locked || column.fixed}` - locked or fixed columns cannot be hidden
        - **Column Label**: Uses `var(--text-sm)` typography
            - Apply `text-muted-foreground` when column is locked
    - **Right Section**: Lock/Unlock button
        - **Button**: `variant="ghost"` with `size="icon"` and `size-6` dimension
        - **Icons**: Toggle between `Lock` (locked) and `Unlock` (unlocked) with `size-3`

**Drag and Drop Functionality**:
- **Implementation**: Must use `react-dnd` with `HTML5Backend`
- **Drag Behavior**:
    - **Can Drag**: Only unlocked columns (`canDrag: !column.locked && !column.fixed`)
    - **Cursor**: `cursor-move` for unlocked columns, `cursor-default` for locked or fixed
    - **Visual Feedback**:
        - Dragging item: `opacity-50`
        - Hover target: `bg-accent/50`
    - **Reordering**: Columns reorder in real-time as user drags within the dropdown
- **Drop Behavior**:
    - Accept only `COLUMN` item type
    - On hover, swap positions with the target column
    - Update both table header and column configuration state

**State Management**:
- **Column Configuration Type**:
    ```typescript
    type ColumnConfig = {
      id: string        // Unique identifier
      label: string     // Display name
      visible: boolean  // Show/hide in table
      locked: boolean   // Prevent reorder/hide
      fixed: boolean    // Cannot be unlocked or reordered (permanent)
    }
    ```
- **Default Fixed Columns**: Mark essential columns as fixed (e.g., Sr. No., Order No/Catalog Number, Customer Name/Product, Actions)
- **Default Locking**: Additional columns can be locked by default but remain user-customizable
- **Default Configuration**: Store default column configuration as a constant (e.g., `DEFAULT_COLUMNS`) that can be restored via reset
- **Actions**:
    - `toggleColumn(id)`: Toggle visibility (disabled for locked or fixed columns)
    - `toggleLock(id)`: Toggle lock state (disabled for fixed columns, enabled for customizable columns)
    - `moveColumn(dragIndex, hoverIndex)`: Reorder columns (only for unlocked and non-fixed columns, prevent dropping into fixed positions)
    - `resetColumns()`: Reset column configuration to default state

**Reset Functionality**:
- **Purpose**: Allows users to restore column configuration (visibility, order, and lock state) to default settings
- **Placement**: Must be placed at the bottom of the dropdown menu, separated by a `<Separator />` component
- **Button Styling**:
    - Variant: `variant="ghost"`
    - Size: `size="sm"`
    - Width: `className="w-full justify-start"`
    - Typography: `style={{ fontSize: 'var(--text-sm)' }}`
    - Label: "Reset to Default"
- **Behavior**:
    - Restores all columns to their original `DEFAULT_COLUMNS` state
    - Resets visibility, lock state, and column order
    - Shows success toast notification: "Column configuration reset to default"
- **Implementation Pattern**:
    ```tsx
    const resetColumns = () => {
      setColumns([...DEFAULT_COLUMNS])
      toast.success("Column configuration reset to default")
    }
    ```
- **Layout in Dropdown**:
    ```tsx
    <DropdownMenuContent align="end" className="w-64">
      <div className="p-2 space-y-1">
        {columns.map((column, index) => (
          <DraggableColumnItem ... />
        ))}
      </div>
      <Separator />
      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={resetColumns}
          style={{ fontSize: 'var(--text-sm)' }}
        >
          Reset to Default
        </Button>
      </div>
    </DropdownMenuContent>
    ```

**Table Synchronization**:
- **Visible Columns**: Filter `columns` array by `visible: true` property
- **Render Order**: Table headers and cells must render in the order defined by the `columns` array
- **Dynamic Headers**: Use `visibleColumns.map()` to generate table headers
- **Dynamic Cells**: Use `visibleColumns.map()` to render cells in each row

**Typography Compliance**:
- Column labels: `var(--text-sm)`
- All text should follow design system font faces

**Interaction Rules**:
- **Fixed Columns**:
    - Cannot be unlocked (no lock/unlock button shown)
    - Cannot be dragged (no drag handle shown)
    - Cannot be unchecked/hidden (checkbox is disabled)
    - Cannot have items dropped on them during reordering
    - Show muted text color to indicate non-customizable state
    - Maintain empty spacing where buttons would be for visual alignment
- **Locked Columns** (Non-Fixed):
    - Cannot be dragged (no drag handle shown)
    - Cannot be unchecked/hidden (checkbox is disabled)
    - Can be unlocked by clicking the lock icon
    - Lock state is independent of visibility
- **Unlocked Columns**:
    - Can be dragged to reorder
    - Can be checked/unchecked to show/hide
    - Can be locked by clicking the unlock icon
    - Visibility state persists when locking/unlocking

**Implementation Patterns**:
```typescript
// Prevent toggling lock on fixed columns
const toggleLock = (id: string) => {
  setColumns((prev) =>
    prev.map((col) => {
      if (col.id === id && !col.fixed) {
        return { ...col, locked: !col.locked }
      }
      return col
    })
  )
}

// Prevent moving fixed columns or into fixed positions
const moveColumn = (dragIndex: number, hoverIndex: number) => {
  setColumns((prev) => {
    const newColumns = [...prev]
    const draggedColumn = newColumns[dragIndex]
    const targetColumn = newColumns[hoverIndex]
    
    if (draggedColumn.fixed || targetColumn.fixed) {
      return prev
    }
    
    const [movedColumn] = newColumns.splice(dragIndex, 1)
    newColumns.splice(hoverIndex, 0, movedColumn)
    return newColumns
  })
}

// Drag behavior
const [{ isDragging }, drag] = useDrag({
  type: "COLUMN",
  item: { index },
  canDrag: !column.locked && !column.fixed,
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
  }),
})

// Drop behavior
const [{ isOver }, drop] = useDrop({
  accept: "COLUMN",
  canDrop: () => !column.fixed,
  hover: (item: { index: number }) => {
    if (item.index !== index && !column.fixed) {
      moveColumn(item.index, index)
      item.index = index
    }
  },
  collect: (monitor) => ({
    isOver: monitor.isOver() && monitor.canDrop(),
  }),
})
```

**Do's**:
- Always mark essential columns (Sr. No., primary identifiers, Actions) as fixed
- Show lock/unlock button only for non-fixed columns
- Provide clear visual distinction between fixed, locked, and unlocked columns
- Use real-time drag feedback with opacity and background changes
- Maintain column order consistency between dropdown and table
- Apply `stopPropagation()` on nested interactive elements if needed

**Don'ts**:
- Do NOT allow dragging fixed columns
- Do NOT allow hiding fixed columns
- Do NOT show lock/unlock button for fixed columns
- Do NOT allow dropping items into fixed column positions
- Do NOT forget to update table headers when columns are reordered
- Do NOT use arbitrary spacing values
- Do NOT make all columns fixed (only essential ones)

#### 2.7.3. Alignment, Sorting & Formatting
- **Alignment Rules**:
    - **Text**: Left Aligned.
    - **Numbers**: **Right Aligned** (Must be in **Monospace Font**).
    - **Heads**: Match the content alignment (e.g., Number headers should be Right Aligned).
- **Required Field Indicators**:
    - **NEVER** use asterisks (*) or "(required)" indicators in table column headers.
    - **Rationale**: Table columns represent data structure, not form inputs. Required field validation should be handled in forms/modals, not in table headers.
    - **Correct**: "Execution Qty" (column header)
    - **Incorrect**: "Execution Qty *" (column header)
- **Sorting**:
    - **Indicator**: Sortable headers must show a clear arrow indicator.
    - **Constraint**: Only **ONE** active sort column at a time.
    - **Default**: Default sorting logic must be defined intentionally (e.g., "Created Date" descending).
- **Formatting**:
    - **Dates**: **Strict Format** & Monospace Font.
        - Format: `DD-MMM-YY, hh:mm AM/PM` (e.g., `23-FEB-25, 04:30 PM`).
        - **Font**: Must use `font-mono` class (Roboto Mono).
    - **Numbers**: **Monospace Font**.
        - **Font**: Must use `font-mono` class (Roboto Mono).
        - **Rationale**: Monospace fonts ensure proper alignment and readability for numeric data.
        - **Implementation**: Wrap numbers in a `<span className="font-mono">` element.

#### 2.7.4. Advanced Table Types
1.  **Action-Driven Table**:
    -   **Purpose**: Performing actions on individual records.
    -   **Actions**: Inline actions limited to **1-2 primary actions** max.
        -   **Placement**: Must be in the **right-most column**.
        -   **Constraint**: No more than 2 columns of actions.
    -   **Safety**: **Destructive actions** must NOT be the default inline action. Move to overflow menu.
2.  **Selection Table**:
    -   **Purpose**: Bulk actions or assignment.
    -   **Controls**: Use checkboxes (multi) or radio buttons (single) in the first column.
    -   **Behavior**: Selecting an entry opens a **System Tray** (floating bar) where users can perform actions related to the specific entry/entries.
    -   **Visual**: Selection controls must be visually distinct from row actions.

#### 2.7.5. Table Do's & Don'ts
- **DO**:
    - Use for comparison and overview.
    - Keep primary actions visually discoverable.
    - Maintain consistent column order.
- **DON'T**:
    - Use tables for guided workflows.
    - Overload rows with hidden content.
    - Place irreversible actions inside overflow menus by default.
    - Add decorative icons in data columns (Only Action column should have icons).

### 2.8. Dropdowns & Popovers
- **Offset**: Always use `sideOffset={4}` to prevent merging with triggers.
- **Animation**: Implement `fade-in` and `zoom-in` transitions (standard in Shadcn).

### 2.9. Navigation Menu
- **Indicator**: Must have active state indicator (e.g., underline or background pill).
- **Responsive**: Collapse to hamburger menu on mobile.

### 2.10. Form Fields
- **Labels**: Always include a `Label` component linked via `htmlFor`.
- **Error Messages**: Render below input in `text-destructive` color and `text-sm`.
- **Required Fields**: Mark with a red asterisk `*` or clear "(required)" label.
- **Required Field Validation (CRITICAL)**: 
    - **Rule**: If any field marked with `*` (asterisk) is not filled, the user MUST NOT be able to complete the task or submit the form.
    - **Implementation**: Primary action buttons (Submit, Validate, Save, etc.) must be disabled using the `disabled` attribute when required fields are empty.
    - **Visual Feedback**: Disabled buttons should maintain proper opacity and cursor states to indicate they cannot be clicked.
    - **Validation Pattern**:
        ```tsx
        // Example: Disable button if required fields are empty
        <Button
          onClick={handleSubmit}
          disabled={!requiredField1 || !requiredField2 || !requiredField3}
        >
          Submit
        </Button>
        ```
    - **Scope**: This applies to all forms, modals, dialogs, and any interface where required fields are present.
    - **User Experience**: Users should receive clear visual feedback that the action is unavailable until all required fields are completed.

#### 2.10.1. Switch Component
**Purpose**: Toggle controls for binary on/off states. Must have clear visibility in both checked and unchecked states.

**Styling Requirements**:
- **Unchecked State** (Default/Off):
    - Background: `bg-muted` - clearly visible gray background
    - Border: `border border-border` - visible outline for definition
    - Thumb (toggle circle): `bg-background` - white/light circle for contrast
    - Shadow: `shadow-sm` for subtle depth
- **Checked State** (On):
    - Background: `bg-primary` - fills with primary brand color
    - Border: `border-primary` - maintains border consistency
    - Thumb (toggle circle): `bg-primary-foreground` - contrasting color (usually white)
- **Transitions**: Use `transition-colors` for smooth state changes
- **Focus States**: Must include `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`

**Implementation Reference**:
```tsx
// Correct Switch styling
<SwitchPrimitives.Root
  className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=unchecked]:bg-muted data-[state=unchecked]:border-border"
>
  <SwitchPrimitives.Thumb
    className="pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-primary-foreground data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-background"
  />
</SwitchPrimitives.Root>
```

**Critical Rules**:
- **NEVER** use `bg-input` or `border-transparent` for unchecked state - these create invisible switches
- **ALWAYS** ensure sufficient contrast between background and thumb in both states
- **MUST** use semantic color classes from design system (`bg-muted`, `bg-primary`, etc.)

#### 2.10.2. Radio Button Component
**Purpose**: Selection controls for mutually exclusive options. Must have clear visibility in both selected and unselected states.

**Styling Requirements**:
- **Unselected State** (Default):
    - Border: `border-2 border-border` - visible 2px border circle
    - Background: `bg-background` - clean white/light background
    - Shadow: `shadow-sm` for subtle depth
    - Size: `size-4` (16px) for standard form usage
- **Selected State**:
    - Border: `border-primary` - border turns to primary color
    - Background: `bg-primary` - fills with primary brand color
    - Indicator (center dot): `fill-primary-foreground` - contrasting color for the inner circle
    - Size: Inner circle should be `size-2` (8px)
- **Transitions**: Use `transition-colors` for smooth state changes
- **Focus States**: Must include `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`

**Implementation Reference**:
```tsx
// Correct Radio Button styling
<RadioGroupPrimitive.Item
  className="aspect-square size-4 shrink-0 rounded-full border-2 border-border bg-background shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
>
  <RadioGroupPrimitive.Indicator className="relative flex items-center justify-center">
    <CircleIcon className="fill-primary-foreground absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
  </RadioGroupPrimitive.Indicator>
</RadioGroupPrimitive.Item>
```

**Critical Rules**:
- **NEVER** use `border-input` or thin borders that make unselected state invisible
- **ALWAYS** use `border-2` for radio buttons to ensure clear visibility
- **MUST** ensure the selected state has both border and background color changes
- **MUST** use semantic color classes from design system

**Do's**:
- Provide clear visual distinction between selected and unselected states
- Use consistent sizing across all form controls
- Ensure sufficient contrast for accessibility
- Test visibility on both light and dark backgrounds

**Don'ts**:
- Do NOT use low-contrast colors that make controls hard to see
- Do NOT use transparent or subtle borders for default states
- Do NOT skip focus states - they're critical for accessibility
- Do NOT use arbitrary color values - always use design system tokens

### 2.11. Badge System
**Purpose**: Badges are compact UI elements used to communicate state, priority, or context at a glance. They help users scan faster and understand system meaning without reading full text. Badges should clarify, not decorate.

#### 2.11.1. Badge vs Status Badge
-   **Badge**:
    -   **Usage**: Used to describe what kind of thing this is. Badges are **descriptive** and usually **stable**.
    -   **Examples**: "Label", "Category", "Verified".
-   **Status Badge**:
    -   **Usage**: Used to represent the current system state. Status badges **change based on system logic**.
    -   **Examples**: "Active", "Moderate", "Destructive".

#### 2.11.2. Badge Variants
Badge variants indicate visual importance. Use variants intentionally (More emphasis ≠ better clarity).
-   **Primary**: Important contextual label.
-   **Secondary**: Neutral or supporting info.
-   **Outline**: Informational, low emphasis.
-   **Ghost**: Very subtle context.
-   **Destructive**: Negative or cautionary context.

#### 2.11.3. Status Badge Severity
Status badges communicate severity and impact. Severity must always reflect actual system behavior.
-   **Primary**: Normal or successful state.
-   **Moderate**: Needs attention or pending.
-   **Destructive**: Blocking, failed, or high risk.
-   **Visual Distinction**: Status badges must be visually distinct from buttons. They are **informative**, not interactive.

#### 2.11.4. Shapes & States
-   **Shapes**: Both Badges and Status Badges support:
    -   **Default**: Standard rounded corners (`rounded-md`).
    -   **Round**: Fully rounded pill shape (`rounded-full`).
-   **States**: Must support `Default` and `Focus` states.

#### 2.11.5. Color Semantics & Styling
Color represents meaning, not category. Usage must stay consistent across the system.

**Semantic Color Mapping**:
-   **Positive/Success** (Cyan/Blue) -> Success, Active, Approved, Shipped, Completed.
-   **Warning/Moderate** (Orange/Amber) -> Pending, Needs attention, In Process, Expiring Soon.
-   **Error/Destructive** (Red) -> Failed, Blocked, Rejected, Cancelled, Expired.
-   **Neutral** (Gray) -> Draft, Archived, Default states.

**Badge Component Styling**:
-   **Base Classes**: `inline-flex items-center justify-center border px-2 py-0.5`
-   **Typography**: `text-xs font-medium` with `var(--text-xs)` from design system
-   **Layout**: `w-fit whitespace-nowrap shrink-0` to hug content
-   **Border Radius**: Use `rounded-md` for default, `rounded-full` for pill-shaped badges
-   **Spacing**: Icon spacing `gap-1`, icon size `size-3`
-   **Focus State**: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`

**Standard Badge Variants**:
1.  **Default (Primary)**:
    -   Base: `border-transparent bg-primary text-primary-foreground`
    -   Hover: `[a&]:hover:bg-primary/90`
    
2.  **Secondary**:
    -   Base: `border-transparent bg-secondary text-secondary-foreground`
    -   Hover: `[a&]:hover:bg-secondary/90`
    
3.  **Destructive**:
    -   Base: `border-transparent bg-destructive text-white`
    -   Hover: `[a&]:hover:bg-destructive/90`
    -   Focus: `focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40`
    -   Dark mode: `dark:bg-destructive/60`
    
4.  **Outline**:
    -   Base: `text-foreground` with visible border
    -   Hover: `[a&]:hover:bg-accent [a&]:hover:text-accent-foreground`

**Status Badge Custom Colors**:
When displaying system states, use custom color overlays with the appropriate semantic variant:

-   **Success/Active States** (Cyan):
    -   Light: `bg-cyan-500/10 text-cyan-700 border-cyan-500/20`
    -   Dark: `dark:bg-cyan-500/20 dark:text-cyan-400`
    -   Examples: Approved, Shipped, Active
    
-   **Warning/Pending States** (Orange):
    -   Light: `bg-orange-500/10 text-orange-700 border-orange-500/20`
    -   Dark: `dark:bg-orange-500/20 dark:text-orange-400`
    -   Examples: Pending Approval, In Process, Expiring Soon
    
-   **Error/Destructive States** (Red):
    -   Light: `bg-red-500/10 text-red-700 border-red-500/20`
    -   Dark: `dark:bg-red-500/20 dark:text-red-400`
    -   Examples: Rejected, Cancelled, Expired
    
-   **Neutral States** (Gray):
    -   Use: `text-muted-foreground` with outline variant
    -   Examples: Draft, Pending (neutral context)

**Implementation Pattern**:
```tsx
// Status badge with custom colors
const statusConfig = {
  "Approved": { 
    variant: "default", 
    className: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20 dark:bg-cyan-500/20 dark:text-cyan-400" 
  },
  "Pending": { 
    variant: "secondary", 
    className: "bg-orange-500/10 text-orange-700 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400" 
  },
  "Rejected": { 
    variant: "destructive", 
    className: "bg-red-500/10 text-red-700 border-red-500/20 dark:bg-red-500/20 dark:text-red-400" 
  },
  "Draft": { 
    variant: "outline", 
    className: "text-muted-foreground" 
  }
}

// Usage
<Badge variant={config.variant} className={config.className}>
  {status}
</Badge>
```

**Typography Compliance**:
-   Always use `text-xs` Tailwind class, which corresponds to `var(--text-xs)` from the design system
-   Font weight: `font-medium` for all badge text
-   Never use arbitrary font sizes - stick to design system tokens

**Critical Rules**:
-   **DO NOT** use solid background colors (e.g., `bg-red-500`) - always use opacity variants (`/10`, `/20`)
-   **DO NOT** hardcode color values - use Tailwind color palette with opacity modifiers
-   **MUST** provide both light and dark mode color variants
-   **MUST** maintain consistent color semantics across the application
-   **ALWAYS** use semantic color classes (`bg-primary`, `text-foreground`) for base badge variants

#### 2.11.6. Badges Inside Tables
Tables are high-density views. Avoid badge overload; they are for scanning, not decoration.
-   **Maximum one** status badge per row.
-   **Optional one** supporting badge.
-   **Placement**: Near the primary identifier.

#### 2.11.7. When Not to Use Badges
Do not use badges when:
-   Explanation is required.
-   The state affects the entire page.
-   Full sentences are more appropriate.
**Rule**: Badges signal what to notice, not what to understand fully. If a badge doesn't change understanding immediately, remove it.

#### 2.11.8. Badge Do's & Don'ts
| Do's | Don'ts |
| :--- | :--- |
| Use short, clear labels (1–2 words). | Create new badge styles without need. |
| Match badge meaning with system logic. | Mix status and labels visually. |
| Keep visual hierarchy clean. | Overuse destructive variants. |

#### 2.11.9. Summary
-   **Badge** -> Describes what it is.
-   **Status Badge** -> Shows current state.
-   **Variant & color** -> Indicates importance and severity.

---

### 2.12. Read-Only / Details Views
- **Rule**: Use **Plain Text** for static or read-only information.
- **Prohibition**: Do NOT use `disabled` input fields to display read-only data.
- **Styling**: Labels should be `text-muted-foreground` (small), and values should be `text-foreground` (medium/base).

---

### 2.13. Page Headers & Navigation
- **Back Button**: Must be placed strictly to the **LEFT** of the Page Title.
- **Page Title Typography**: 
    - **Font**: Inter (sans-serif)
    - **Size**: `var(--text-h4)` (20px)
    - **Weight**: `var(--font-weight-semibold)` (600)
    - **Implementation**: Always use `style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)' }}`
    - **Rationale**: Ensures consistent page title appearance across the application and adheres to the design system.

---

### 2.14. Select / Dropdown Component
**Purpose**: Dropdowns for selecting options from a list. Must have clear visibility in all states and follow light theme styling.

**Styling Requirements**:
- **Trigger (SelectTrigger)**:
    - Border: `border-border` - clearly visible border (NOT `border-input`)
    - Background: `bg-input-background` for consistency with other form controls
    - Focus State: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`
    - Icon: ChevronDown with `size-4 opacity-50`
- **Dropdown Content (SelectContent)**:
    - Background: `bg-background` - light theme background (NOT `bg-popover`)
    - Text: `text-foreground` - dark text for light background (NOT `text-popover-foreground`)
    - Border: Standard `border` with shadow-md
    - Animation: Fade-in and zoom-in transitions
- **Items (SelectItem)**:
    - Hover/Focus: `focus:bg-accent focus:text-accent-foreground`
    - Selected Indicator: CheckIcon aligned to the right

**Critical Rules**:
- **NEVER** use `border-input` for select triggers - use `border-border` for visibility
- **MUST** use light theme colors (`bg-background text-foreground`) for dropdown content
- **ALWAYS** ensure sufficient contrast between trigger and dropdown
- **MUST** use semantic color classes from design system

**Implementation Reference**:
```tsx
// Correct Select styling
<SelectTrigger className="border-border bg-input-background">
  <SelectValue />
</SelectTrigger>
<SelectContent className="bg-background text-foreground">
  <SelectItem value="option1">Option 1</SelectItem>
</SelectContent>
```

**Do's**:
- Use consistent border styling across all form controls
- Ensure dropdown content has proper light theme styling
- Provide clear visual distinction between states
- Use standard Tailwind classes for spacing and sizing

**Don'ts**:
- Do NOT use `border-input` which may have insufficient visibility
- Do NOT use dark theme colors (`bg-popover`) for dropdown content
- Do NOT skip focus states - they're critical for accessibility
- Do NOT use arbitrary color values - always use design system tokens

---

### 2.15. Popover & Date Picker Component
**Purpose**: Floating overlays for calendars, tooltips, and additional content. Must use light theme styling consistently.

**Styling Requirements**:
- **Popover Content (PopoverContent)**:
    - Background: `bg-background` - light theme background (NOT `bg-popover`)
    - Text: `text-foreground` - dark text for light background (NOT `text-popover-foreground`)
    - Border: Standard `border` with `shadow-md`
    - Padding: `p-4` for comfortable spacing
    - Animation: Fade-in, zoom-in, and slide-in transitions based on side
    - Z-index: `z-50` to ensure proper layering

**Date Picker Specific**:
- **Calendar Component**: Must integrate with Popover using light theme
- **Selected Day**: `bg-primary text-primary-foreground`
- **Today's Date**: `bg-accent text-accent-foreground` for distinction
- **Navigation**: Use Lucide icons (`ChevronLeft`, `ChevronRight`)
- **Header Text**: `text-muted-foreground` for day labels

**Critical Rules**:
- **NEVER** use `bg-popover text-popover-foreground` - these create dark theme appearance
- **MUST** use `bg-background text-foreground` for all popover content
- **ALWAYS** ensure calendar/date picker has white/light background
- **MUST** maintain consistency with other light theme components

**Implementation Reference**:
```tsx
// Correct Popover styling
<PopoverContent className="bg-background text-foreground">
  {/* Calendar or other content */}
</PopoverContent>

// Date Picker with Popover
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      <CalendarIcon className="mr-2 size-4" />
      Select Date
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0 bg-background text-foreground">
    <Calendar mode="single" selected={date} onSelect={setDate} />
  </PopoverContent>
</Popover>
```

**Do's**:
- Use consistent light theme styling across all popover instances
- Ensure calendar has proper contrast and readability
- Maintain consistent spacing and padding
- Apply proper z-index for layering

**Don'ts**:
- Do NOT use dark theme color variables (`bg-popover`, `text-popover-foreground`)
- Do NOT create inconsistent theming between popover and rest of application
- Do NOT skip animation states - they improve UX
- Do NOT use arbitrary color values - always use design system tokens

---

## 3. Strict Prohibitions (Do Not Do)
1.  **Do NOT** use `style={{ ... }}` for layout. use Tailwind classes.
2.  **Do NOT** use grid layouts for simple linear lists (use Flexbox `flex-col`).
3.  **Do NOT** place action buttons (Save, Cancel) in random places. Put them in `CardFooter` or `DialogFooter`.
4.  **Do NOT** mix icon sets (e.g., FontAwesome + Lucide).

## 4. Accessibility Mandates
- **Focus Rings**: All interactive elements must have visible focus rings (`ring-2 ring-ring ring-offset-2`).
- **Aria Labels**: Icon-only buttons MUST have `sr-only` text or `aria-label`.
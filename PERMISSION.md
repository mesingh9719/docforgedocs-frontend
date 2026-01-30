# Frontend Permission & Menu Guide

This guide explains how to add new modules, menu items, and permissions to the frontend application.

## 1. Permission Architecture

The frontend uses a **Role-Based Access Control (RBAC)** system synced with the backend.
- **Backend**: Defines permissions in `config/permissions.php`.
- **Frontend**: Fetches these permissions via `usePermissions` hook.
- **Hook**: `const { can } = usePermissions()` provides a simple check function.

## 2. Adding a New Menu Item

To add a new link to the sidebar, modify `src/components/Dashboard/Sidebar.jsx`.

1.  **Locate `navItems` array**:
    ```javascript
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        // ...
    ];
    ```

2.  **Add your item**:
    Include the `permission` key that matches the backend permission string.

    ```javascript
    // Example: Adding a 'Signature' module
    { 
        icon: PenTool, 
        label: 'Signatures', 
        path: '/signatures', 
        permission: 'settings.signature' // MUST match backend key
    }
    ```

    *If the user does not have this permission, the menu item will be automatically hidden.*

## 3. Protecting Routes

Prevent users from accessing the page by typing the URL directly.

1.  **Open `src/App.jsx`** (or your router definition).
2.  **Wrap your route** with `ProtectedRoute` and pass the `permission` prop.

    ```jsx
    <Route 
        path="/signatures" 
        element={
            <ProtectedRoute permission="settings.signature">
                <SignaturesPage />
            </ProtectedRoute>
        } 
    />
    ```

## 4. Conditional Rendering in Components

To hide/show specific buttons or sections within a page:

1.  **Import the hook**:
    ```javascript
    import { usePermissions } from '../../hooks/usePermissions';
    ```

2.  **Check permission**:
    ```jsx
    const MyComponent = () => {
        const { can } = usePermissions();

        return (
            <div>
                <h1>Details</h1>
                
                {can('settings.signature') && (
                    <button>Configure Signatures</button>
                )}
            </div>
        );
    };
    ```

## Summary Checklist
- [ ] Define key in Backend (`config/permissions.php`).
- [ ] Add to `Sidebar.jsx` (with `permission` key).
## 5. End-to-End Example: Adding a "Reports" Module

Here is a complete walkthrough of adding a new feature restricted to Admins.

### Step 1: Define Backend Permission

1.  Open `backend/config/permissions.php`.
2.  Add the new permission key and assign roles.

    ```php
    // backend/config/permissions.php
    'permissions' => [
        // ... existing items
        'reports.view' => [
            'label' => 'View Reports',
            'roles' => ['admin', 'editor'], // Only Admins and Editors can see this
        ],
    ],
    ```

### Step 2: Add Sidebar Menu Item

1.  Open `frontend/src/components/Dashboard/Sidebar.jsx`.
2.  Add the item to the `navItems` array with the `permission` key.

    ```javascript
    // frontend/src/components/Dashboard/Sidebar.jsx
    import { BarChart3 } from 'lucide-react'; // Import icon

    const navItems = [
        // ...
        { 
            icon: BarChart3, 
            label: 'Reports', 
            path: '/reports', 
            permission: 'reports.view' // Must match backend key exactly
        },
    ];
    ```

### Step 3: Create & Protect the Route

1.  Open `frontend/src/App.jsx`.
2.  Import your page component and wrap it in `ProtectedRoute`.

    ```jsx
    // frontend/src/App.jsx
    import ReportsPage from './pages/Dashboard/ReportsPage';

    // inside your router...
    <Route 
        path="/reports" 
        element={
            <ProtectedRoute permission="reports.view">
                <ReportsPage />
            </ProtectedRoute>
        } 
    />
    ```

### Step 4: Component Level Check (Optional)

If `ReportsPage` has a "Download CSV" button that only Admins can use (even if Editors can view the page):

1.  **Backend**: Add `'reports.export' => ['roles' => ['admin']]`.
2.  **Frontend**:

    ```jsx
    // frontend/src/pages/Dashboard/ReportsPage.jsx
    import { usePermissions } from '../../hooks/usePermissions';

    const ReportsPage = () => {
        const { can } = usePermissions();

        return (
            <div>
                <h1>Monthly Reports</h1>
                
                {can('reports.export') && (
                    <button onClick={handleExport}>Download CSV</button>
                )}
            </div>
        );
    };
    ```

import { useAuth } from '../context/AuthContext';
import { useMemo } from 'react';

/**
 * usePermissions Hook
 * Checks if the current user has specific permissions based on their role.
 * 
 * Ideally, the backend should return a list of permissions for the user,
 * OR we fetch the matrix and check against the user's role.
 * 
 * For simplicity and speed, we will replicate the basic role definition here OR
 * fetch the matrix. Fetching matrix is better for single source of truth.
 * However, we can also map the basic roles known to frontend if needed.
 * 
 * Let's rely on the user object having a 'role' (via ChildUser relationship or direct)
 * and potentially a list of permissions if we chose to send them.
 * 
 * Given the current backend implementation sends the user and their business info,
 * we will fetch the permission matrix once and store it, or just return helper functions.
 */

// We can hardcode the mapping here to match backend config for instant UI feedback
// without waiting for an API call, OR fetch it. 
// Let's hardcode for now to ensure instant responsiveness, but fetching is "cleaner".
// Given the "Senior Developer" persona, fetching from the API endpoint we just made is best.

import { useState, useEffect } from 'react';
import axios from '../api/axios';

export const usePermissions = () => {
    const { user } = useAuth();
    const [matrix, setMatrix] = useState({ roles: {}, permissions: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const res = await axios.get('/permissions');
                setMatrix(res.data);
            } catch (err) {
                console.error("Failed to fetch permissions", err);
            } finally {
                setLoading(false);
            }
        };
        // Only fetch matrix if we need to manage roles (e.g. for the modal)
        // For simple checking, we rely on user object.
        fetchPermissions();
    }, []);

    // Helper: Check if user has permission
    const can = (permissionKey) => {
        if (!user) return false;

        // 1. Check for Super Admin / Owner wildcard
        if (user.permissions && user.permissions.includes('*')) {
            return true;
        }

        // 2. Check for explicit permission grant (standard RBAC)
        if (user.permissions && Array.isArray(user.permissions)) {
            return user.permissions.includes(permissionKey);
        }

        return false;
    };

    return {
        can,
        matrix,
        // Helper to check if user can manage team
        canManageTeam: () => can('team.roles.manage') || can('team.invite'),
        loading
    };
};

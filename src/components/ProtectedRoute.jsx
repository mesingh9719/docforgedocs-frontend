import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ permission, redirectPath = '/dashboard', children }) => {
    const { loading: authLoading } = useAuth();
    const { can, loading: permLoading } = usePermissions();

    if (authLoading || permLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (permission && !can(permission)) {
        return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ permission, redirectPath = '/dashboard', children }) => {
    const { user, loading: authLoading } = useAuth();
    const { can, loading: permLoading } = usePermissions();

    if (authLoading || (permission && permLoading)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        // Not logged in -> Redirect to Login with message
        return <Navigate to="/login" state={{ message: "You must be logged in to view this page." }} replace />;
    }

    if (permission && !can(permission)) {
        // Logged in but no permission -> Redirect to safe path (Dashboard)
        // Avoid redirect loop if we are already on the dashboard or redirectPath
        return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;

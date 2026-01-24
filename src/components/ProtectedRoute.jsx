import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ permission, redirectPath = '/dashboard', children }) => {
    const { user, loading: authLoading } = useAuth();
    const { can, loading: permLoading } = usePermissions();
    const location = useLocation();

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

    // Force Email Verification
    if (!user.email_verified_at) {
        return <Navigate to="/verify-email-message" replace />;
    }

    // Force Onboarding (Business Setup) if not a child user
    // We check if we are NOT already on the onboarding page to avoid loop
    if (!user.business && !user.parent_id && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" state={{ message: "Please complete onboarding to access your dashboard." }} replace />;
    }

    if (permission && !can(permission)) {
        // Logged in but no permission -> Redirect to safe path (Dashboard)
        // Avoid redirect loop if we are already on the dashboard or redirectPath
        return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;

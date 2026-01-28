import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setToken } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (token) {
            setToken(token);
            // Optional: Fetch user profile to check if onboarding is needed
            // For now, redirect to dashboard
            navigate('/dashboard');
        } else {
            navigate('/login', {
                state: { message: error || 'Login failed. Please try again.' }
            });
        }
    }, [location, navigate, setToken]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
                <p className="text-slate-600 font-medium">Authenticating...</p>
            </div>
        </div>
    );
};

export default AuthCallback;

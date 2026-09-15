import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Loader2 } from 'lucide-react';

const GoogleLoginButton = ({ text = "Continue with Google" }) => {
    const navigate = useNavigate();
    const { setToken, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [gisLoaded, setGisLoaded] = useState(false);

    const clientId = import.meta.env.GOOGLE_CLIENT_ID || '803668558316-5onu9tove6rs0ndae68mnogc00kgrosm.apps.googleusercontent.com';
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
    const backendUrl = apiBase.replace(/\/api\/v1\/?$/, '');

    // Handle the token response from Google Identity Services (Authorized JavaScript origins)
    const handleCredentialResponse = async (response) => {
        if (!response || !response.credential) {
            console.error("No credential received from Google");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post('/auth/google', {
                credential: response.credential,
            });

            if (res.data && res.data.token) {
                setToken(res.data.token);
                if (res.data.user || res.data.data) {
                    setUser(res.data.user || res.data.data);
                }
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Google authentication failed:", err);
            // Fallback to server redirect flow if browser API fails
            window.location.href = `${backendUrl}/auth/google`;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Load Google Identity Services script
        const scriptId = 'google-gsi-client';
        const existingScript = document.getElementById(scriptId);

        const initGis = () => {
            if (window.google?.accounts?.id && clientId) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                });
                setGisLoaded(true);
            }
        };

        if (!existingScript) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = initGis;
            document.head.appendChild(script);
        } else if (window.google?.accounts?.id) {
            initGis();
        }
    }, [clientId]);

    const handleGoogleLogin = () => {
        if (loading) return;

        // If Google Identity Services is available, use client-side popup/prompt
        if (window.google?.accounts?.id && clientId) {
            try {
                // Use OAuth2 token client for browser popup flow
                if (window.google.accounts.oauth2) {
                    const client = window.google.accounts.oauth2.initTokenClient({
                        client_id: clientId,
                        scope: 'openid email profile',
                        callback: async (tokenResponse) => {
                            if (tokenResponse && tokenResponse.access_token) {
                                try {
                                    setLoading(true);
                                    const res = await api.post('/auth/google', {
                                        access_token: tokenResponse.access_token,
                                    });
                                    if (res.data && res.data.token) {
                                        setToken(res.data.token);
                                        if (res.data.user || res.data.data) {
                                            setUser(res.data.user || res.data.data);
                                        }
                                        navigate('/dashboard');
                                    }
                                } catch (err) {
                                    console.error("Google token login failed:", err);
                                    window.location.href = `${backendUrl}/auth/google`;
                                } finally {
                                    setLoading(false);
                                }
                            }
                        },
                    });
                    client.requestAccessToken();
                    return;
                }

                // Fallback to Google ID prompt
                window.google.accounts.id.prompt();
                return;
            } catch (err) {
                console.warn("GIS prompt error, falling back to redirect:", err);
            }
        }

        // Fallback to server-side redirect flow
        window.location.href = `${backendUrl}/auth/google`;
    };

    return (
        <motion.button
            whileHover={{ scale: 1.01, backgroundColor: "#f8fafc" }}
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={loading}
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-75"
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
            )}
            <span className="relative z-10">{loading ? "Signing in with Google..." : text}</span>
        </motion.button>
    );
};

export default GoogleLoginButton;

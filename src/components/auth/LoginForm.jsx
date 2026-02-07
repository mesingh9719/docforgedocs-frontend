import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../../api/auth';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AuthInput from './AuthInput';
import GoogleLoginButton from './GoogleLoginButton';
import toast from 'react-hot-toast';

function LoginForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const { setToken } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.state?.message) {
            toast.error(location.state.message, {
                id: 'auth-error', // Prevents duplicates
                icon: '🔒',
                // Removed custom dark styles to inherit from global "corporate" theme
            });
            // Clear state so it doesn't show again on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // Refs for focus management
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email address is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError(null);

        if (!validateForm()) {
            if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) emailRef.current?.focus();
            else if (!formData.password) passwordRef.current?.focus();
            return;
        }

        setLoading(true);

        try {
            const data = await login(formData);
            setToken(data.token);
            if (data.data.business) {
                toast.dismiss(); // Clear any pending toasts (e.g., "Please log in")
                navigate('/dashboard');
            } else {
                toast.dismiss();
                navigate('/onboarding');
            }
        } catch (err) {
            const apiMessage = err.response?.data?.message;
            setGeneralError(apiMessage || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <AnimatePresence>
                {generalError && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100 flex items-center gap-2 overflow-hidden"
                    >
                        <AlertCircle size={16} className="shrink-0" />
                        {generalError}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Google Login Section */}
            <div className="mb-2">
                <GoogleLoginButton text="Sign in with Google" />
            </div>

            <div className="relative flex items-center justify-center mb-2">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative z-10 bg-white px-2 text-xs text-slate-400 font-medium uppercase tracking-wider">Or sign in with email</span>
            </div>

            <div className="space-y-4">
                <AuthInput
                    icon={Mail}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    ref={emailRef}
                    error={errors.email}
                />
                <AuthInput
                    icon={Lock}
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    ref={passwordRef}
                    error={errors.password}
                />
            </div>

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                    <span className="text-slate-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                    Forgot Password?
                </Link>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-slate-800 transition-all focus:ring-4 focus:ring-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 relative overflow-hidden active:scale-[0.98]"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Signing in...
                    </>
                ) : (
                    'Sign In'
                )}
            </button>

            <div className="text-center mt-6">
                <p className="text-slate-500 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 font-bold hover:underline">
                        Create one free
                    </Link>
                </p>
            </div>
        </form>
    );
}

export default LoginForm;

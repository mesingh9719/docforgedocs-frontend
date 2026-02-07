import React, { useState, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { register } from '../../api/auth';
import { Loader2, User, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AuthInput from './AuthInput';
import GoogleLoginButton from './GoogleLoginButton';

function RegisterForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setToken } = useAuth();

    // Refs for focus management
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear specific error on change for premium feel
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Full name is required";
        }

        if (!formData.email) {
            newErrors.email = "Email address is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Strict Password Validation: Min 12 chars, alphanumeric + special
        const password = formData.password;
        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 12) {
            newErrors.password = "Password must be at least 12 characters";
        } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
            newErrors.password = "Must contain letters, numbers, and special characters (!@#$%^&*)";
        }

        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [searchParams] = useSearchParams();
    const redirectPath = searchParams.get('redirect');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError(null);

        if (!validateForm()) {
            // Focus logic
            if (!formData.name.trim()) nameRef.current?.focus();
            else if (errors.email) emailRef.current?.focus();
            else if (errors.password) passwordRef.current?.focus();
            else if (errors.password_confirmation) confirmPasswordRef.current?.focus();
            return;
        }

        setLoading(true);

        try {
            const data = await register(formData);
            setToken(data.token);
            // If there is a redirect path, try to go there (ProtectedRoute handles verification check)
            // otherwise go to the default verification message page
            navigate(redirectPath || '/verify-email-message');
        } catch (err) {
            const apiMessage = err.response?.data?.message;
            const validationErrors = err.response?.data?.errors;

            if (validationErrors) {
                // Map API errors to field errors if possible
                const apiFieldErrors = {};
                if (validationErrors.email) apiFieldErrors.email = validationErrors.email[0];
                if (validationErrors.password) apiFieldErrors.password = validationErrors.password[0];
                if (validationErrors.name) apiFieldErrors.name = validationErrors.name[0];

                setErrors(apiFieldErrors);

                // Fallback for generic display if strictly needed
                if (Object.keys(apiFieldErrors).length === 0) {
                    setGeneralError(apiMessage || 'Registration failed. Please fix the errors.');
                }
            } else {
                setGeneralError(apiMessage || 'Registration failed. Please try again.');
            }
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
                <GoogleLoginButton text="Sign up with Google" />
            </div>

            <div className="relative flex items-center justify-center mb-2">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative z-10 bg-white px-2 text-xs text-slate-400 font-medium uppercase tracking-wider">Or continue with email</span>
            </div>


            <div className="space-y-4">
                <AuthInput
                    icon={User}
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    ref={nameRef}
                    error={errors.name}
                />
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
                    placeholder="Password (12+ chars, special char & number)"
                    ref={passwordRef}
                    error={errors.password}
                />
                <AuthInput
                    icon={Lock}
                    name="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    ref={confirmPasswordRef}
                    error={errors.password_confirmation}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-slate-800 transition-all focus:ring-4 focus:ring-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 relative overflow-hidden active:scale-[0.98]"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        Creating Account...
                    </>
                ) : (
                    'Register'
                )}
            </button>

            <div className="text-center mt-6">
                <p className="text-slate-500 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </form>
    );
}

export default RegisterForm;

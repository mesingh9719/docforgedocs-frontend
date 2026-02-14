import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { acceptInvite } from '../../api/team';
import { useAuth } from '../../context/AuthContext';
import { Loader2, CheckCircle, AlertCircle, User, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';

const AcceptInvite = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setToken, setUser } = useAuth();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [formData, setFormData] = useState({
        name: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token || !email) {
            setError('Invalid invitation link. Please check your email.');
        }
    }, [token, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await acceptInvite({
                token,
                email,
                name: formData.name,
                password: formData.password,
                password_confirmation: formData.password_confirmation
            });

            setSuccess(true);

            // Auto login logic
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                setTimeout(() => {
                    navigate('/dashboard');
                    window.location.reload();
                }, 1500);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to accept invitation.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <AuthLayout title="Welcome Aboard!" subtitle="Setting up your workspace...">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
                        <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <p className="text-slate-600 mb-8 text-lg font-medium">
                        Your account has been set up successfully. We are redirecting you to your dashboard now.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold">
                        <Loader2 className="animate-spin" size={20} />
                        Redirecting...
                    </div>
                </motion.div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Join the Team" subtitle="Set up your account to get started.">
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex gap-3 items-start border border-red-100 overflow-hidden"
                    >
                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {!token || !email ? (
                <div className="text-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20"
                    >
                        Go to Login
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <AuthInput
                            icon={User}
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            required
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <AuthInput
                            icon={Lock}
                            label="Create Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            required
                            minLength={8}
                            showPasswordToggle
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <AuthInput
                            icon={Lock}
                            label="Confirm Password"
                            name="password_confirmation"
                            type="password"
                            value={formData.password_confirmation}
                            onChange={e => setFormData({ ...formData, password_confirmation: e.target.value })}
                            placeholder="••••••••"
                            required
                            minLength={8}
                            showPasswordToggle
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:-translate-y-0.5 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:transform-none disabled:shadow-none"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Setting up...
                                </>
                            ) : (
                                <>
                                    Complete Setup <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </motion.div>
                </form>
            )}
        </AuthLayout>
    );
};

export default AcceptInvite;

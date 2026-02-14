import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { forgotPassword } from '../../api/auth';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthInput from '../../components/auth/AuthInput';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.email?.[0] || 'Failed to send reset link.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <AuthLayout title="Check your inbox" subtitle="We've sent you a password reset link.">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
                        <Mail className="text-green-600" size={32} />
                    </div>
                    <p className="text-slate-600 mb-8 text-lg">
                        We sent a password reset link to <strong className="text-slate-900">{email}</strong>. Please check your email and follow the instructions to reset your password.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline decoration-2 underline-offset-4"
                    >
                        <ArrowLeft className="mr-2" size={16} />
                        Back to sign in
                    </Link>
                </motion.div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Reset password" subtitle="Enter your email and we'll send you a reset link.">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 flex items-center gap-2 overflow-hidden shadow-sm"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <AuthInput
                        icon={Mail}
                        label="Email Address"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        autoFocus
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-slate-800 transition-all focus:ring-4 focus:ring-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Sending link...
                            </>
                        ) : (
                            'Send reset link'
                        )}
                    </button>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            <ArrowLeft className="mr-2" size={16} />
                            Back to sign in
                        </Link>
                    </div>
                </motion.div>
            </form>
        </AuthLayout>
    );
};

export default ForgotPassword;

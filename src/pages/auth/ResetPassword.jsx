import React, { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { resetPassword } from '../../api/auth';
import { Loader2, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthInput from '../../components/auth/AuthInput';

const ResetPassword = () => {
    const { token } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            await resetPassword({
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login', { state: { message: 'Password reset successfully. Please login with your new password.' } });
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.errors?.password?.[0] || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <AuthLayout title="Password Reset" subtitle="Your password has been successfully reset.">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
                        <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <p className="text-slate-600 mb-8 text-lg">
                        You will be redirected to the login page momentarily.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline decoration-2 underline-offset-4"
                    >
                        <ArrowLeft className="mr-2" size={16} />
                        Go to Sign In
                    </Link>
                </motion.div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Set new password" subtitle="Your new password must be different to previously used passwords.">
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

                <input type="hidden" name="email" value={email || ''} />
                <input type="hidden" name="token" value={token || ''} />

                <div className="flex flex-col gap-5">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <AuthInput
                            icon={Lock}
                            label="New Password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            showPasswordToggle
                            autoFocus
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <AuthInput
                            icon={Lock}
                            label="Confirm Password"
                            name="password_confirmation"
                            type="password"
                            required
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            placeholder="••••••••"
                            showPasswordToggle
                        />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
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
                                Resetting password...
                            </>
                        ) : (
                            'Reset password'
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

export default ResetPassword;

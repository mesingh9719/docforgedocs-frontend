import React, { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { resetPassword } from '../../api/auth';
import { Loader2, Lock, ArrowLeft, CheckCircle } from 'lucide-react';

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
                <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="text-green-600" size={24} />
                    </div>
                    <p className="text-slate-600 mb-6">
                        You will be redirected to the login page momentarily.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        <ArrowLeft className="mr-2" size={16} />
                        Go to Sign In
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Set new password" subtitle="Your new password must be different to previously used passwords.">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <input type="hidden" name="email" value={email || ''} />
                <input type="hidden" name="token" value={token || ''} />

                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">New Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-slate-700">Confirm Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            required
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                Resetting password...
                            </>
                        ) : (
                            'Reset password'
                        )}
                    </button>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
                        >
                            <ArrowLeft className="mr-2" size={16} />
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;

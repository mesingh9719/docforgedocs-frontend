import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { forgotPassword } from '../../api/auth';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';

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
                <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <Mail className="text-green-600" size={24} />
                    </div>
                    <p className="text-slate-600 mb-6">
                        We sent a password reset link to <strong>{email}</strong>. Please check your email and follow the instructions to reset your password.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        <ArrowLeft className="mr-2" size={16} />
                        Back to sign in
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Reset password" subtitle="Enter your email and we'll send you a reset link.">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            placeholder="you@example.com"
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
                                Sending link...
                            </>
                        ) : (
                            'Send reset link'
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

export default ForgotPassword;

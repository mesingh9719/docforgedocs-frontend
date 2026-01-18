import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { acceptInvite } from '../../api/team';
import { useAuth } from '../../context/AuthContext';
import { Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AcceptInvite = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setToken, setUser } = useAuth(); // Assuming AuthContext exposes these

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

            // Auto login
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                // We might need to reload or manually set state if AuthContext doesn't auto-read
                // But usually a redirect to dashboard triggers a check or we can set it.
                // Assuming simple auth flow:
                setTimeout(() => {
                    navigate('/dashboard');
                    window.location.reload(); // Hard reload to ensure auth state pick up
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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-100"
                >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Aboard!</h2>
                    <p className="text-slate-600 mb-6">Your account has been set up successfully. Redirecting you to the dashboard...</p>
                    <Loader className="animate-spin mx-auto text-indigo-600" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100"
            >
                <div className="bg-indigo-600 px-8 py-6">
                    <h2 className="text-2xl font-bold text-white mb-1">Join the Team</h2>
                    <p className="text-indigo-100 text-sm">Set up your account to get started.</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg flex gap-3 items-start border border-red-100">
                            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {!token || !email ? (
                        <div className="text-center">
                            <button onClick={() => navigate('/login')} className="text-indigo-600 font-medium hover:underline">
                                Go to Login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Create Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={formData.password_confirmation}
                                    onChange={e => setFormData({ ...formData, password_confirmation: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                {loading && <Loader size={18} className="animate-spin" />}
                                Complete Setup
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AcceptInvite;

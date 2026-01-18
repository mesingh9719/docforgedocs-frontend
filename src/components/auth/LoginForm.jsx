import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/auth';
import { Loader2, Mail, Lock } from 'lucide-react';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await login({ email, password });
            localStorage.setItem('token', data.token);
            // Check if user has a business
            if (data.data.business) {
                navigate('/dashboard');
            } else {
                navigate('/onboarding');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-2 border border-red-100 flex items-center gap-2">
                    <span className="block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 block w-full pl-12 p-3.5 transition-all outline-none"
                        required
                    />
                </div>

                <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 block w-full pl-12 p-3.5 transition-all outline-none"
                        required
                    />
                </div>
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
                className="w-full bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-slate-800 transition-all focus:ring-4 focus:ring-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
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

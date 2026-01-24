import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/auth';
import { Loader2, User, Mail, Lock } from 'lucide-react';

function RegisterForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await register(formData);
            localStorage.setItem('token', data.token);

            if (data.data.business) {
                navigate('/verify-email-message');
            } else {
                navigate('/verify-email-message');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            console.error(err);
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
                    <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 block w-full pl-12 p-3.5 transition-all outline-none"
                        required
                    />
                </div>

                <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 block w-full pl-12 p-3.5 transition-all outline-none"
                        required
                    />
                </div>

                <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 block w-full pl-12 p-3.5 transition-all outline-none"
                        required
                        minLength={8}
                    />
                </div>

                <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 block w-full pl-12 p-3.5 transition-all outline-none"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-slate-800 transition-all focus:ring-4 focus:ring-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
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

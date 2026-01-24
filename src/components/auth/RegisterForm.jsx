import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../api/auth';
import { Loader2, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
    const { setToken } = useAuth(); // Get setToken from context

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Client-side Validation (omitted for brevity in replacement matching, ensuring we keep it)
        if (!formData.name.trim()) {
            setError("Please enter your full name.");
            return;
        }

        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (formData.password !== formData.password_confirmation) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const data = await register(formData);

            // Update Auth Context
            setToken(data.token);

            if (data.data.business) {
                navigate('/verify-email-message');
            } else {
                navigate('/verify-email-message');
            }
        } catch (err) {
            // If the error is a specific validation error (e.g., email taken), use that map if available, 
            // otherwise fallback to general message.
            // Assuming simplified error handling for now as requested.
            const apiMessage = err.response?.data?.message;
            const validationErrors = err.response?.data?.errors;

            if (validationErrors) {
                // If we have field-specific errors, grab the first one
                const firstVideoError = Object.values(validationErrors)[0];
                const msg = Array.isArray(firstVideoError) ? firstVideoError[0] : firstVideoError;
                setError(msg);
            } else {
                setError(apiMessage || 'Registration failed. Please try again.');
            }
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

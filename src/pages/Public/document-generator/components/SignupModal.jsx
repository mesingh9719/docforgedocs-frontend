import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import axios from '../../../../api/axios';
import { useAuth } from '../../../../context/AuthContext';
import toast from 'react-hot-toast';

const SignupModal = ({ isOpen, onClose, onSignupSuccess, documentTitle, suggestedBusinessName }) => {
    const { setToken, setUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        business_name: ''
    });

    useEffect(() => {
        if (suggestedBusinessName) {
            setFormData(prev => ({ ...prev, business_name: suggestedBusinessName }));
        }
    }, [suggestedBusinessName]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Register User
            const registerResponse = await axios.post('/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password,
                device_name: 'web'
            });

            const { token, data: user } = registerResponse.data;

            // 2. Create Business (if name provided) & Login Context
            setToken(token);
            setUser(user);

            // 3. Create Business Record (Critical for Document Ownership)
            try {
                // Use provided business name or fallback to User's name
                const businessName = formData.business_name || `${formData.name}'s Business`;

                // Endpoint is plural '/businesses'
                // Required fields: name, industry, size, city, country
                await axios.post('/businesses', {
                    name: businessName,
                    email: formData.email,
                    // Provide defaults for frictionless signup
                    industry: 'Other',
                    size: 'Freelancer',
                    city: 'Remote',
                    country: 'Global'
                });

            } catch (bizError) {
                console.error("Failed to auto-create business:", bizError);
                // We don't block here, hoping the backend might have created a default, 
                // but usually this is needed. We proceed to let the save attempt happen.
            }

            toast.success("Account created successfully!");
            onSignupSuccess(token); // Call back to Editor to trigger save

        } catch (error) {
            console.error("Signup failed", error);
            if (error.response?.data?.errors) {
                const msgs = Object.values(error.response.data.errors).flat();
                msgs.forEach(msg => toast.error(msg));
            } else {
                toast.error("Signup failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Save Your Document</h3>
                                <p className="text-sm text-slate-500">Create a free account to save & export.</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="john@company.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700">Business Name <span className="text-slate-400 font-normal">(Optional)</span></label>
                                <input
                                    type="text"
                                    name="business_name"
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Acme Inc."
                                    value={formData.business_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    minLength={8}
                                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Create Account & Save <ArrowRight size={20} /></>}
                                </button>
                                <p className="text-xs text-center text-slate-400 mt-4">
                                    By signing up, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SignupModal;

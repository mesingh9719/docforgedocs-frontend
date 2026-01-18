import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Building2, MapPin, Globe, CheckCircle, ChevronRight, ChevronLeft, Upload } from 'lucide-react';

const steps = [
    { id: 1, title: "Company Basics", description: "Tell us about your business." },
    { id: 2, title: "Location & Info", description: "Where are you based?" },
    { id: 3, title: "Branding", description: "Upload your logo (optional)." }
];

function Onboarding() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        size: '',
        city: '',
        country: '',
        website: '',
        logo: null // For file upload
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, logo: e.target.files[0] });
    };

    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                payload.append(key, formData[key]);
            }
        });

        try {
            await axios.post('/businesses', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Force reload to update context
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create business.');
            setLoading(false);
        }
    };

    // Validation for Next button state
    const isStep1Valid = formData.name && formData.industry && formData.size;
    const isStep2Valid = formData.city && formData.country;

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">

                {/* Sidebar / Progress */}
                <div className="bg-slate-900 p-8 md:w-1/3 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-8 text-white font-bold text-xl">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">D</div>
                            DocForge
                        </div>
                        <nav className="space-y-6">
                            {steps.map((step) => (
                                <div key={step.id} className="flex gap-4 relative">
                                    {/* Line connector */}
                                    {step.id !== 3 && (
                                        <div className={`absolute left-[15px] top-8 w-0.5 h-10 ${step.id < currentStep ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                                    )}

                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-colors ${step.id === currentStep ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/50' :
                                        step.id < currentStep ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-500'
                                        }`}>
                                        {step.id < currentStep ? <CheckCircle size={16} /> : step.id}
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold ${step.id === currentStep ? 'text-white' : 'text-slate-400'}`}>{step.title}</h4>
                                        <p className="text-xs text-slate-500 hidden md:block">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Form Area */}
                <div className="p-8 md:w-2/3 flex flex-col relative bg-white">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                        {steps[currentStep - 1].title}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    <form className="flex-grow flex flex-col" onSubmit={handleSubmit}>
                        <AnimatePresence mode='wait'>
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4 flex-grow"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Business Name *</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-3 text-slate-400" size={18} />
                                            <input name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Acme Corp" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Industry *</label>
                                        <select name="industry" value={formData.industry} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required>
                                            <option value="">Select Industry</option>
                                            <option value="Agency">Agency</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Legal">Legal</option>
                                            <option value="Freelance">Freelance</option>
                                            <option value="Consulting">Consulting</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Team Size *</label>
                                        <select name="size" value={formData.size} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required>
                                            <option value="">Select Size</option>
                                            <option value="1">Solo (Just me)</option>
                                            <option value="2-10">2 - 10</option>
                                            <option value="11-50">11 - 50</option>
                                            <option value="50+">50+</option>
                                        </select>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4 flex-grow"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                                <input name="city" value={formData.city} onChange={handleChange} className="w-full pl-10 p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="New York" required />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Country *</label>
                                            <input name="country" value={formData.country} onChange={handleChange} className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="USA" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Website (Optional)</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-3 text-slate-400" size={18} />
                                            <input name="website" value={formData.website} onChange={handleChange} className="w-full pl-10 p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://example.com" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6 flex-grow flex flex-col items-center justify-center text-center"
                                >
                                    <div className="w-full p-8 border-2 border-dashed border-slate-300 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer relative group">
                                        <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Upload size={24} />
                                        </div>
                                        <h3 className="font-bold text-slate-700 mb-1">Upload Logo</h3>
                                        <p className="text-slate-500 text-sm">PNG, JPG up to 2MB</p>
                                        {formData.logo && <p className="text-green-600 font-bold mt-2 text-sm">{formData.logo.name}</p>}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                            {currentStep > 1 ? (
                                <button type="button" onClick={prevStep} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium">
                                    <ChevronLeft size={16} /> Back
                                </button>
                            ) : (
                                <div></div>
                            )}

                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={currentStep === 1 ? !isStep1Valid : !isStep2Valid}
                                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none transition-all"
                                >
                                    Next <ChevronRight size={16} />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-green-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-500/30 disabled:opacity-70 transition-all"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Complete Setup'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Onboarding;

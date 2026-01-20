import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2,
    Building2,
    MapPin,
    Globe,
    CheckCircle,
    ChevronRight,
    ChevronLeft,
    Upload,
    Briefcase,
    Users,
    Laptop,
    Scale,
    PenTool,
    LineChart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const steps = [
    { id: 1, title: "Company Basics", description: "Tell us about your business entity." },
    { id: 2, title: "Demographics", description: "Where are you located?" },
    { id: 3, title: "Branding", description: "Make it yours with a logo." },
    { id: 4, title: "Review", description: "Almost there!" }
];

const industries = [
    { label: "Agency", icon: Briefcase },
    { label: "Technology", icon: Laptop },
    { label: "Legal", icon: Scale },
    { label: "Consulting", icon: LineChart },
    { label: "Freelance", icon: PenTool },
    { label: "Other", icon: Building2 }
];

const teamSizes = [
    { label: "Solo", value: "1", desc: "Just me" },
    { label: "Small", value: "2-10", desc: "Startups" },
    { label: "Medium", value: "11-50", desc: "Growing" },
    { label: "Large", value: "50+", desc: "Enterprise" }
];

function Onboarding() {
    const navigate = useNavigate();
    const { setUser } = useAuth(); // To update user context after creating business? Ideally fetchUser again.
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
        logo: null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFormData({ ...formData, logo: e.target.files[0] });
        }
    };

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
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
            // Reload to refresh AuthContext with new business data (or call fetchUser)
            // For robustness, full reload helps reset everything
            window.location.href = '/dashboard';
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create business. Please try again.');
            setLoading(false);
        }
    };

    // Validation
    const isStep1Valid = formData.name && formData.industry && formData.size;
    const isStep2Valid = formData.city && formData.country;

    // Animation Config
    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-indigo-100 selection:text-indigo-900">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
            >
                {/* Left Sidebar (Premium Look) */}
                <div className="md:w-1/3 bg-slate-900 relative p-8 flex flex-col justify-between overflow-hidden">
                    {/* Background Decor */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-10 text-white font-bold text-2xl">
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center backdrop-blur-md">D</div>
                            DocForge
                        </div>

                        <nav className="space-y-8">
                            {steps.map((step) => {
                                const isActive = step.id === currentStep;
                                const isCompleted = step.id < currentStep;

                                return (
                                    <div key={step.id} className="flex gap-4 relative group">
                                        {/* Connector Line */}
                                        {step.id !== steps.length && (
                                            <div className={`absolute left-[15px] top-10 w-0.5 h-12 ${isCompleted ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
                                        )}

                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-all duration-300 ${isActive ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 scale-110' :
                                            isCompleted ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'
                                            }`}>
                                            {isCompleted ? <CheckCircle size={16} /> : step.id}
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-bold transition-colors ${isActive ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                                                {step.title}
                                            </h4>
                                            <p className={`text-xs transition-colors ${isActive ? 'text-indigo-200' : 'text-slate-600'}`}>
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="relative z-10 text-slate-500 text-xs">
                        © DocForge Inc.
                    </div>
                </div>

                {/* Right Form Area */}
                <div className="md:w-2/3 p-8 md:p-12 flex flex-col bg-white overflow-y-auto">
                    <div className="max-w-xl mx-auto w-full flex-grow flex flex-col">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                {steps[currentStep - 1].title}
                            </h2>
                            <p className="text-slate-500">
                                {steps[currentStep - 1].description}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
                            <AnimatePresence mode='wait' custom={currentStep}>
                                {currentStep === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
                                            <div className="relative group">
                                                <Building2 className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                                <input
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full pl-12 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-medium text-slate-800"
                                                    placeholder="e.g. Acme Corp"
                                                    required
                                                    autoFocus
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-3">Industry</label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {industries.map((ind) => (
                                                    <button
                                                        key={ind.label}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, industry: ind.label })}
                                                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.industry === ind.label
                                                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                                                            : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                                            }`}
                                                    >
                                                        <ind.icon size={24} className={formData.industry === ind.label ? 'text-indigo-600' : 'text-slate-400'} />
                                                        <span className="text-xs font-bold">{ind.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-3">Team Size</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {teamSizes.map((size) => (
                                                    <button
                                                        key={size.value}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, size: size.value })}
                                                        className={`p-3 rounded-xl border-2 text-left transition-all ${formData.size === size.value
                                                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                                                            : 'border-slate-100 hover:border-slate-200'
                                                            }`}
                                                    >
                                                        <div className="font-bold text-sm">{size.label}</div>
                                                        <div className="text-xs opacity-70">{size.desc}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                                    <input
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        className="w-full pl-12 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-medium text-slate-800"
                                                        placeholder="New York"
                                                        required
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Country</label>
                                                <div className="relative group">
                                                    <Globe className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                                    <input
                                                        name="country"
                                                        value={formData.country}
                                                        onChange={handleChange}
                                                        className="w-full pl-12 p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-medium text-slate-800"
                                                        placeholder="USA"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Website <span className="text-slate-400 font-normal">(Optional)</span>
                                            </label>
                                            <input
                                                name="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-medium text-slate-800"
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6 flex flex-col items-center justify-center py-8"
                                    >
                                        <div className="w-full max-w-sm">
                                            <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-3xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-indigo-400 transition-all group overflow-hidden">
                                                <input
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                                {formData.logo ? (
                                                    <div className="relative z-10 text-center">
                                                        <div className="w-20 h-20 mx-auto mb-3 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-200">
                                                            <img
                                                                src={URL.createObjectURL(formData.logo)}
                                                                alt="Logo preview"
                                                                className="max-w-full max-h-full rounded-lg object-contain"
                                                            />
                                                        </div>
                                                        <p className="font-bold text-slate-700">{formData.logo.name}</p>
                                                        <p className="text-xs text-indigo-600 mt-1">Click to change</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                                        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                            <Upload size={28} />
                                                        </div>
                                                        <p className="mb-2 text-sm text-slate-600 font-medium">
                                                            <span className="font-bold text-indigo-600">Click to upload</span> or drag and drop
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            SVG, PNG, JPG or GIF (MAX. 2MB)
                                                        </p>
                                                    </div>
                                                )}
                                            </label>
                                            <div className="mt-6 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => nextStep()} // Skip/Next logic
                                                    className="text-slate-400 hover:text-slate-600 text-sm font-medium"
                                                >
                                                    Skip for now
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center text-center py-8"
                                    >
                                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                            <CheckCircle size={48} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">You're all set!</h3>
                                        <p className="text-slate-500 max-w-sm mb-8">
                                            We have everything we need to set up your workspace for <span className="font-bold text-slate-900">{formData.name}</span>.
                                        </p>

                                        <div className="w-full bg-slate-50 p-6 rounded-2xl text-left border border-slate-100 mb-8">
                                            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Summary</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between border-b border-slate-200 pb-2">
                                                    <span className="text-slate-500">Business Name</span>
                                                    <span className="font-medium text-slate-900">{formData.name}</span>
                                                </div>
                                                <div className="flex justify-between border-b border-slate-200 pb-2">
                                                    <span className="text-slate-500">Industry</span>
                                                    <span className="font-medium text-slate-900">{formData.industry}</span>
                                                </div>
                                                <div className="flex justify-between border-b border-slate-200 pb-2">
                                                    <span className="text-slate-500">Location</span>
                                                    <span className="font-medium text-slate-900">{formData.city}, {formData.country}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Logo</span>
                                                    <span className="font-medium text-slate-900">{formData.logo ? 'Uploaded' : 'Skipped'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-center justify-between mt-auto pt-8">
                                {currentStep > 1 ? (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={loading}
                                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                                    >
                                        <ChevronLeft size={18} /> Back
                                    </button>
                                ) : (
                                    <div></div>
                                )}

                                {currentStep < 4 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={
                                            (currentStep === 1 && !isStep1Valid) ||
                                            (currentStep === 2 && !isStep2Valid)
                                        }
                                        className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:transform-none transition-all"
                                    >
                                        Next <ChevronRight size={18} />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 disabled:opacity-70 transition-all w-full md:w-auto justify-center"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : 'Launch Workspace'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Onboarding;

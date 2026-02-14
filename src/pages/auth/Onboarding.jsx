import React, { useState, useRef } from 'react';
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
    LineChart,
    ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthInput from '../../components/auth/AuthInput';

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
    const { setUser } = useAuth();
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
        setError('');
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError('Invalid file type. Please upload a PNG, JPG, or WEBP file.');
                e.target.value = null;
                return;
            }

            if (file.size > 1024 * 1024) {
                setError('File size exceeds 1MB. Please upload a smaller image.');
                e.target.value = null;
                return;
            }

            setError('');
            setFormData({ ...formData, logo: file });
        }
    };

    const nextStep = () => {
        if (error) return;
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const handleSkip = () => {
        setError('');
        setFormData(prev => ({ ...prev, logo: null }));
        if (currentStep < 4) setCurrentStep(prev => prev + 1);
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
            window.location.href = '/dashboard';
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.errors) {
                const errors = err.response.data.errors;
                if (errors.logo) {
                    setError(errors.logo[0]);
                } else {
                    const firstError = Object.values(errors)[0][0];
                    setError(firstError);
                }
            } else {
                setError(err.response?.data?.message || 'Failed to create business. Please try again.');
            }
            setLoading(false);
        }
    };

    const isStep1Valid = formData.name && formData.industry && formData.size;
    const isStep2Valid = formData.city && formData.country;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px] border border-slate-100"
            >
                {/* Left Sidebar (Premium Look) */}
                <div className="md:w-[35%] bg-slate-900 relative p-10 flex flex-col justify-between overflow-hidden">
                    {/* Background Decor */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 50, 0], y: [0, -50, 0] }}
                            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] mix-blend-screen"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3], x: [0, -50, 0], y: [0, 50, 0] }}
                            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] mix-blend-screen"
                        />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-16 text-white font-bold text-2xl tracking-tight">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl">
                                <span className="font-black text-xl">D</span>
                            </div>
                            DocForge
                        </div>

                        <nav className="space-y-8">
                            {steps.map((step) => {
                                const isActive = step.id === currentStep;
                                const isCompleted = step.id < currentStep;

                                return (
                                    <div key={step.id} className="flex gap-5 relative group">
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
                                            <h4 className={`text-base font-bold transition-colors ${isActive ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                                                {step.title}
                                            </h4>
                                            <p className={`text-sm transition-colors ${isActive ? 'text-indigo-200' : 'text-slate-600'}`}>
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="relative z-10 text-slate-500 text-sm font-medium">
                        © 2024 DocForge Inc.
                    </div>
                </div>

                {/* Right Form Area */}
                <div className="md:w-[65%] p-8 md:p-16 flex flex-col bg-white overflow-y-auto relative">
                    <div className="max-w-2xl mx-auto w-full flex-grow flex flex-col">
                        <div className="mb-10">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                                    {steps[currentStep - 1].title}
                                </h2>
                                <p className="text-slate-500 text-lg">
                                    {steps[currentStep - 1].description}
                                </p>
                            </motion.div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3 overflow-hidden"
                            >
                                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                                <span className="text-sm font-medium">{error}</span>
                            </motion.div>
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
                                        className="space-y-8"
                                    >
                                        <div>
                                            <AuthInput
                                                icon={Building2}
                                                label="Business Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="e.g. Acme Corp"
                                                required
                                                autoFocus
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Industry</label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {industries.map((ind) => (
                                                    <button
                                                        key={ind.label}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, industry: ind.label })}
                                                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${formData.industry === ind.label
                                                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-md shadow-indigo-100'
                                                            : 'border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        <ind.icon size={24} className={formData.industry === ind.label ? 'text-indigo-600' : 'text-slate-400'} />
                                                        <span className="text-sm font-bold">{ind.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Team Size</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {teamSizes.map((size) => (
                                                    <button
                                                        key={size.value}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, size: size.value })}
                                                        className={`p-4 rounded-xl border-2 text-left transition-all ${formData.size === size.value
                                                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-md shadow-indigo-100'
                                                            : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        <div className="font-bold text-base mb-0.5">{size.label}</div>
                                                        <div className="text-xs opacity-70 font-medium">{size.desc}</div>
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
                                        <div className="grid grid-cols-2 gap-5">
                                            <AuthInput
                                                icon={MapPin}
                                                label="City"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                placeholder="New York"
                                                required
                                                autoFocus
                                            />
                                            <AuthInput
                                                icon={Globe}
                                                label="Country"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                placeholder="USA"
                                                required
                                            />
                                        </div>

                                        <AuthInput
                                            icon={Globe}
                                            label="Website (Optional)"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleChange}
                                            placeholder="https://example.com"
                                        />
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
                                            <label className="relative flex flex-col items-center justify-center w-full h-72 border-2 border-slate-200 border-dashed rounded-3xl cursor-pointer bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-400 transition-all group overflow-hidden">
                                                <input
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                                {formData.logo ? (
                                                    <div className="relative z-10 text-center p-6">
                                                        <div className="w-32 h-32 mx-auto mb-4 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100 p-4">
                                                            <img
                                                                src={URL.createObjectURL(formData.logo)}
                                                                alt="Logo preview"
                                                                className="max-w-full max-h-full object-contain"
                                                            />
                                                        </div>
                                                        <p className="font-bold text-slate-800 text-lg mb-1">{formData.logo.name}</p>
                                                        <p className="text-sm text-indigo-600 font-medium bg-indigo-50 inline-block px-3 py-1 rounded-full">Click to change</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center p-6">
                                                        <div className="w-20 h-20 bg-white text-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 group-hover:shadow-md transition-all">
                                                            <Upload size={32} />
                                                        </div>
                                                        <p className="mb-2 text-base text-slate-700 font-bold">
                                                            Click to upload logo
                                                        </p>
                                                        <p className="text-sm text-slate-500 max-w-[200px]">
                                                            SVG, PNG, JPG (Max 2MB)
                                                        </p>
                                                    </div>
                                                )}
                                            </label>
                                            <div className="mt-8 text-center">
                                                <button
                                                    type="button"
                                                    onClick={handleSkip}
                                                    className="text-slate-400 hover:text-slate-600 text-sm font-bold hover:underline"
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
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center text-center py-10"
                                    >
                                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-100">
                                            <CheckCircle size={48} />
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-900 mb-3">You're all set!</h3>
                                        <p className="text-slate-500 max-w-sm mb-10 text-lg">
                                            We're ready to set up <span className="font-bold text-slate-900">{formData.name}</span>.
                                        </p>

                                        <div className="w-full bg-slate-50 p-8 rounded-2xl text-left border border-slate-100 mb-8 max-w-md mx-auto">
                                            <h4 className="font-bold text-slate-900 mb-6 text-xs uppercase tracking-wider text-center">Workspace Summary</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                                    <span className="text-slate-500 text-sm font-medium"><Building2 size={16} className="inline mr-2 -mt-0.5" /> Name</span>
                                                    <span className="font-bold text-slate-900">{formData.name}</span>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                                    <span className="text-slate-500 text-sm font-medium"><Briefcase size={16} className="inline mr-2 -mt-0.5" /> Industry</span>
                                                    <span className="font-bold text-slate-900">{formData.industry}</span>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                                    <span className="text-slate-500 text-sm font-medium"><MapPin size={16} className="inline mr-2 -mt-0.5" /> Location</span>
                                                    <span className="font-bold text-slate-900">{formData.city}, {formData.country}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-500 text-sm font-medium"><Upload size={16} className="inline mr-2 -mt-0.5" /> Logo</span>
                                                    <span className="font-bold text-slate-900">{formData.logo ? 'Uploaded' : 'Default'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-center justify-between mt-auto pt-10 border-t border-slate-50">
                                {currentStep > 1 ? (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        disabled={loading}
                                        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold px-4 py-2 hover:bg-slate-50 rounded-xl transition-colors"
                                    >
                                        <ChevronLeft size={20} /> Back
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
                                            (currentStep === 2 && !isStep2Valid) ||
                                            !!error
                                        }
                                        className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 shadow-xl shadow-slate-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:shadow-none disabled:transform-none transition-all"
                                    >
                                        Next <ChevronRight size={18} />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-3 bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-200 hover:-translate-y-0.5 disabled:opacity-70 transition-all w-full md:w-auto justify-center text-lg"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <>Launch Workspace <ArrowRight size={20} /></>}
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

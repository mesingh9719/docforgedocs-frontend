import React, { useState } from 'react';
import { Zap, Layout, Users, ShieldCheck, ArrowRight, Eye, CheckCircle2, Sparkles, Activity, FileCheck2, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const featureModules = [
    {
        id: 'engine',
        title: 'Smart Document Generator',
        shortDesc: 'Automated clause variables & instant PDF rendering',
        icon: Zap,
        color: 'text-indigo-600',
        badge: 'Core Engine',
        headline: 'Eliminate 90% of paperwork friction with structured variables.',
        details: 'Type once, update everywhere. DocForge automatically propagates party names, fee amounts, payment terms, and governing jurisdictions across every paragraph with zero formatting errors.',
        bullets: [
            'Real-time live document preview rendering in under 50ms',
            'Smart fields with auto-calculation for taxes, discounts & sums',
            'One-click high-res vector PDF generation with print stylesheets'
        ],
        previewTag: 'Document Generator v2.0',
        previewStats: { label: 'Time Saved', val: '85%' }
    },
    {
        id: 'signatures',
        title: 'Legally Binding eSignatures',
        shortDesc: 'ESIGN & eIDAS compliant multi-party signing',
        icon: ShieldCheck,
        color: 'text-emerald-600',
        badge: 'Legal Grade',
        headline: 'Request signatures with drag-and-drop ease. No monthly envelope caps.',
        details: 'Stop paying per signature envelope. Upload your contracts, position signature, date, and initials fields, and invite multiple signers via secure email or direct links.',
        bullets: [
            'Tamper-evident cryptographic SHA-256 certificate generation',
            'Granular audit trails with IP timestamps and device verification',
            'Mobile touch-optimized signature pad for clients on the go'
        ],
        previewTag: 'Digital Signature Module',
        previewStats: { label: 'Signature Turnaround', val: '< 3 hours' }
    },
    {
        id: 'tracking',
        title: 'Real-Time Open Tracking',
        shortDesc: 'Know the second clients view and sign your contracts',
        icon: Activity,
        color: 'text-amber-600',
        badge: 'Deal Intelligence',
        headline: 'Never wonder if a prospect opened your proposal again.',
        details: 'Receive instant notifications when clients click your shared link, view specific proposal pages, or complete signature fields, allowing you to follow up at the highest-intent moment.',
        bullets: [
            'Live view counters and timestamped access history',
            'Automated email reminders for pending signers',
            'Secure expiring access links with token authorization'
        ],
        previewTag: 'Analytics & Tracking Feed',
        previewStats: { label: 'Deal Close Rate', val: '+38%' }
    },
    {
        id: 'teams',
        title: 'Workspaces & Custom Branding',
        shortDesc: 'White-label logos, colors, and role permissions',
        icon: Building2,
        color: 'text-purple-600',
        badge: 'Agency Scale',
        headline: 'Your brand front and center. Seamless team permissions.',
        details: 'Present a hyper-professional appearance. Inject your agency logo, primary brand colors, and typography into every client-facing viewer and PDF export.',
        bullets: [
            'Multi-seat team workspace with Owner, Admin, and Editor roles',
            'Shared company template repository to standardize sales docs',
            'Custom branding and email notification headers'
        ],
        previewTag: 'Team Workspace Manager',
        previewStats: { label: 'Team Efficiency', val: '4.5x' }
    }
];

const FeatureShowcase = () => {
    const navigate = useNavigate();
    const [activeModule, setActiveModule] = useState(featureModules[0].id);
    const active = featureModules.find(m => m.id === activeModule) || featureModules[0];

    return (
        <section id="features-showcase" className="py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles size={14} className="text-indigo-600" /> Complete Agency Operating System
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
                        Engineered for the Entire <span className="shimmer-text">Document Lifecycle</span>
                    </h2>
                    <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                        From guest generation to multi-signer audit seals and team dashboards, DocForge replaces fragmented, expensive tools.
                    </p>
                </div>

                {/* Main Feature Tabs & Preview Container */}
                <div className="bg-white rounded-3xl p-6 md:p-12 border border-slate-200 shadow-2xl shadow-slate-200/50">
                    <div className="grid lg:grid-cols-12 gap-10 items-center">
                        {/* Left: Tab Selector List */}
                        <div className="lg:col-span-5 space-y-3">
                            {featureModules.map((mod) => {
                                const Icon = mod.icon;
                                const isSelected = activeModule === mod.id;
                                return (
                                    <button
                                        key={mod.id}
                                        onClick={() => setActiveModule(mod.id)}
                                        className={`w-full text-left p-5 rounded-2xl transition-all duration-300 flex items-start gap-4 cursor-pointer border ${
                                            isSelected
                                                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/15 border-slate-900 scale-[1.02]'
                                                : 'bg-slate-50/70 hover:bg-slate-100/80 text-slate-800 border-slate-200/70'
                                        }`}
                                    >
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                            isSelected ? 'bg-white/10 text-white' : 'bg-white border border-slate-200 text-slate-700'
                                        }`}>
                                            <Icon size={22} className={isSelected ? 'text-white' : mod.color} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <h3 className="font-extrabold text-base">{mod.title}</h3>
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                                                }`}>
                                                    {mod.badge}
                                                </span>
                                            </div>
                                            <p className={`text-xs leading-relaxed ${
                                                isSelected ? 'text-slate-300' : 'text-slate-500'
                                            }`}>
                                                {mod.shortDesc}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right: Dynamic Module Preview & Deep Dive */}
                        <div className="lg:col-span-7">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={active.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow-2xl relative overflow-hidden"
                                >
                                    {/* Ambient card spotlight */}
                                    <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

                                    <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="font-mono text-slate-400">{active.previewTag}</span>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-md bg-white/10 text-slate-300 font-mono text-[11px]">
                                            Status: Active
                                        </span>
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-black text-white mb-4 leading-snug">
                                        {active.headline}
                                    </h3>

                                    <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-normal">
                                        {active.details}
                                    </p>

                                    {/* Bullet List */}
                                    <div className="space-y-3 mb-8">
                                        {active.bullets.map((bullet, i) => (
                                            <div key={i} className="flex items-center gap-3 text-xs md:text-sm text-slate-200">
                                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                                                    <CheckCircle2 size={13} />
                                                </div>
                                                <span>{bullet}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer Metric and Action */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">
                                                {active.previewStats.val}
                                            </div>
                                            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                                                {active.previewStats.label}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate('/features')}
                                            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer group"
                                        >
                                            <span>Learn More in Features</span>
                                            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureShowcase;


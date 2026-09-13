import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Users, Zap, Briefcase, Layout, CheckCircle2, ArrowRight, Lock, Sparkles, Activity, FileCheck2, Building2, KeyRound, Smartphone, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import { useDocumentLaunch } from '../../hooks/useDocumentLaunch';

const featurePillars = [
    {
        id: 'engine',
        badge: 'Core Technology',
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        title: 'Smart Variable Document Engine',
        headline: 'Automated clause variables. Zero formatting headaches.',
        description: 'DocForge takes the friction out of contract creation. Enter your parties, deliverables, milestones, and payment terms once, and watch them propagate across every legal clause seamlessly.',
        highlights: [
            'Smart real-time variables with live preview rendering',
            'Automated tax, discount, and fee calculation engine',
            'Export to crisp vector PDFs with pre-configured print page breaks',
            'Free document customizer with zero credit card required'
        ],
        ctaText: 'Test Live Document Builder',
        templateId: 'proposal',
        gradient: 'from-indigo-600 to-purple-600'
    },
    {
        id: 'signatures',
        badge: 'Enforceable Trust',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        title: 'Legally Binding Digital Signatures',
        headline: 'ESIGN & eIDAS compliant. Free from envelope caps.',
        description: 'Why pay hundreds of dollars every month for basic signing tools? Send unlimited electronic signature requests, assign signers, and generate tamper-evident certificates with cryptographic precision.',
        highlights: [
            'US Federal ESIGN Act and European eIDAS compliant',
            'Cryptographic SHA-256 certificate stamp with UTC timestamps',
            'Audit trails recording IP addresses, browser agents, and actions',
            'Mobile-optimized touch canvas for clients on any device'
        ],
        ctaText: 'Explore eSignatures',
        ctaLink: '/tools/electronic-signature',
        gradient: 'from-emerald-600 to-teal-600'
    },
    {
        id: 'tracking',
        badge: 'Deal Velocity',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
        title: 'Real-Time Open & Engagement Tracking',
        headline: 'Know the moment your client reviews your proposal.',
        description: 'No more follow-up guessing games. Receive real-time push and email alerts the second a prospect opens your shared link, helping you reach out while intent is at its peak.',
        highlights: [
            'Instant notification when documents are opened and reviewed',
            'Granular event logs for signer completion milestones',
            'Secure token-authenticated viewer links with expiration controls',
            'Automated email reminders to signers with 1-click signing'
        ],
        ctaText: 'Start Tracking Documents',
        ctaLink: '/register',
        gradient: 'from-amber-500 to-orange-600'
    },
    {
        id: 'teams',
        badge: 'Agency Operations',
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
        title: 'Workspaces, Roles & White-Labeling',
        headline: 'Your agency brand front and center. Full team control.',
        description: 'Bring your entire team into a unified workspace. Standardize approved contract templates, manage role permissions, and embed your custom logos and branding on all client-facing portals.',
        highlights: [
            'Multi-seat agency workspaces with Admin, Editor, and Viewer roles',
            'Company-wide template library for standardizing sales collateral',
            'Custom branding: logos, primary color accents, and headers',
            'Centralized document repository with instant keyword search'
        ],
        ctaText: 'Create Team Workspace',
        ctaLink: '/register',
        gradient: 'from-purple-600 to-pink-600'
    }
];

const Features = () => {
    const navigate = useNavigate();
    const { launchDocument, AuthModalComponent } = useDocumentLaunch();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white pt-32 pb-24 overflow-x-hidden">
            <SEO
                title="Features & Capabilities | DocForge"
                description="Explore DocForge's complete feature suite: Smart Document Engine, Legally Binding eSignatures, Real-time Open Tracking, Workspaces, and Bank-Grade Security."
                keywords="DocForge Features, Document Generator, Electronic Signatures, Real-time Proposal Tracking, Agency Contract OS"
            />

            {/* Ambient Background Spotlights */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-indigo-100/50 rounded-full blur-[140px] -translate-y-1/2" />
                <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-grid-pattern opacity-40" />
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles size={14} className="text-indigo-600" /> Complete Feature Matrix
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                        Built for Speed. <br />
                        <span className="shimmer-text">Engineered for Legal Rigor.</span>
                    </h1>
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        DocForge gives your business the tools to generate, negotiate, track, and digitally execute agreements faster than ever before.
                    </p>
                </div>

                {/* Feature Pillars Deep Dive */}
                <div className="space-y-16 mb-24">
                    {featurePillars.map((pillar, idx) => {
                        const isEven = idx % 2 === 1;
                        return (
                            <motion.div
                                key={pillar.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.5 }}
                                className={`bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/40 grid lg:grid-cols-12 gap-10 items-center ${
                                    isEven ? 'lg:flex-row-reverse' : ''
                                }`}
                            >
                                <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : ''}`}>
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4 border ${pillar.badgeColor}`}>
                                        <Sparkles size={12} /> {pillar.badge}
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                                        {pillar.title}
                                    </h2>
                                    <p className="text-sm md:text-base font-semibold text-indigo-600 mb-4">
                                        {pillar.headline}
                                    </p>
                                    <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8">
                                        {pillar.description}
                                    </p>

                                    <div className="space-y-3 mb-8">
                                        {pillar.highlights.map((item, i) => (
                                            <div key={i} className="flex items-start gap-3 text-xs md:text-sm text-slate-700">
                                                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                                                    <CheckCircle2 size={13} strokeWidth={3} />
                                                </div>
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (pillar.templateId) {
                                                launchDocument(pillar.templateId);
                                            } else if (pillar.ctaLink) {
                                                navigate(pillar.ctaLink);
                                            }
                                        }}
                                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer group"
                                    >
                                        <span>{pillar.ctaText}</span>
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>

                                <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : ''}`}>
                                    <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

                                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                                <span className="font-mono text-slate-400">DocForge OS • {pillar.title}</span>
                                            </div>
                                            <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-emerald-400">
                                                Active Module
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Architecture Standard</div>
                                                <div className="text-lg font-black text-white font-mono">{pillar.headline}</div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                                    <div className="text-slate-400 text-[10px] uppercase font-bold">Security Grade</div>
                                                    <div className="text-emerald-400 font-bold mt-0.5">TLS 1.3 / AES-256</div>
                                                </div>
                                                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                                    <div className="text-slate-400 text-[10px] uppercase font-bold">Enforceability</div>
                                                    <div className="text-indigo-400 font-bold mt-0.5">ESIGN & eIDAS 100%</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                            <span>Real-Time Cloud Synchronization</span>
                                            <span className="font-mono text-emerald-400">99.99% Uptime</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Final CTA Strip */}
                <div className="text-center py-16 bg-slate-900 rounded-3xl text-white p-8 border border-slate-800 shadow-2xl">
                    <h2 className="text-3xl md:text-5xl font-black mb-4">Start Drafting Today</h2>
                    <p className="text-slate-400 text-base max-w-xl mx-auto mb-8">
                        Join thousands of agency owners, contractors, and startups who close contracts faster with DocForge.
                    </p>
                    <button
                        onClick={() => launchDocument('nda')}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-base shadow-xl transition-all cursor-pointer"
                    >
                        Launch Free NDA Generator
                    </button>
                </div>
            </main>

            {/* Auth Required Modal */}
            <AuthModalComponent />
        </div>
    );
};

export default Features;

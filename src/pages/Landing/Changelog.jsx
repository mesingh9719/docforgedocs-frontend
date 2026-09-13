import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Tag, ArrowRight, ShieldCheck, Zap, PenTool, Layers, CheckCircle2 } from 'lucide-react';
import SEO from '../../components/SEO';

const releases = [
    {
        version: 'v2.0.0',
        date: 'September 2026',
        tag: 'Major Release',
        tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        title: 'DocForge 2.0 Global Launch & Cryptographic eSignatures',
        summary: 'A massive architectural upgrade featuring our new legally binding electronic signature suite, live interactive document customizer, and SHA-256 audit certifications.',
        features: [
            'Full ESIGN & eIDAS compliant digital signature sandbox with multi-party routing',
            'Cryptographic SHA-256 certificate stamp with verifiable IP & UTC logs',
            'Real-time document open alerts and client view tracking',
            'Interactive Live Document Playground with instant clause customization',
            'New responsive design system built on React 19 and Tailwind CSS v4'
        ]
    },
    {
        version: 'v1.5.0',
        date: 'July 2026',
        tag: 'Feature Update',
        tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        title: 'Smart Variable Engine & Itemized Invoicing',
        summary: 'Introduced automatic clause variable binding, dynamic pricing formulas, and instant vector PDF rendering with customized print stylesheets.',
        features: [
            'Dynamic tax, discount, and retainer calculations on proposals and invoices',
            'Print-optimized pagination preventing orphaned lines across legal contracts',
            'Added Consulting Agreement and Offer Letter standard templates',
            'Guest drafting mode with seamless post-export account creation'
        ]
    },
    {
        version: 'v1.0.0',
        date: 'January 2026',
        tag: 'Initial Beta',
        tagColor: 'bg-slate-100 text-slate-700 border-slate-200',
        title: 'DocForge Public Beta Launch',
        summary: 'The initial public release of DocForge supporting free NDA and Business Proposal generation for agencies and solo creators.',
        features: [
            'Core document drafting canvas with standard legal clauses',
            'Secure PDF generation engine with client downloading',
            'User dashboard with document management and cloud backup'
        ]
    }
];

const Changelog = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white pt-32 pb-24 relative overflow-x-hidden">
            <SEO
                title="Product Changelog & Updates | DocForge"
                description="See what's new in DocForge. Release notes, feature updates, improvements, and roadmap history."
                keywords="DocForge Changelog, product updates, new features, release notes"
            />

            {/* Ambient Background Spotlights */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-indigo-100/40 rounded-full blur-[140px] -translate-y-1/2" />
                <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-grid-pattern opacity-40" />
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
                            <Sparkles size={14} className="text-indigo-600" /> Continuous Improvements
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            Product Updates & <span className="shimmer-text">Changelog</span>
                        </h1>
                        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
                            Stay up to date with new features, performance enhancements, and security upgrades shipped to DocForge.
                        </p>
                    </motion.div>
                </div>

                {/* Changelog Timeline */}
                <div className="space-y-12 mb-24">
                    {releases.map((rel, idx) => (
                        <motion.div
                            key={rel.version}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/40 relative"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-black font-mono text-indigo-600">
                                        {rel.version}
                                    </span>
                                    <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${rel.tagColor}`}>
                                        {rel.tag}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                                    <Calendar size={14} />
                                    <span>{rel.date}</span>
                                </div>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight">
                                {rel.title}
                            </h2>

                            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6 font-medium">
                                {rel.summary}
                            </p>

                            <div className="space-y-2.5">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Key Highlights:
                                </div>
                                {rel.features.map((feat, i) => (
                                    <div key={i} className="flex items-start gap-3 text-xs md:text-sm text-slate-700">
                                        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                                            <CheckCircle2 size={13} strokeWidth={3} />
                                        </div>
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Changelog;

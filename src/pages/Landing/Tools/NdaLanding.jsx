import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, FileText, CheckCircle2, ArrowRight, Sparkles, ChevronDown, Clock, Download, Eye, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../../../components/SEO';
import { useDocumentLaunch } from '../../../hooks/useDocumentLaunch';

const essentialClauses = [
    {
        title: 'Definition of Confidential Information',
        desc: 'Broad yet enforceable definition covering technical data, trade secrets, software code, customer lists, business plans, and financial records.'
    },
    {
        title: 'Exclusions from Confidentiality',
        desc: 'Standard legal exceptions for information already public, independently developed, or rightfully received without restriction.'
    },
    {
        title: 'Non-Disclosure & Non-Circumvention Obligations',
        desc: 'Binding restrictions prohibiting unauthorized sharing, replication, or bypassing the disclosing party to engage directly with clients or partners.'
    },
    {
        title: 'Term & Survival Duration',
        desc: 'Configurable term of protection (1 to 5 years, or perpetual for trade secrets) ensuring post-termination confidentiality survival.'
    },
    {
        title: 'Remedies & Injunctive Relief',
        desc: 'Affirmative right to seek immediate injunctive relief and monetary damages without posting a bond in the event of an unauthorized breach.'
    },
    {
        title: 'Governing Law & Dispute Resolution',
        desc: 'Explicit jurisdiction clause specifying governing state/country courts and legal venue to eliminate jurisdictional ambiguity.'
    }
];

const NdaLanding = () => {
    const navigate = useNavigate();
    const [openClause, setOpenClause] = useState(0);
    const { launchDocument, AuthModalComponent } = useDocumentLaunch();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white pt-32 pb-24 relative overflow-x-hidden">
            <SEO
                title="Free Non-Disclosure Agreement (NDA) Generator | DocForge"
                description="Create a legally binding Non-Disclosure Agreement (NDA) in under 2 minutes. Free mutual and unilateral confidentiality agreements with vector PDF export."
                keywords="free nda generator, non-disclosure agreement template, mutual nda template, confidentiality agreement online, create nda pdf"
            />

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-emerald-100/40 rounded-full blur-[140px] -translate-y-1/2" />
                <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-grid-pattern opacity-40" />
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
                            <Shield size={14} className="text-emerald-600" /> Free Verified Legal Tool
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            Protect Your Intellectual Property with a <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                                Legally Enforceable NDA
                            </span>
                        </h1>
                        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                            Generate a customized, professional Non-Disclosure Agreement in under 2 minutes. Protect trade secrets, investor discussions, and client deliverables.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => launchDocument('nda')}
                                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl font-bold text-base md:text-lg shadow-xl shadow-slate-900/15 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                            >
                                <FileText size={18} />
                                <span>Create Free NDA Now</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl font-bold text-base md:text-lg shadow-sm transition-all cursor-pointer"
                            >
                                Sign Up for eSignature Suite
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-500 font-semibold">
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> 100% Free to Draft</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> Instant PDF Download</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> Enforceable Worldwide</span>
                        </div>
                    </motion.div>
                </div>

                {/* 3 Step Visual Process */}
                <div className="mb-24 bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/40">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                            How It Works in 3 Simple Steps
                        </h2>
                        <p className="text-slate-500 text-sm md:text-base">
                            No complicated legal jargon. Generate standard contracts without paying $500 in attorney fees.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { num: '01', title: 'Enter Party Information', desc: 'Specify disclosing and recipient parties, governing state, and confidentiality duration.' },
                            { num: '02', title: 'Define Protection Scope', desc: 'Select standard or customized confidentiality clauses covering IP, code, and financial data.' },
                            { num: '03', title: 'Export & eSign Instantly', desc: 'Download high-resolution PDF or send for secure digital signature with full audit logs.' }
                        ].map((step, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                                <div className="text-3xl font-black text-emerald-600 font-mono mb-4">{step.num}</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Essential Clauses Checklist Accordion */}
                <div className="mb-24 max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                            Essential Clauses Included in DocForge NDAs
                        </h2>
                        <p className="text-slate-500 text-sm md:text-base">
                            Every template is drafted to balance rigorous legal protection with standard enforceability.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/40 space-y-3">
                        {essentialClauses.map((clause, idx) => {
                            const isOpen = openClause === idx;
                            return (
                                <div key={idx} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                                    <button
                                        onClick={() => setOpenClause(isOpen ? -1 : idx)}
                                        className="w-full py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer group"
                                    >
                                        <span className="text-sm md:text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-2.5">
                                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                            {clause.title}
                                        </span>
                                        <span className={`p-1.5 rounded-lg bg-slate-100 group-hover:bg-emerald-50 text-slate-500 transition-all ${isOpen ? 'rotate-180 bg-emerald-50 text-emerald-600' : ''}`}>
                                            <ChevronDown size={16} />
                                        </span>
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="pb-4 pl-6 text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
                                                    {clause.desc}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Final Launch Banner */}
                <div className="text-center py-16 bg-slate-900 rounded-3xl text-white p-8 border border-slate-800 shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-black mb-4">Protect Your Ideas in Under 2 Minutes</h2>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
                        Generate, preview, and download your customized Non-Disclosure Agreement.
                    </p>
                    <button
                        onClick={() => launchDocument('nda')}
                        className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-base shadow-xl transition-all cursor-pointer"
                    >
                        Launch Free NDA Generator →
                    </button>
                </div>
            </main>

            {/* Auth Required Modal */}
            <AuthModalComponent />
        </div>
    );
};

export default NdaLanding;

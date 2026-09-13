import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Shield, DollarSign, CheckCircle2, ArrowRight, Sparkles, ChevronDown, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../../components/SEO';
import { useDocumentLaunch } from '../../../hooks/useDocumentLaunch';

const consultingClauses = [
    {
        title: 'Scope of Services & Deliverables Matrix',
        desc: 'Detailed specification of strategic consulting, advisory milestones, meeting cadences, and review checkpoints.'
    },
    {
        title: 'Compensation, Retainers & Invoicing Terms',
        desc: 'Clear retainer terms, hourly rate schedules, reimbursable expenses, and late payment interest penalties.'
    },
    {
        title: 'Independent Contractor Status & Tax Indemnity',
        desc: 'Affirms that the consultant operates as a bona fide 1099/independent business entity with zero employer-employee liabilities.'
    },
    {
        title: 'Intellectual Property & Work Product Ownership',
        desc: 'Explicit IP assignment transferring deliverables upon full payment while preserving consultant pre-existing frameworks and tools.'
    },
    {
        title: 'Confidentiality & Non-Solicitation Protections',
        desc: 'Mutual non-disclosure terms and restrictions on soliciting company personnel or clients during the engagement term.'
    },
    {
        title: 'Termination for Cause vs. Convenience',
        desc: 'Standard notice periods (e.g., 14 or 30 days) and pro-rated compensation calculations upon early contract conclusion.'
    }
];

const ConsultingAgreementLanding = () => {
    const navigate = useNavigate();
    const [openClause, setOpenClause] = useState(0);
    const { launchDocument, AuthModalComponent } = useDocumentLaunch();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white pt-32 pb-24 relative overflow-x-hidden">
            <SEO
                title="Free Consulting Services Agreement Generator | DocForge"
                description="Create a comprehensive Consulting Agreement in minutes. Protect your services, define retainers, establish IP boundaries, and export to PDF."
                keywords="consulting agreement template, consulting contract generator, independent contractor agreement, freelance service contract pdf"
            />

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-blue-100/40 rounded-full blur-[140px] -translate-y-1/2" />
                <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-cyan-100/30 rounded-full blur-[120px]" />
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
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                            <FileText size={14} className="text-blue-600" /> Free Contractor & Agency Tool
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            Formalize Client Engagements with a <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                                Robust Consulting Contract
                            </span>
                        </h1>
                        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                            Protect your advisory fees, clarify intellectual property rights, and prevent scope creep with standard independent contractor agreements.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => launchDocument('consulting-agreement')}
                                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-bold text-base md:text-lg shadow-xl shadow-slate-900/15 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                            >
                                <FileText size={18} />
                                <span>Create Free Consulting Contract</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl font-bold text-base md:text-lg shadow-sm transition-all cursor-pointer"
                            >
                                Sign Up for Agency Suite
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-500 font-semibold">
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> Clear Scope of Work</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> IP Ownership Terms</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> Instant PDF Download</span>
                        </div>
                    </motion.div>
                </div>

                {/* Essential Clauses Checklist Accordion */}
                <div className="mb-24 max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                            Key Protective Clauses Included
                        </h2>
                        <p className="text-slate-500 text-sm md:text-base">
                            Engineered to clearly establish your independent status and prevent payment disputes.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/40 space-y-3">
                        {consultingClauses.map((clause, idx) => {
                            const isOpen = openClause === idx;
                            return (
                                <div key={idx} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                                    <button
                                        onClick={() => setOpenClause(isOpen ? -1 : idx)}
                                        className="w-full py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer group"
                                    >
                                        <span className="text-sm md:text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2.5">
                                            <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                                            {clause.title}
                                        </span>
                                        <span className={`p-1.5 rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-500 transition-all ${isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : ''}`}>
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
                    <h2 className="text-3xl md:text-4xl font-black mb-4">Start Your Consulting Contract in 60s</h2>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
                        Generate and customize your comprehensive Consulting Agreement today.
                    </p>
                    <button
                        onClick={() => launchDocument('consulting-agreement')}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-base shadow-xl transition-all cursor-pointer"
                    >
                        Launch Free Consulting Agreement →
                    </button>
                </div>
            </main>

            {/* Auth Required Modal */}
            <AuthModalComponent />
        </div>
    );
};

export default ConsultingAgreementLanding;

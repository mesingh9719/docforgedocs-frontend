import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Briefcase, DollarSign, CheckCircle2, ArrowRight, Sparkles, ChevronDown, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../../components/SEO';
import { useDocumentLaunch } from '../../../hooks/useDocumentLaunch';

const offerClauses = [
    {
        title: 'Position, Role Responsibilities & Reporting Structure',
        desc: 'Clearly specifies official job title, department, direct supervisor/manager, and standard working location.'
    },
    {
        title: 'Base Salary, Bonus Structure & Equity Grants',
        desc: 'Comprehensive compensation breakdown detailing base annualized salary, incentive bonuses, and option vesting schedules.'
    },
    {
        title: 'Healthcare, 401(k) & Paid Time Off (PTO) Allowances',
        desc: 'Full summary of employee benefits, healthcare coverage start dates, retirement match, and annual vacation schedules.'
    },
    {
        title: 'At-Will Employment & Conditions of Hire',
        desc: 'Standard legal terms affirming at-will employment relationship and prerequisite background checks or references.'
    },
    {
        title: 'Proprietary Information & Non-Disclosure Adherence',
        desc: 'Standard employee covenant requiring protection of employer confidential information, software, and trade secrets.'
    }
];

const OfferLetterLanding = () => {
    const navigate = useNavigate();
    const [openClause, setOpenClause] = useState(0);
    const { launchDocument, AuthModalComponent } = useDocumentLaunch();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white pt-32 pb-24 relative overflow-x-hidden">
            <SEO
                title="Free Employee Offer Letter Generator | DocForge"
                description="Create formal, legally sound job offer letters in minutes. Customize salary packages, benefits, at-will terms, and send for electronic signature."
                keywords="job offer letter generator, employment offer template, free offer letter builder, hr offer letter pdf, hire talent fast"
            />

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-rose-100/40 rounded-full blur-[140px] -translate-y-1/2" />
                <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-amber-100/30 rounded-full blur-[120px]" />
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
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-6">
                            <UserCheck size={14} className="text-rose-600" /> Free Hiring & HR Utility
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            Send the Perfect Job Offer That <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600">
                                Top Talent Signs Instantly
                            </span>
                        </h1>
                        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                            Don't let dream candidates wait. Generate polished, legally robust job offer letters with salary packages, equity terms, and electronic signature sign-off.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => launchDocument('offer-letter')}
                                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-rose-600 text-white rounded-2xl font-bold text-base md:text-lg shadow-xl shadow-slate-900/15 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                            >
                                <Briefcase size={18} />
                                <span>Create Free Offer Letter Now</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl font-bold text-base md:text-lg shadow-sm transition-all cursor-pointer"
                            >
                                Sign Up for Full HR Suite
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-500 font-semibold">
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> At-Will Legal Clauses</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> Vector PDF Downloads</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> 1-Click eSign Handshake</span>
                        </div>
                    </motion.div>
                </div>

                {/* Essential Clauses Checklist Accordion */}
                <div className="mb-24 max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                            Essential Clauses Included in Offer Letters
                        </h2>
                        <p className="text-slate-500 text-sm md:text-base">
                            Ensure crystal-clear expectations between your company and prospective new hires.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/40 space-y-3">
                        {offerClauses.map((clause, idx) => {
                            const isOpen = openClause === idx;
                            return (
                                <div key={idx} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                                    <button
                                        onClick={() => setOpenClause(isOpen ? -1 : idx)}
                                        className="w-full py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer group"
                                    >
                                        <span className="text-sm md:text-base font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors flex items-center gap-2.5">
                                            <CheckCircle2 size={16} className="text-rose-500 shrink-0" />
                                            {clause.title}
                                        </span>
                                        <span className={`p-1.5 rounded-lg bg-slate-100 group-hover:bg-rose-50 text-slate-500 transition-all ${isOpen ? 'rotate-180 bg-rose-50 text-rose-600' : ''}`}>
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
                    <h2 className="text-3xl md:text-4xl font-black mb-4">Send an Offer Letter in 90 Seconds</h2>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
                        Instant drafting and PDF export with our comprehensive HR suite.
                    </p>
                    <button
                        onClick={() => launchDocument('offer-letter')}
                        className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-base shadow-xl transition-all cursor-pointer"
                    >
                        Launch Free Offer Letter Generator →
                    </button>
                </div>
            </main>

            {/* Auth Required Modal */}
            <AuthModalComponent />
        </div>
    );
};

export default OfferLetterLanding;

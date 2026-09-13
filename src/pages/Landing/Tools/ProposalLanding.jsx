import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, Users, CheckCircle2, ArrowRight, Sparkles, ChevronDown, DollarSign, FileText, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../../components/SEO';
import { useDocumentLaunch } from '../../../hooks/useDocumentLaunch';

const proposalSections = [
    {
        title: 'Executive Summary & Project Scope',
        desc: 'Concise, compelling overview defining client pain points, strategic objectives, and the high-level roadmap.'
    },
    {
        title: 'Detailed Deliverables & Milestone Timeline',
        desc: 'Phase-by-phase breakdown of tangible assets, sprint goals, revision cycles, and estimated completion dates.'
    },
    {
        title: 'Transparent Pricing & Fee Structure',
        desc: 'Itemized tables with fixed-fee, hourly, or retainer models with automated milestone payment calculations.'
    },
    {
        title: 'Client Responsibilities & Assumptions',
        desc: 'Clarifies feedback turnarounds, asset handoffs, and third-party dependencies to prevent scope creep.'
    },
    {
        title: 'Terms of Acceptance & Digital Signature',
        desc: 'Standard legal terms of engagement, payment terms, and integrated signature block for instant client sign-off.'
    }
];

const ProposalLanding = () => {
    const navigate = useNavigate();
    const [openClause, setOpenClause] = useState(0);
    const { launchDocument, AuthModalComponent } = useDocumentLaunch();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white pt-32 pb-24 relative overflow-x-hidden">
            <SEO
                title="Free Business Proposal Generator & Template | DocForge"
                description="Design winning client proposals with our free professional builder. Structured project scopes, milestone pricing tables, and instant eSignatures."
                keywords="business proposal template, free proposal generator, client proposal creator, agency sales proposal, project proposal builder"
            />

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-indigo-100/40 rounded-full blur-[140px] -translate-y-1/2" />
                <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-purple-100/30 rounded-full blur-[120px]" />
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
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
                            <Zap size={14} className="text-indigo-600" /> High-Converting Sales Engine
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            Create Winning Client Proposals That <br />
                            <span className="shimmer-text">Close Deals 3x Faster</span>
                        </h1>
                        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                            Stop wrestling with clunky Word docs. Build persuasive, beautifully structured proposals with itemized pricing and instant digital sign-off.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => launchDocument('proposal')}
                                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-bold text-base md:text-lg shadow-xl shadow-slate-900/15 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                            >
                                <FileText size={18} />
                                <span>Create Free Proposal Now</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl font-bold text-base md:text-lg shadow-sm transition-all cursor-pointer"
                            >
                                Sign Up for Free
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-500 font-semibold">
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> Interactive Milestones</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> Instant PDF Export</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> Integrated eSignature</span>
                        </div>
                    </motion.div>
                </div>

                {/* Features Value Pillars */}
                <div className="mb-24 grid md:grid-cols-3 gap-8">
                    {[
                        { icon: TrendingUp, title: 'Higher Win Rates', desc: 'Present clean deliverables and clear payment structures that reduce client friction and close deals quickly.' },
                        { icon: DollarSign, title: 'Itemized Pricing Tables', desc: 'Dynamic tables for one-time project fees, phased milestones, or monthly retainers with auto-calculated totals.' },
                        { icon: Users, title: 'Integrated Client Sign-Off', desc: 'Clients can accept and electronically sign directly on the proposal without needing third-party tools.' }
                    ].map((feat, i) => {
                        const Icon = feat.icon;
                        return (
                            <div key={i} className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/40">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Proposal Structure Breakdown */}
                <div className="mb-24 max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                            Key Sections of an Effective Proposal
                        </h2>
                        <p className="text-slate-500 text-sm md:text-base">
                            Built-in building blocks designed to win high-ticket consulting and agency contracts.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/40 space-y-3">
                        {proposalSections.map((sec, idx) => {
                            const isOpen = openClause === idx;
                            return (
                                <div key={idx} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                                    <button
                                        onClick={() => setOpenClause(isOpen ? -1 : idx)}
                                        className="w-full py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer group"
                                    >
                                        <span className="text-sm md:text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2.5">
                                            <CheckCircle2 size={16} className="text-indigo-600 shrink-0" />
                                            {sec.title}
                                        </span>
                                        <span className={`p-1.5 rounded-lg bg-slate-100 group-hover:bg-indigo-50 text-slate-500 transition-all ${isOpen ? 'rotate-180 bg-indigo-50 text-indigo-600' : ''}`}>
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
                                                    {sec.desc}
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
                    <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to Win Your Next Big Client?</h2>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
                        Generate and customize your professional business proposal in under 3 minutes.
                    </p>
                    <button
                        onClick={() => launchDocument('proposal')}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-base shadow-xl transition-all cursor-pointer"
                    >
                        Launch Free Proposal Builder →
                    </button>
                </div>
            </main>

            {/* Auth Required Modal */}
            <AuthModalComponent />
        </div>
    );
};

export default ProposalLanding;

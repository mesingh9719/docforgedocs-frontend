import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Globe, Heart, Laptop, Zap, Sparkles, ArrowRight, DollarSign, BookOpen, Coffee, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';

const perks = [
    { icon: Globe, title: '100% Remote First', desc: 'Work from wherever you are happiest and most productive. We are a globally distributed team.' },
    { icon: DollarSign, title: 'Competitive Pay & Equity', desc: 'Top-tier compensation packages with real equity ownership in DocForge.' },
    { icon: Laptop, title: '$3,500 Home Office Stipend', desc: 'Top-spec MacBook Pro plus budget for 4K monitors, ergonomic chairs, and desk gear.' },
    { icon: BookOpen, title: '$1,500 Annual Learning Fund', desc: 'Dedicated budget for conferences, courses, books, and professional mentorship.' },
    { icon: Heart, title: 'Full Health & Wellness', desc: 'Comprehensive medical, dental, vision coverage, plus mental health subscriptions.' },
    { icon: Coffee, title: 'Flexible & Async Workflow', desc: 'No pointless back-to-back Zoom calls. We prioritize deep focus and asynchronous collaboration.' }
];

const openPositions = [
    {
        id: 'eng-fullstack',
        title: 'Senior Full-Stack Engineer (React / Python)',
        dept: 'Engineering',
        type: 'Full-Time • Remote (Global)',
        desc: 'Help architect our next-generation document engine, cryptographic eSignature verification pipeline, and collaborative canvas.'
    },
    {
        id: 'prod-designer',
        title: 'Senior Product Designer (UI/UX)',
        dept: 'Design',
        type: 'Full-Time • Remote (Global)',
        desc: 'Craft delightful, minimalist interfaces for our document creator, template customizers, and mobile signer flows.'
    },
    {
        id: 'growth-lead',
        title: 'Head of Growth & Developer Marketing',
        dept: 'Marketing',
        type: 'Full-Time • Remote (Global)',
        desc: 'Lead our organic acquisition, SEO tool pipelines, agency partner programs, and community expansion worldwide.'
    }
];

const Careers = () => {
    const navigate = useNavigate();
    const [selectedDept, setSelectedDept] = useState('all');

    const filteredPositions = selectedDept === 'all'
        ? openPositions
        : openPositions.filter(p => p.dept.toLowerCase() === selectedDept.toLowerCase());

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white pt-32 pb-24 relative overflow-x-hidden">
            <SEO
                title="Careers at DocForge | Join Our Mission"
                description="Explore career opportunities at DocForge. We are building the modern document operating system for global teams. 100% remote-first culture."
                keywords="DocForge careers, remote legal tech jobs, software engineering jobs, startup hiring"
            />

            {/* Ambient Background Spotlights */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-indigo-100/40 rounded-full blur-[140px] -translate-y-1/2" />
                <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-pink-100/30 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-grid-pattern opacity-40" />
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Hero Header */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
                            <Sparkles size={14} className="text-indigo-600" /> We Are Hiring
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            Build the Future of Document <br />
                            <span className="shimmer-text">Automation & Trust</span>
                        </h1>
                        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
                            Join a nimble, high-impact remote team reimagining how the modern internet drafts, negotiates, and signs agreements.
                        </p>
                    </motion.div>
                </div>

                {/* Perks Grid */}
                <div className="mb-24">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                            Perks & Benefits
                        </h2>
                        <p className="text-slate-500 text-sm md:text-base">
                            We treat our team with the same respect and autonomy we build into our software.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {perks.map((perk, i) => {
                            const Icon = perk.icon;
                            return (
                                <div key={i} className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/40">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{perk.title}</h3>
                                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{perk.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Open Positions */}
                <div className="mb-24 max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                            Open Opportunities
                        </h2>
                        <p className="text-slate-500 text-sm md:text-base">
                            Find your next career milestone at DocForge.
                        </p>
                    </div>

                    {/* Department filter */}
                    <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
                        {['all', 'engineering', 'design', 'marketing'].map((d) => (
                            <button
                                key={d}
                                onClick={() => setSelectedDept(d)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                    selectedDept === d
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                {d === 'all' ? 'All Roles' : d}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {filteredPositions.map((job) => (
                            <div
                                key={job.id}
                                className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-200 hover:shadow-2xl transition-all"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                                            {job.dept}
                                        </span>
                                        <span className="text-xs font-medium text-slate-400">
                                            {job.type}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{job.title}</h3>
                                    <p className="text-xs md:text-sm text-slate-600 max-w-xl leading-relaxed">{job.desc}</p>
                                </div>

                                <button
                                    onClick={() => navigate('/contact')}
                                    className="px-6 py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-xs md:text-sm whitespace-nowrap transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
                                >
                                    <span>Apply Now</span>
                                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Speculative Application Banner */}
                <div className="p-8 md:p-12 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800 shadow-2xl">
                    <div>
                        <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 block mb-2">
                            Don't See Your Role?
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black mb-2">
                            We Are Always Looking for Exceptional Talent
                        </h3>
                        <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                            Think you can help us forge the next breakthrough in document software? Send your portfolio and background directly to our leadership team.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/contact')}
                        className="px-8 py-4 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl text-sm whitespace-nowrap shadow-xl transition-all cursor-pointer"
                    >
                        Send Speculative Pitch
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Careers;

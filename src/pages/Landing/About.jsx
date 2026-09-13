import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Award, Sparkles, ShieldCheck, HeartHandshake, Zap, Target, Lock, CheckCircle2 } from 'lucide-react';
import SEO from '../../components/SEO';
import { statistics } from './data/landing-data';

const milestones = [
    { year: '2024', title: 'DocForge Conceived', desc: 'Frustrated by expensive $100+/mo DocuSign and PandaDoc subscription models, our founding team built the first open document generator.' },
    { year: '2025', title: 'Smart Variables & PDF Engine', desc: 'Released instant client variable propagation, itemized invoice generators, and high-performance vector PDF rendering.' },
    { year: '2026', title: 'Global Launch & Legal eSign Suite', desc: 'Introduced cryptographic SHA-256 digital signature certification, multi-signer workflows, and agency workspaces.' }
];

const values = [
    {
        icon: Zap,
        title: 'Frictionless First',
        desc: 'We believe you should be able to create, review, and sign documents in under 90 seconds without forced onboarding.'
    },
    {
        icon: ShieldCheck,
        title: 'Uncompromising Legal Rigor',
        desc: 'Every clause and cryptographic hash is crafted to adhere strictly to ESIGN, UETA, and eIDAS compliance standards.'
    },
    {
        icon: HeartHandshake,
        title: 'Customer Autonomy & Trust',
        desc: 'No hidden envelope fees, no shady per-seat traps, and zero unauthorized monetization of your private contracts.'
    },
    {
        icon: Globe,
        title: 'Global By Default',
        desc: 'Built for international agencies, remote consultants, and multi-currency commerce across 120+ countries.'
    }
];

const About = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white pt-32 pb-24 relative overflow-x-hidden">
            <SEO
                title="About Us | DocForge - Forging the Future of Paperwork"
                description="Learn about DocForge's mission to eliminate document friction and empower agencies and freelancers with free, legally rigorous document automation."
                keywords="About DocForge, DocForge team, document management mission, legal tech startup"
            />

            {/* Ambient Background Spotlights */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-indigo-100/40 rounded-full blur-[140px] -translate-y-1/2" />
                <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-purple-100/30 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-grid-pattern opacity-40" />
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
                            <Sparkles size={14} className="text-indigo-600" /> Our Mission & Vision
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            Eliminating Friction So You Can <br />
                            <span className="shimmer-text">Forge Ahead Fearlessly</span>
                        </h1>
                        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
                            We believe administrative overhead shouldn't choke innovation. DocForge empowers creators, agencies, and businesses with instant, beautiful, legally robust document tools.
                        </p>
                    </motion.div>
                </div>

                {/* Live Stats Strip */}
                <div className="mb-24 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {statistics.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/40 text-center">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                                    <Icon size={20} />
                                </div>
                                <div className="text-2xl md:text-3xl font-black text-slate-900 font-mono mb-1">{stat.value}</div>
                                <div className="text-xs font-bold text-slate-600 mb-1">{stat.label}</div>
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider">{stat.change}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Our Story Card */}
                <div className="mb-24 bg-white rounded-3xl p-8 md:p-14 border border-slate-200 shadow-2xl shadow-slate-200/50 max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-6">
                        Origin Story
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">
                        Built by Agency Founders, for Agency Founders
                    </h2>
                    <div className="space-y-4 text-slate-600 text-base md:text-lg leading-relaxed">
                        <p>
                            Like many agency owners and freelancers, we spent thousands of dollars every year juggling fragmented legal templates, clunky PDF editors, and expensive e-signature tools that charged per envelope.
                        </p>
                        <p>
                            Contract negotiation often took days simply because of formatting headaches and clunky signer software. We built DocForge as the lightweight, hyper-fast, legally enforceable alternative we always wished existed.
                        </p>
                        <p>
                            Today, DocForge serves over 12,000 businesses, agencies, and independent consultants worldwide, processing hundreds of thousands of agreements with zero unnecessary friction.
                        </p>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="mb-24 max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                            Our Journey of Innovation
                        </h2>
                        <p className="text-slate-500 text-sm md:text-base">
                            Constantly iterating to bring modern software standards to legal paperwork.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {milestones.map((m, idx) => (
                            <div key={idx} className="flex gap-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm items-start">
                                <span className="text-xl font-black font-mono text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-xl border border-indigo-100 shrink-0">
                                    {m.year}
                                </span>
                                <div>
                                    <h3 className="font-extrabold text-slate-900 text-lg mb-1">{m.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Core Values */}
                <div className="mb-24">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                            Our Core Principles
                        </h2>
                        <p className="text-slate-500 text-sm md:text-base">
                            The non-negotiable principles that drive every feature we ship.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((val, i) => {
                            const Icon = val.icon;
                            return (
                                <div key={i} className="p-7 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-all">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{val.title}</h3>
                                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{val.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Security & Privacy Pledge */}
                <div className="p-8 md:p-12 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800 shadow-2xl">
                    <div>
                        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 block mb-2">
                            Security Pledge
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black mb-2">
                            Your Confidential Data Remains Yours. Period.
                        </h3>
                        <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                            We never train public AI models on your private agreements or sell telemetry data to third parties. All files are encrypted at rest with AES-256.
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/privacy'}
                        className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm whitespace-nowrap shadow-xl transition-all cursor-pointer"
                    >
                        Read Privacy Charter
                    </button>
                </div>
            </main>
        </div>
    );
};

export default About;

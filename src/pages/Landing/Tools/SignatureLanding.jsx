import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, ShieldCheck, Mail, Smartphone, ArrowRight, CheckCircle2, Lock, Sparkles, FileCheck, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../../components/SEO';
import { useDocumentLaunch } from '../../../hooks/useDocumentLaunch';

const SignatureLanding = () => {
    const navigate = useNavigate();
    const { launchDocument, AuthModalComponent } = useDocumentLaunch();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white pt-32 pb-24 relative overflow-x-hidden">
            <SEO
                title="Electronic Signature Software | Sign Documents Online | DocForge"
                description="Legally binding electronic signatures with zero envelope caps. ESIGN & eIDAS compliant signing, cryptographic SHA-256 audit trails, and mobile signing pads."
                keywords="electronic signature software, free esign pdf, sign documents online, legally binding digital signature, docusign alternative"
            />

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-purple-100/40 rounded-full blur-[140px] -translate-y-1/2" />
                <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[120px]" />
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
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider mb-6">
                            <PenTool size={14} className="text-purple-600" /> Free eSignature Suite
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            The Easiest, Most Secure Way to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600">
                                Sign Contracts Online
                            </span>
                        </h1>
                        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                            Stop printing, scanning, and paying monthly fees for DocuSign. Upload any PDF, place signature fields, and execute legally binding agreements in seconds.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => launchDocument('signature')}
                                className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-base md:text-lg shadow-xl shadow-purple-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                            >
                                <PenTool size={18} />
                                <span>Start eSigning for Free</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => {
                                    const el = document.getElementById('signature-workflow');
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl font-bold text-base md:text-lg shadow-sm transition-all cursor-pointer"
                            >
                                How It Works
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-500 font-semibold">
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> ESIGN & eIDAS Compliant</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> SHA-256 Audit Trail</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> Mobile Signing Support</span>
                        </div>
                    </motion.div>
                </div>

                {/* 3 Step Workflow */}
                <div id="signature-workflow" className="scroll-mt-24 mb-24 bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/40">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                            Three Simple Steps to Executed Agreements
                        </h2>
                        <p className="text-slate-500 text-sm md:text-base">
                            Fast, intuitive signer flows with zero software downloads or mandatory logins for clients.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { num: '01', title: 'Upload Any Document', desc: 'Drag and drop your PDF or build standard agreements directly within DocForge in one click.' },
                            { num: '02', title: 'Place Fields & Assign Signers', desc: 'Drop signature, date, and text fields onto the document and assign signer emails.' },
                            { num: '03', title: 'Send & Get Certified Copy', desc: 'Signers sign on mobile or desktop. Everyone receives a cryptographic audit certificate upon completion.' }
                        ].map((step, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                                <div className="text-3xl font-black text-purple-600 font-mono mb-4">{step.num}</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features Value Grid */}
                <div className="mb-24 grid md:grid-cols-3 gap-8">
                    {[
                        { icon: ShieldCheck, title: 'Tamper-Proof Audit Trail', desc: 'Every signature generates an immutable log recording signer IP addresses, UTC timestamps, and document hashes.' },
                        { icon: Smartphone, title: 'Mobile Touch Signing Pad', desc: 'Signers can draw, type cursive signatures, or upload signatures effortlessly on their mobile phones.' },
                        { icon: Mail, title: 'Automated Reminders', desc: 'Set up automated reminder nudges to signers with expiring links to expedite contract closing.' }
                    ].map((feat, i) => {
                        const Icon = feat.icon;
                        return (
                            <div key={i} className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/40">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mb-6">
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Final Launch Banner */}
                <div className="text-center py-16 bg-slate-900 rounded-3xl text-white p-8 border border-slate-800 shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-black mb-4">Send Your First Contract for eSignature</h2>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
                        No credit card required. Free eSignature requests included on every account.
                    </p>
                    <button
                        onClick={() => launchDocument('signature')}
                        className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl text-base shadow-xl transition-all cursor-pointer"
                    >
                        Start eSigning for Free →
                    </button>
                </div>
            </main>

            {/* Auth Required Modal */}
            <AuthModalComponent />
        </div>
    );
};

export default SignatureLanding;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText, ArrowRight, Shield, Zap, FileCheck, CheckCircle,
    Star, Users, Clock, Lock, ChevronDown, ChevronUp, Layout, MousePointerClick
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';

// --- Data ---

const templates = [
    {
        id: 'nda',
        title: 'Non-Disclosure Agreement',
        subtitle: 'Protect your ideas instantly.',
        description: 'Generate a legally binding NDA in minutes. Perfect for freelancers, agencies, and startup discussions.',
        icon: Shield,
        color: 'bg-emerald-500',
        gradient: 'from-emerald-500 to-teal-400',
        bg: 'bg-emerald-50',
        border: 'border-emerald-100'
    },
    {
        id: 'proposal',
        title: 'Business Proposal',
        subtitle: 'Win more clients, faster.',
        description: 'Create stunning, structured proposals with pricing tables and timelines. Export as PDF or send online.',
        icon: Zap,
        color: 'bg-indigo-500',
        gradient: 'from-indigo-500 to-purple-500',
        bg: 'bg-indigo-50',
        border: 'border-indigo-100'
    },
    {
        id: 'consulting-agreement',
        title: 'Consulting Agreement',
        subtitle: 'Secure your services.',
        description: 'Formalize your client relationships with a comprehensive consulting services agreement.',
        icon: FileText,
        color: 'bg-blue-500',
        gradient: 'from-blue-500 to-cyan-400',
        bg: 'bg-blue-50',
        border: 'border-blue-100'
    }
];

const faqs = [
    {
        q: "Is it really free? What's the catch?",
        a: "Yes, it is 100% free to generate and export documents. We provide this tool to help freelancers and small businesses. If you want advanced features like eSignatures and analytics, you can upgrade to a full account later."
    },
    {
        q: "Do I need to create an account first?",
        a: "No! You can draft your entire document as a guest. We only ask you to create a password when you save/export, so you can access your document later. It's a seamless process."
    },
    {
        q: "Are these documents legally binding?",
        a: "Our templates are drafted by legal professionals to be standard and enforceable. However, we are not a law firm, and for high-stakes deals, we always recommend consulting a lawyer."
    },
    {
        q: "Can I edit the document after saving?",
        a: "Absolutely. Once you save, the document is stored in your secure dashboard. You can edit, duplicate, or send it for signature at any time."
    }
];

// --- Components ---

const FaqItem = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
            >
                <span className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{q}</span>
                {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-slate-600 leading-relaxed pr-8">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StepCard = ({ number, title, desc, icon: Icon }) => (
    <div className="relative p-6 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-300">
        <div className="absolute -top-6 w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-lg border-4 border-white">
            {number}
        </div>
        <div className="mt-8 mb-4 w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <Icon size={24} />
        </div>
        <h3 className="font-bold text-lg text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
);

const FeatureSpot = ({ icon: Icon, title, desc }) => (
    <div className="flex gap-4">
        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Icon size={20} />
        </div>
        <div>
            <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
        </div>
    </div>
);

// --- Main Page ---

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <SEO
                title="DocForge - Free NDA & Proposal Generator"
                description="The operating system for modern agencies. Generate professional NDAs, Proposals, and Invoices for free. No signup required to start."
                keywords="Free NDA Generator, Business Proposal Creator, Consulting Agreement Template, Online Legal Documents, Agency Software"
            />

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/4" />
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[100px] opacity-40 -translate-y-1/2 -translate-x-1/4" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
            </div>

            <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">

                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Free to use, forever</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-8 leading-[1.1]"
                    >
                        Review Less. <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Close Deals Faster.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium mb-12 max-w-2xl mx-auto"
                    >
                        Skip the formatting headaches. Generate professional, legally rigorous documents in seconds.
                        <span className="text-indigo-600 font-bold"> No signup required to start.</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button onClick={() => document.getElementById('templates').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/20">
                            Start Drafting Free
                        </button>
                        <button onClick={() => navigate('/features')} className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-bold text-lg hover:border-slate-300 transition-all flex items-center gap-2">
                            View All Features
                        </button>
                    </motion.div>
                </div>

                {/* Social Proof */}
                <div className="mb-32 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by modern teams</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Simple Text Logos for Demo */}
                        {['Acme Corp', 'Nebula', 'GlobalBank', 'TechFlow', 'SaaS.io'].map(logo => (
                            <span key={logo} className="text-xl font-black text-slate-800">{logo}</span>
                        ))}
                    </div>
                </div>

                {/* Templates Grid (The Tool) */}
                <div id="templates" className="scroll-mt-24 mb-32">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Start Drafting</h2>
                        <p className="text-slate-500">Select a document type to launch the live editor.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {templates.map((template, idx) => (
                            <motion.div
                                key={template.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -8 }}
                                onClick={() => navigate(`/create-document/${template.id}`)}
                                className={`group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all cursor-pointer overflow-hidden flex flex-col h-full`}
                            >
                                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${template.gradient}`} />

                                <div className={`w-14 h-14 rounded-2xl ${template.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <template.icon size={28} className={template.color.replace('bg-', 'text-')} />
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{template.title}</h3>
                                <p className="text-indigo-600 font-medium text-sm mb-4">{template.subtitle}</p>
                                <p className="text-slate-500 leading-relaxed mb-8 flex-1">{template.description}</p>

                                <div className="flex items-center text-slate-900 font-bold text-sm group-hover:gap-2 transition-all mt-auto pt-6 border-t border-slate-50">
                                    Launch Editor <ArrowRight size={16} className="ml-2" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* How It Works */}
                <div className="mb-32 bg-slate-50 rounded-3xl p-8 md:p-16 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white rounded-full blur-[80px] opacity-50 -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How it works</h2>
                            <p className="text-slate-500 max-w-xl mx-auto">We've removed the friction. Go from zero to signed document in less than 5 minutes.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 md:gap-12 px-4 pt-4">
                            <StepCard
                                number="1"
                                title="Select & Draft"
                                desc="Choose a template and use our guest editor to fill in the details. No account needed."
                                icon={MousePointerClick}
                            />
                            <StepCard
                                number="2"
                                title="Save & Secure"
                                desc="Click save when you're done. We'll automatically create a secure account for you."
                                icon={Lock}
                            />
                            <StepCard
                                number="3"
                                title="Export or Send"
                                desc="Download as PDF or share seamlessly with your clients for eSignature."
                                icon={FileCheck}
                            />
                        </div>
                    </div>
                </div>

                {/* SaaS Spotlight (Upsell) */}
                <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                            Powered by DocForge
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                            More than just a generator. <br />
                            <span className="text-indigo-600">Your entire workflow.</span>
                        </h2>
                        <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                            This free tool is just the beginning. DocForge is the complete operating system for modern agencies and freelancers.
                        </p>

                        <div className="space-y-6">
                            <FeatureSpot
                                icon={Zap}
                                title="Integrated eSignatures"
                                desc="Stop paying for Docusign. Request enforceable signatures directly on your documents."
                            />
                            <FeatureSpot
                                icon={Layout}
                                title="Smart Dashboard"
                                desc="Track every proposal sent. See when clients open them and get notified instantly."
                            />
                            <FeatureSpot
                                icon={Users}
                                title="Team Collaboration"
                                desc="Invite your team to draft, review, and approve documents together."
                            />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-600 rounded-3xl rotate-3 opacity-10"></div>
                        <div className="relative bg-slate-900 rounded-3xl p-2 shadow-2xl border border-slate-800">
                            <img
                                src="/images/dashboard-preview.png"
                                alt="DocForge Dashboard"
                                className="rounded-2xl w-full h-auto opacity-90"
                            />
                            {/* Floating Stats */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce-slow">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <Star size={20} fill="currentColor" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase">Conversion Rate</div>
                                    <div className="font-bold text-slate-900 text-lg">+34%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Digital Signature Upsell */}
                <div id="signatures" className="scroll-mt-24 mb-32 grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 relative">
                        <div className="absolute inset-0 bg-emerald-500 rounded-3xl -rotate-2 opacity-10"></div>
                        <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-slate-100">
                            {/* Mockup of a signed document footer */}
                            <div className="space-y-4 font-serif text-slate-800 opacity-80 mb-8">
                                <div className="h-4 bg-slate-100 rounded w-full"></div>
                                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                                <div className="h-4 bg-slate-100 rounded w-4/6"></div>
                            </div>

                            <div className="flex justify-between items-end border-t border-slate-200 pt-6">
                                <div>
                                    <div className="text-xs text-slate-400 uppercase font-bold mb-2">Signed by</div>
                                    <div className="font-handwriting text-3xl text-indigo-900">John Doe</div>
                                    <div className="text-xs text-slate-400 mt-1">Sep 28, 2026 • 10:42 AM</div>
                                </div>
                                <div className="ml-auto">
                                    <div className="w-16 h-16 border-4 border-emerald-500 rounded-full flex items-center justify-center text-emerald-600 rotate-12 bg-emerald-50">
                                        <CheckCircle size={32} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                            New Feature
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                            Secure, Legally Binding <br />
                            <span className="text-emerald-600">Digital Signatures.</span>
                        </h2>
                        <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                            Stop chasing clients for printers and scanners. Upload any PDF, place signature fields, and send for e-signature in seconds.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {[
                                "Bank-grade security & audit trails",
                                "Unlimited signature requests",
                                "Real-time status tracking"
                            ].map(feature => (
                                <li key={feature} className="flex items-center gap-3 text-slate-700 font-medium">
                                    <CheckCircle size={20} className="text-emerald-500 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => navigate('/register?redirect=/signatures')}
                            className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition-all hover:scale-105 shadow-xl shadow-emerald-500/20 flex items-center gap-2"
                        >
                            Try eSignatures Free <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto mb-32">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-2">
                        {faqs.map((faq, i) => (
                            <FaqItem key={i} q={faq.q} a={faq.a} />
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center py-20 bg-indigo-600 rounded-3xl relative overflow-hidden shadow-2xl shadow-indigo-500/30">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 px-6">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to look professional?</h2>
                        <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">Create your first document now. It takes less than 2 minutes.</p>
                        <button onClick={() => document.getElementById('templates').scrollIntoView({ behavior: 'smooth' })} className="px-10 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all hover:scale-105 shadow-xl">
                            Start Drafting
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Welcome;
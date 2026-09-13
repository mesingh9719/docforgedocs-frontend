import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowRight, 
    Sparkles, 
    ShieldCheck, 
    CheckCircle2, 
    Zap, 
    FileText, 
    PenTool, 
    DollarSign, 
    Briefcase, 
    Building2,
    Lock,
    Play
} from 'lucide-react';
import { useDocumentLaunch } from '../../../hooks/useDocumentLaunch';

const quickTemplates = [
    { id: 'nda', name: 'Mutual NDA', icon: ShieldCheck, color: 'text-indigo-600' },
    { id: 'proposal', name: 'Project Proposal', icon: FileText, color: 'text-blue-600' },
    { id: 'invoice', name: 'Invoice Generator', icon: DollarSign, color: 'text-emerald-600' },
    { id: 'consulting-agreement', name: 'Consulting Contract', icon: Briefcase, color: 'text-purple-600' },
    { id: 'offer-letter', name: 'Offer Letter', icon: Building2, color: 'text-amber-600' },
    { id: 'signature', name: 'eSignature Vault', icon: PenTool, color: 'text-pink-600' },
];

function HeroSection() {
    const navigate = useNavigate();
    const { launchDocument, AuthModalComponent } = useDocumentLaunch();

    return (
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden text-center">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[350px] md:h-[450px] bg-gradient-to-tr from-indigo-500/15 via-blue-500/10 to-purple-500/15 blur-3xl -z-10 rounded-full pointer-events-none" />

            {/* Announcement Pill */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-200/80 text-indigo-700 text-xs md:text-sm font-semibold mb-8 shadow-sm backdrop-blur-sm cursor-pointer hover:bg-indigo-100/80 transition-all"
                onClick={() => launchDocument('nda')}
            >
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="font-bold">DocForge 2.4</span>
                <span className="text-indigo-400">•</span>
                <span>SHA-256 Cryptographic Audit Logs &amp; Smart Fields</span>
                <ArrowRight size={14} className="text-indigo-500" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight leading-[1.08] mb-8 max-w-5xl mx-auto"
            >
                Smart contracts &amp;{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800">
                    eSignatures
                </span>{' '}
                for fast-moving teams.
            </motion.h1>

            {/* Subheading */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg sm:text-xl md:text-2xl text-slate-600 font-normal leading-relaxed mb-10 max-w-3xl mx-auto"
            >
                The modern document operating system for agencies, consultants, and founders. Create rock-solid NDAs, winning proposals, and legally binding eSignatures in seconds.
                <span className="font-bold text-slate-900 block mt-2">100% Free to start • Instant cryptographic audit trails.</span>
            </motion.p>

            {/* Primary Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
                <button
                    onClick={() => {
                        const el = document.getElementById('templates');
                        el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-base md:text-lg shadow-xl shadow-slate-900/20 hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer group hover:-translate-y-0.5"
                >
                    <span>Explore Document Templates</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                    onClick={() => {
                        const el = document.getElementById('interactive-playground');
                        el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-8 py-4 bg-white/90 hover:bg-white text-slate-800 hover:text-indigo-600 border border-slate-200/90 rounded-2xl font-bold text-base md:text-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                    <Play size={16} className="fill-indigo-600 text-indigo-600" />
                    <span>Try Interactive Preview</span>
                </button>
            </motion.div>

            {/* Quick Template Launch Pills */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/70 shadow-lg shadow-slate-200/40 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-left"
            >
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 pl-2">
                    Quick Launch:
                </span>
                <div className="flex items-center gap-2 flex-wrap justify-center w-full sm:w-auto">
                    {quickTemplates.map((t) => {
                        const Icon = t.icon;
                        return (
                            <button
                                key={t.id}
                                onClick={() => launchDocument(t.id)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/70 hover:border-indigo-200 text-xs font-bold text-slate-700 hover:text-indigo-900 transition-all cursor-pointer"
                            >
                                <Icon size={14} className={t.color} />
                                <span>{t.name}</span>
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Trust Micro-Badges */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex items-center justify-center gap-6 md:gap-10 mt-8 text-xs font-semibold text-slate-500 flex-wrap"
            >
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>ESIGN &amp; eIDAS Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>Bank-Grade 256-Bit TLS</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>Immutable SHA-256 Audit Trail</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>Zero Credit Card Needed</span>
                </div>
            </motion.div>

            {/* Auth Required Modal */}
            <AuthModalComponent />
        </section>
    );
}

export default HeroSection;

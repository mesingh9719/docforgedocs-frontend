import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    FileText,
    Users,
    Shield,
    Zap,
    CheckCircle,
    Layout,
    ArrowRight,
    Star,
    Menu,
    X,
    Play,
    Globe,
    Layers,
    Cpu
} from 'lucide-react';
import SEO from '../components/SEO';

// --- Animations ---
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

// --- Sub-Components ---

const FeaturePill = ({ icon: Icon, text }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-slate-200 backdrop-blur-sm text-sm font-medium text-slate-700 shadow-sm">
        <Icon size={14} className="text-indigo-600" />
        {text}
    </div>
);

const LogoTicker = () => (
    <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
            {['Acme Corp', 'GlobalBank', 'Nebula', 'SaaS Flow', 'TechStar', 'Vortex', 'Acme Corp', 'GlobalBank'].map((name, i) => (
                <li key={i} className="text-xl font-bold text-slate-300 whitespace-nowrap uppercase tracking-widest font-mono">
                    {name}
                </li>
            ))}
        </ul>
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
            {['Acme Corp', 'GlobalBank', 'Nebula', 'SaaS Flow', 'TechStar', 'Vortex', 'Acme Corp', 'GlobalBank'].map((name, i) => (
                <li key={i} className="text-xl font-bold text-slate-300 whitespace-nowrap uppercase tracking-widest font-mono">
                    {name}
                </li>
            ))}
        </ul>
    </div>
);

const WorkflowTabs = () => {
    const [activeTab, setActiveTab] = useState('create');

    const tabs = [
        {
            id: 'create',
            label: 'Create',
            icon: FileText,
            color: 'bg-indigo-500',
            content: {
                title: "Draft at the Speed of Thought",
                desc: "Forget starting from scratch. Use our smart templates to generate NDAs, Proposals, and Invoices in seconds.",
                features: ["Smart Variables", "Rich Text Editor", "Branded Templates"],
                visual: (
                    <div className="bg-slate-900 rounded-lg p-6 shadow-2xl border border-slate-700 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        </div>
                        <div className="space-y-3 flex-1">
                            <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse" />
                            <div className="h-4 bg-slate-800 rounded w-1/2" />
                            <div className="h-32 bg-slate-800/50 rounded border border-slate-700 mt-4 p-4">
                                <span className="text-indigo-400 font-mono text-sm">{'{{client_name}}'}</span>
                            </div>
                        </div>
                    </div>
                )
            }
        },
        {
            id: 'track',
            label: 'Track',
            icon: Layers,
            color: 'bg-purple-500',
            content: {
                title: "Total Visibility",
                desc: "Know exactly when your client opens a document. No more guessing games or awkward follow-ups.",
                features: ["Real-time Open Alerts", "Version History", "Audit Logs"],
                visual: (
                    <div className="bg-white rounded-lg p-6 shadow-2xl border border-slate-200 h-full flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live
                            </div>
                        </div>
                        <div className="space-y-4 mt-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <Users size={14} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="h-2 bg-slate-200 rounded w-24 mb-1" />
                                        <div className="h-2 bg-slate-100 rounded w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        },
        {
            id: 'sign',
            label: 'Get Paid',
            icon: Zap,
            color: 'bg-emerald-500',
            content: {
                title: "Close the Deal",
                desc: "Turn proposals into signed contracts and paid invoices seamlessly. One platform, zero friction.",
                features: ["eSignatures", "Instant Invoicing", "Auto-Reminders"],
                visual: (
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-6 shadow-2xl text-white h-full flex flex-col justify-center items-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-4">
                            <CheckCircle size={32} className="text-white" />
                        </div>
                        <div className="text-2xl font-bold mb-1">$4,250.00</div>
                        <div className="text-emerald-100 text-sm">Invoice Paid</div>
                    </div>
                )
            }
        }
    ];

    return (
        <div className="bg-slate-50 rounded-3xl p-2 md:p-8 border border-slate-100">
            <div className="flex flex-wrap justify-center gap-2 mb-12">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 px-4"
                    >
                        <h3 className="text-3xl font-bold text-slate-900">{tabs.find(t => t.id === activeTab).content.title}</h3>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            {tabs.find(t => t.id === activeTab).content.desc}
                        </p>
                        <ul className="space-y-3">
                            {tabs.find(t => t.id === activeTab).content.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                    <div className={`p-1 rounded-full ${activeTab === 'create' ? 'bg-indigo-100 text-indigo-600' : activeTab === 'track' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                        <CheckCircle size={14} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab + '-visual'}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="h-full min-h-[300px]"
                    >
                        {tabs.find(t => t.id === activeTab).content.visual}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const TestimonialCard = ({ quote, author, role, company }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex gap-1 text-amber-400 mb-4">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
        </div>
        <p className="text-slate-700 text-lg leading-relaxed mb-6 font-medium">"{quote}"</p>
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">
                {author[0]}
            </div>
            <div>
                <div className="font-bold text-slate-900 text-sm">{author}</div>
                <div className="text-slate-500 text-xs">{role}, {company}</div>
            </div>
        </div>
    </div>
);

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-200 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
            >
                <span className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{question}</span>
                <ChevronRight className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-slate-600 leading-relaxed pr-8">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Main Page Component ---
const Welcome = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
            <SEO
                title="NDA Generator, Proposal Software & Invoicing for Freelancers"
                description="Securely create and sign NDAs, Proposals, and Invoices. The best document management platform for modern freelancers and agencies."
                keywords="NDA Generator, Proposal Software, Invoice Maker, Freelance Tools, eSignature, Document Management"
            />

            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/80 rounded-full blur-3xl opacity-50 -z-10" />
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-100 to-transparent" />
            </div>

            <div className="relative z-10">

                {/* Hero Section - Premium 3D & Aurora */}
                <section className="relative pt-32 pb-32 lg:pt-48 lg:pb-40 px-6 overflow-hidden">
                    {/* Aurora Background */}
                    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/30 rounded-full blur-[100px] animate-blob mix-blend-multiply" />
                        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/30 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply" />
                        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-pink-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
                    </div>

                    <div className="max-w-6xl mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 font-bold text-[10px] uppercase tracking-wider mb-8 shadow-sm backdrop-blur-md"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            v2.0 Now Available
                        </motion.div>

                        <h1
                            className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[1]"
                        >
                            The OS for <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
                                Modern Agencies.
                            </span>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
                        >
                            Create proposals that win, contracts that protect, and invoices that get paid. All in one fluid workspace.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                        >
                            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20 flex items-center justify-center gap-2 group relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                                Start Free Trial
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/features" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all hover:border-slate-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                                <Play size={18} fill="currentColor" className="text-slate-900" />
                                Watch Demo
                            </Link>
                        </motion.div>

                        {/* 3D Tilt Dashboard Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 100, rotateX: 20 }}
                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1.2, type: "spring", bounce: 0.2 }}
                            style={{ perspective: "2000px" }}
                            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                        >
                            <motion.div
                                className="relative rounded-2xl bg-slate-900 p-3 shadow-2xl ring-1 ring-slate-900/10"
                                whileHover={{ rotateX: 5, scale: 1.02 }}
                                transition={{ duration: 0.5 }}
                                style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}
                            >
                                {/* Screen Bezel */}
                                <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[16/10] relative shadow-inner">
                                    {/* Real Dashboard Image */}
                                    <div className="absolute inset-x-0 top-0 h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2 z-10 transition-opacity duration-500">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 top-10 flex bg-slate-950">
                                        <img
                                            src="/images/user-dashboard.png"
                                            alt="DocForge Dashboard Interface"
                                            className="w-full h-full object-cover object-top opacity-95 group-hover:opacity-100 transition-opacity duration-500"
                                        />
                                    </div>

                                    {/* Reflection Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                                </div>

                                {/* Floating Elements - 3D Popouts */}
                                <motion.div
                                    className="absolute -right-12 top-20 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 hidden lg:block"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    style={{ transform: "translateZ(50px)" }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Status Update</div>
                                            <div className="font-bold text-slate-900 dark:text-white">Proposal Signed</div>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="absolute -left-12 bottom-20 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 hidden lg:block"
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    style={{ transform: "translateZ(80px)" }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />)}
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Team</div>
                                            <div className="font-bold text-slate-900 dark:text-white">3 Active Viewing</div>
                                        </div>
                                    </div>
                                </motion.div>

                            </motion.div>

                            {/* Floor Glow */}
                            <div className="absolute -inset-x-20 -bottom-20 h-40 bg-indigo-500/20 blur-[100px] -z-10 opacity-60" />
                        </motion.div>
                    </div>
                </section>

                {/* Social Proof Ticker */}
                <section className="py-10 border-y border-slate-100 bg-white/50 backdrop-blur-sm mb-32">
                    <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Trusted by industry leaders</p>
                    <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
                            {['Acme Corp', 'GlobalBank', 'Nebula', 'SaaS Flow', 'TechStar', 'Vortex', 'Acme Corp', 'GlobalBank'].map((name, i) => (
                                <li key={i} className="text-xl font-bold text-slate-400 whitespace-nowrap uppercase tracking-widest font-mono">
                                    {name}
                                </li>
                            ))}
                        </ul>
                        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
                            {['Acme Corp', 'GlobalBank', 'Nebula', 'SaaS Flow', 'TechStar', 'Vortex', 'Acme Corp', 'GlobalBank'].map((name, i) => (
                                <li key={i} className="text-xl font-bold text-slate-400 whitespace-nowrap uppercase tracking-widest font-mono">
                                    {name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Workflow Interactive Section */}
                <section className="max-w-7xl mx-auto px-6 mb-32">
                    <motion.div
                        {...fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                            One flow to rule them all.
                        </h2>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                            Stop switching between Word, Gmail, and Docusign. DocForge unifies your entire document lifecycle.
                        </p>
                    </motion.div>

                    <WorkflowTabs />
                </section>

                {/* Testimonials */}
                <section className="bg-slate-900 py-32 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-white/10" />
                    <div className="absolute bottom-0 inset-x-0 h-px bg-white/10" />
                    {/* Background Noise */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <motion.div
                            {...fadeInUp}
                            className="text-center mb-20"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                Loved by Builders.
                            </h2>
                            <p className="text-lg text-slate-400 max-w-xl mx-auto">
                                Don't just take our word for it. Here's what the community is building with DocForge.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <TestimonialCard
                                quote="The share tracking feature alone changed how we follow up on proposals. Our close rate went up by 30%."
                                author="Sarah Jenkins"
                                role="CEO"
                                company="DesignCraft"
                            />
                            <TestimonialCard
                                quote="Finally, an interface that doesn't feel like it was built in 2010. It's actually a joy to use."
                                author="Marcus Chen"
                                role="Freelance Dev"
                                company="Indie"
                            />
                            <TestimonialCard
                                quote="We streamlined our entire NDA process. What used to take days now takes minutes. Invaluable."
                                author="Elena Rodriguez"
                                role="Operations"
                                company="TechFlow"
                            />
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="max-w-4xl mx-auto px-6 py-32">
                    <motion.div
                        {...fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                    </motion.div>

                    <div className="space-y-2">
                        <FaqItem
                            question="Is DocForge legally binding?"
                            answer="Yes. DocForge uses compliant eSignature standards. We record IP addresses and timestamps for every action to create a secure audit trail."
                        />
                        <FaqItem
                            question="Can I bring my own branding?"
                            answer="Absolutely. On the Pro plan, you can remove DocForge branding, add your own logo, and customize the color scheme of your emails and dashboard."
                        />
                        <FaqItem
                            question="How does the free trial work?"
                            answer="You get full access to the Pro plan for 14 days. No credit card required. If you don't upgrade, you'll be moved to the Free tier which still includes unlimited NDAs."
                        />
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 px-6 relative overflow-hidden">
                    <div className="max-w-5xl mx-auto relative z-10 bg-indigo-600 rounded-3xl p-12 md:p-20 text-center shadow-2xl shadow-indigo-500/30 overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 relative z-10">
                            Forging the future, today.
                        </h2>
                        <p className="text-indigo-100 text-xl mb-10 max-w-2xl mx-auto relative z-10">
                            Join 10,000+ others who have upgraded their document workflow.
                        </p>
                        <Link to="/register" className="relative z-10 inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all hover:scale-105 shadow-xl">
                            Get Started Now
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Welcome;
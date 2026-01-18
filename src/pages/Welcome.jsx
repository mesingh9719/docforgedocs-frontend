import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronRight,
    FileText,
    Users,
    Shield,
    Zap,
    CheckCircle,
    Layout,
    ArrowRight
} from 'lucide-react';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        variants={fadeInUp}
        className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group hover:-translate-y-1"
    >
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors duration-300">
            <Icon className="text-indigo-600 group-hover:text-white transition-colors duration-300" size={24} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
);

const Welcome = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">

            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            </div>

            <div className="relative z-10">

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium text-sm mb-8 hover:bg-indigo-100 transition-colors cursor-default"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            v2.0 is likely live
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 mb-8"
                        >
                            Business Logic, <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x">
                                Perfectly Forged.
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed"
                        >
                            The all-in-one workspace for modern agencies. Manage documents, teams, and invoices with unparalleled elegance and speed.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20 flex items-center justify-center gap-2 group">
                                Start Building Free
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all hover:border-slate-300">
                                Sign In
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Dashboard Preview */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="px-4 mb-32"
                >
                    <div className="max-w-6xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative rounded-xl overflow-hidden bg-slate-900/5 ring-1 ring-slate-900/10 shadow-2xl">
                            {/* Abstract UI representation if no image is available, or use the image provided earlier */}
                            <div className="aspect-[16/9] bg-slate-100 flex items-center justify-center text-slate-400 font-mono text-sm relative overflow-hidden">
                                <div className="absolute inset-x-0 top-0 h-12 bg-white border-b border-slate-200 flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                </div>
                                <div className="grid grid-cols-4 gap-4 p-8 w-full h-full pt-20 bg-slate-50">
                                    <div className="col-span-1 bg-white rounded-lg shadow-sm h-full"></div>
                                    <div className="col-span-3 grid grid-rows-3 gap-4">
                                        <div className="row-span-1 grid grid-cols-3 gap-4">
                                            <div className="bg-white rounded-lg shadow-sm"></div>
                                            <div className="bg-white rounded-lg shadow-sm"></div>
                                            <div className="bg-white rounded-lg shadow-sm"></div>
                                        </div>
                                        <div className="row-span-2 bg-white rounded-lg shadow-sm"></div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/5 backdrop-blur-[1px]">
                                    <span className="bg-white/90 backdrop-blur shadow-lg px-6 py-3 rounded-full text-indigo-600 font-bold flex items-center gap-2">
                                        <Layout size={20} />
                                        Premium Dashboard UI
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Features Grid */}
                <section className="py-24 bg-slate-50 border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Built for scale.</h2>
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                                Everything you need to run your business operations without the chaos.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            <FeatureCard
                                icon={FileText}
                                title="Smart Documents"
                                description="Create dynamic Proposals, NDAs, and Contracts with variable placeholders and instant PDF generation."
                            />
                            <FeatureCard
                                icon={Users}
                                title="Team Harmony"
                                description="Invite members, assign roles (Admin, Editor, Viewer), and manage granular permissions with ease."
                            />
                            <FeatureCard
                                icon={Zap}
                                title="Instant Invoicing"
                                description="Generate professional invoices, calculate taxes automatically, and track payments in real-time."
                            />
                            <FeatureCard
                                icon={Shield}
                                title="Bank-Grade Security"
                                description="Your data is encrypted at rest and in transit. Role-based access control (RBAC) keeps ensuring privacy."
                            />
                            <FeatureCard
                                icon={CheckCircle}
                                title="Audit Trails"
                                description="Track every change. Know exactly who edited a document and when it happened."
                            />
                            <FeatureCard
                                icon={Layout}
                                title="Branded Experience"
                                description="Customize the dashboard with your logo, colors, and branding details for a seamless client experience."
                            />
                        </motion.div>
                    </div>
                </section>

                {/* CTA Strip */}
                <section className="py-24 px-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 to-slate-900"></div>
                    </div>
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-white mb-8"
                        >
                            Ready to forge your future?
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-500 transition-all hover:scale-105 shadow-xl shadow-indigo-900/50">
                                Get Started Now
                                <ChevronRight />
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Welcome;
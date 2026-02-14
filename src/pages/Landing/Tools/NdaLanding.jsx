import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../../components/SEO';

const NdaLanding = () => {
    return (
        <div className="bg-white">
            <SEO
                title="Free Non-Disclosure Agreement (NDA) Generator"
                description="Create a professional Non-Disclosure Agreement (NDA) in seconds. Protect your confidential information with our free, secure, and legally binding template generator. No signup required."
                keywords="free nda generator, non-disclosure agreement template, confidential disclosure agreement, create nda online, legal contracts"
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0"></div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium mb-6 border border-indigo-500/30">
                            <Shield size={16} /> Free Legal Tool
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                            Protect Your Ideas with a <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Professional NDA</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Generate a legally binding Non-Disclosure Agreement in minutes.
                            Secure your business relationships and intellectual property instantly.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/create-document/nda"
                                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 rounded-xl text-lg font-bold hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
                            >
                                <FileText size={20} />
                                Create Free NDA
                            </Link>
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white rounded-xl text-lg font-bold hover:bg-slate-700 transition-all border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2"
                            >
                                Sign Up for Full Access
                            </Link>
                        </div>

                        <p className="mt-6 text-sm text-slate-500">
                            No credit card required • Instant download • Legally binding
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Value Props */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Lock,
                                title: "Bank-Grade Security",
                                description: "Your data is encrypted and secure. We prioritize your privacy and confidentiality above all else."
                            },
                            {
                                icon: Shield,
                                title: "Legally Sound",
                                description: "Our templates are drafted by legal professionals to ensure your agreements are enforceable."
                            },
                            {
                                icon: CheckCircle,
                                title: "Instant Export",
                                description: "Generate PDF documents instantly. Download, print, or share your NDA directly from the platform."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all"
                            >
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm mb-6">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works / Content for SEO */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Why do you need a Non-Disclosure Agreement?</h2>
                    <div className="prose prose-lg prose-indigo text-slate-600">
                        <p>
                            A Non-Disclosure Agreement (NDA), also known as a confidentiality agreement, is a legal contract between at least two parties that outlines confidential material, knowledge, or information that the parties wish to share with one another for certain purposes, but wish to restrict access to.
                        </p>
                        <p>
                            NDAs are commonly used when:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6">
                            <li>Presenting an invention or business idea to a potential partner, investor, or distributor.</li>
                            <li>Sharing financial, marketing, and other business information with a prospective buyer.</li>
                            <li>Showing a new product or technology to a prospective buyer or licensee.</li>
                            <li>Receiving services from a company or individual who may have access to sensitive information in providing those services.</li>
                        </ul>
                        <p>
                            With DocForge, you can create a customized NDA that fits your specific needs without the high cost of legal fees. Our intuitive editor guides you through each section, ensuring you cover all critical aspects of confidentiality.
                        </p>
                    </div>

                    <div className="mt-12 p-8 bg-indigo-600 rounded-2xl text-white text-center">
                        <h3 className="text-2xl font-bold mb-4">Ready to protect your business?</h3>
                        <p className="text-indigo-100 mb-8">Start creating your NDA now. It takes less than 2 minutes.</p>
                        <Link
                            to="/create-document/nda"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
                        >
                            Create NDA for Free <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NdaLanding;

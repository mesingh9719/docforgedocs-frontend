import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, ShieldCheck, Mail, Smartphone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../../components/SEO';

const SignatureLanding = () => {
    return (
        <div className="bg-white">
            <SEO
                title="Electronic Signature Software | eSign PDF"
                description="Securely sign documents online with DocForge. Send, track, and manage electronic signatures with ease. Legally binding and secure."
                keywords="electronic signature, esign, digital signature, sign pdf online, signature software, free esignature"
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium mb-6 border border-emerald-500/30">
                            <ShieldCheck size={16} /> Secure & Legally Binding
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                            The Easiest Way to <br />
                            <span className="text-emerald-400">Sign Documents Online</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Stop printing, signing, and scanning. Switch to DocForge for fast, secure, and legally binding electronic signatures.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-xl text-lg font-bold hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
                            >
                                <PenTool size={20} />
                                Start Signing for Free
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How it works</h2>
                        <p className="text-slate-600">Three simple steps to get your documents signed.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connector Line (Desktop Only) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10"></div>

                        {[
                            {
                                num: "01",
                                title: "Upload",
                                desc: "Upload your PDF, Word, or Image document to our secure platform."
                            },
                            {
                                num: "02",
                                title: "Prepare",
                                desc: "Drag and drop signature fields, dates, and text boxes where recipients need to sign."
                            },
                            {
                                num: "03",
                                title: "Send",
                                desc: "Email the document to your recipients. They can sign from any device, instantly."
                            }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="text-center bg-white"
                            >
                                <div className="w-24 h-24 mx-auto bg-slate-50 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold text-slate-300 mb-6">
                                    {step.num}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-slate-600 leading-relaxed px-4">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: ShieldCheck,
                                title: "Audit Trails",
                                description: "Every document includes a comprehensive audit trail tracking who opened, viewed, and signed."
                            },
                            {
                                icon: Smartphone,
                                title: "Mobile Friendly",
                                description: "Sign documents on the go. Our signing interface works perfectly on smartphones and tablets."
                            },
                            {
                                icon: Mail,
                                title: "Email Notifications",
                                description: "Get instant alerts when your document is viewed and signed."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                                        <feature.icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                                </div>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-emerald-600 text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">Ditch the printer and scanner.</h2>
                    <Link to="/register" className="inline-block px-8 py-4 bg-white text-emerald-700 rounded-xl text-lg font-bold hover:bg-emerald-50 transition-colors shadow-lg">
                        Get Started Free
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default SignatureLanding;

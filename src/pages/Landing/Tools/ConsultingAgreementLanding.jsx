import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Handshake, Scale, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../../components/SEO';

const ConsultingAgreementLanding = () => {
    return (
        <div className="bg-white">
            <SEO
                title="Free Consulting Agreement Template"
                description="Draft a professional Consulting Services Agreement. Define scope, payment terms, and timelines clearly. Ideal for freelancers and consultants."
                keywords="consulting agreement, independent contractor agreement, freelance contract, service agreement template, consulting contract"
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6 border border-emerald-200">
                            <Briefcase size={14} /> For Consultants & Freelancers
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                            Formalize Your <span className="text-indigo-600">Consulting Services</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Don't start work without a contract. Create a clear, professional consulting agreement to protect your time and ensure you get paid.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/create-document/consulting-agreement"
                                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
                            >
                                <Scale size={20} />
                                Create Agreement
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Why it matters */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why every consultant needs a contract</h2>
                            <div className="space-y-6">
                                {[
                                    {
                                        title: "Scope Creep Protection",
                                        desc: "Clearly define what is (and isn't) included in your services to avoid endless revisions.",
                                        icon: Scale
                                    },
                                    {
                                        title: "Payment Security",
                                        desc: "Set clear payment terms, late fees, and deposit requirements upfront.",
                                        icon: Clock
                                    },
                                    {
                                        title: "Professionalism",
                                        desc: "A well-crafted agreement signals to clients that you are a serious professional.",
                                        icon: Briefcase
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                            <p className="text-slate-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            {/* Visual representation of a contract */}
                            <div className="bg-white shadow-xl rounded-xl p-8 max-w-md mx-auto">
                                <div className="h-4 w-1/3 bg-slate-200 rounded mb-6"></div>
                                <div className="space-y-3 mb-8">
                                    <div className="h-2 w-full bg-slate-100 rounded"></div>
                                    <div className="h-2 w-full bg-slate-100 rounded"></div>
                                    <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
                                </div>
                                <div className="space-y-3 mb-8">
                                    <div className="h-2 w-full bg-slate-100 rounded"></div>
                                    <div className="h-2 w-5/6 bg-slate-100 rounded"></div>
                                </div>
                                <div className="flex justify-between items-end mt-12 bg-indigo-50 p-4 rounded-lg">
                                    <div>
                                        <div className="h-2 w-20 bg-indigo-200 rounded mb-2"></div>
                                        <div className="h-8 w-24 bg-white border-b-2 border-slate-300"></div>
                                    </div>
                                    <div className="text-indigo-600">
                                        <Handshake size={32} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ConsultingAgreementLanding;

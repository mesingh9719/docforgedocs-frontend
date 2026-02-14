import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, UserPlus, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../../components/SEO';

const OfferLetterLanding = () => {
    return (
        <div className="bg-white">
            <SEO
                title="Free Offer Letter Generator"
                description="Create professional job offer letters in minutes. Customize templates, add salary details, and send to candidates instantly."
                keywords="offer letter generator, job offer template, employment offer, hiring tools, hr software, create offer letter"
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-sm font-medium mb-6 border border-rose-200">
                            <UserPlus size={14} /> Streamline Your Hiring
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                            Send the Perfect <br />
                            <span className="text-rose-600">Job Offer</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Don't let top talent wait. Generate polished, comprehensive offer letters that get signed.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-8 py-4 bg-rose-600 text-white rounded-xl text-lg font-bold hover:bg-rose-700 transition-all shadow-lg hover:shadow-rose-500/25 flex items-center justify-center gap-2"
                            >
                                <Briefcase size={20} />
                                Create Offer Letter
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Steps */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="space-y-12">
                        {[
                            {
                                title: "1. Basic Information",
                                desc: "Enter candidate details, job title, and start date."
                            },
                            {
                                title: "2. Compensation & Benefits",
                                desc: "Define salary, equity, bonuses, and benefits packages clearly."
                            },
                            {
                                title: "3. Terms & Conditions",
                                desc: "Add standard clauses for at-will employment, confidentiality, and more."
                            }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="flex gap-6"
                            >
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 font-bold border-2 border-rose-100">
                                    {i + 1}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                    <p className="text-slate-600">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OfferLetterLanding;

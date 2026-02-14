import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, PieChart, Send, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../../components/SEO';

const InvoiceLanding = () => {
    return (
        <div className="bg-white">
            <SEO
                title="Free Invoice Generator & Management"
                description="Create professional invoices, track payments, and manage expenses. Sign up for free to streamline your billing process."
                keywords="free invoice generator, online invoicing, billing software, create invoice, invoice template, expense tracking"
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
                <div className="absolute inset-0 bg-white z-0"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6 border border-blue-200">
                                    <DollarSign size={14} /> Get Paid Faster
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                                    Professional Invoicing <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Made Simple</span>
                                </h1>
                                <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                                    Create, send, and track invoices in seconds. Look professional and get paid on time with our intuitive billing platform.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link
                                        to="/register"
                                        className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                                    >
                                        Create Free Invoice <ArrowRight size={20} />
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-8 py-4 bg-white text-slate-700 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all border border-slate-200 hover:border-slate-300"
                                    >
                                        Explore Features
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                        <div className="flex-1 w-full max-w-lg lg:max-w-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                className="relative rounded-2xl shadow-2xl bg-white p-2 border border-slate-100 rotate-2 hover:rotate-0 transition-transform duration-500"
                            >
                                {/* Mock Invoice Preview - Replace with actual image later or CSS Mockup */}
                                <div className="aspect-[3/4] bg-slate-50 rounded-lg p-6 flex flex-col">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="w-32 h-8 bg-blue-600/20 rounded animate-pulse"></div>
                                        <div className="text-right">
                                            <div className="w-24 h-6 bg-slate-200 rounded mb-2"></div>
                                            <div className="w-16 h-4 bg-slate-100 rounded ml-auto"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4 mb-8">
                                        <div className="w-full h-24 bg-white rounded border border-slate-200 p-4">
                                            <div className="w-1/2 h-4 bg-slate-100 rounded mb-2"></div>
                                            <div className="w-1/3 h-4 bg-slate-100 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-slate-200 flex justify-between items-center">
                                        <div className="text-sm text-slate-400">Total Amount</div>
                                        <div className="text-xl font-bold text-slate-900">$2,450.00</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Highlights */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Send,
                                title: "Instant Delivery",
                                description: "Send invoices directly via email or get a shareable link instantly. No huge attachments."
                            },
                            {
                                icon: CreditCard,
                                title: "Payment Integration",
                                description: "Accept payments faster by integrating your preferred payment gateways directly into the invoice."
                            },
                            {
                                icon: PieChart,
                                title: "Financial Insights",
                                description: "Track paid, pending, and overdue invoices with our built-in dashboard analytics."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default InvoiceLanding;

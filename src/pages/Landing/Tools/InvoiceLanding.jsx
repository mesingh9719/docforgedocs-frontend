import React from 'react';
import { motion } from 'framer-motion';
import { Receipt, DollarSign, PieChart, Send, ArrowRight, CheckCircle2, Sparkles, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../../components/SEO';
import { useDocumentLaunch } from '../../../hooks/useDocumentLaunch';

const InvoiceLanding = () => {
    const navigate = useNavigate();
    const { launchDocument, AuthModalComponent } = useDocumentLaunch();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white pt-32 pb-24 relative overflow-x-hidden">
            <SEO
                title="Free Professional Invoice Generator | DocForge"
                description="Create print-ready, itemized invoices in seconds. Automated tax calculation, discounts, payment terms, and vector PDF download."
                keywords="free invoice generator, invoice maker, create invoice online, billing software for freelancers, itemized invoice pdf"
            />

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-amber-100/40 rounded-full blur-[140px] -translate-y-1/2" />
                <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-orange-100/30 rounded-full blur-[120px]" />
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
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider mb-6">
                            <Receipt size={14} className="text-amber-600" /> Free Billing Utility
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                            Professional Invoicing That Gets <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600">
                                You Paid 2x Faster
                            </span>
                        </h1>
                        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                            Create, calculate, and download clean, professional invoices in under 60 seconds. Includes automated line items, sales tax, discounts, and payment instructions.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => launchDocument('invoice')}
                                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-amber-600 text-white rounded-2xl font-bold text-base md:text-lg shadow-xl shadow-slate-900/15 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                            >
                                <Receipt size={18} />
                                <span>Create Free Invoice Now</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-2xl font-bold text-base md:text-lg shadow-sm transition-all cursor-pointer"
                            >
                                Track Paid & Pending Invoices
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-500 font-semibold">
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> Auto Tax & Discounts</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> Vector PDF Downloads</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500" /> Bank & Wire Instructions</span>
                        </div>
                    </motion.div>
                </div>

                {/* Features Value Pillars */}
                <div className="mb-24 grid md:grid-cols-3 gap-8">
                    {[
                        { icon: Send, title: 'Instant PDF & Email Delivery', desc: 'Download clean vector PDFs or send instant shareable links directly to client finance departments.' },
                        { icon: CreditCard, title: 'Payment Gateway Directions', desc: 'Embed your bank wire info, Stripe links, PayPal, or ACH instructions directly on every bill.' },
                        { icon: PieChart, title: 'Real-Time Financial Metrics', desc: 'Track overdue invoices, pending balances, and total collected revenue across all client accounts.' }
                    ].map((feat, i) => {
                        const Icon = feat.icon;
                        return (
                            <div key={i} className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/40">
                                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mb-6">
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
                    <h2 className="text-3xl md:text-4xl font-black mb-4">Send a Polished Invoice in 60 Seconds</h2>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
                        No credit card required. Fast, free invoice drafting engine.
                    </p>
                    <button
                        onClick={() => launchDocument('invoice')}
                        className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-base shadow-xl transition-all cursor-pointer"
                    >
                        Launch Free Invoice Generator →
                    </button>
                </div>
            </main>

            {/* Auth Required Modal */}
            <AuthModalComponent />
        </div>
    );
};

export default InvoiceLanding;

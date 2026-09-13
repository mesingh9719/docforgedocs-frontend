import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Search, Sparkles } from 'lucide-react';
import { faqs } from '../data/landing-data';

const FaqItem = ({ q, a, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-slate-200/80 last:border-0 transition-colors">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 flex items-center justify-between text-left focus:outline-none group cursor-pointer"
            >
                <span className="text-base md:text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors pr-6">
                    {q}
                </span>
                <span className={`p-2 rounded-xl bg-slate-100 group-hover:bg-indigo-50 text-slate-500 group-hover:text-indigo-600 transition-all shrink-0 ${isOpen ? 'rotate-180 bg-indigo-50 text-indigo-600' : ''}`}>
                    <ChevronDown size={18} />
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-slate-600 leading-relaxed text-sm md:text-base font-normal pr-6">
                            {a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQSection = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { id: 'all', label: 'All Questions' },
        { id: 'general', label: 'General' },
        { id: 'legal', label: 'Legal & Enforceability' },
        { id: 'security', label: 'Security & Privacy' },
        { id: 'collaboration', label: 'Team & Collaboration' }
    ];

    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch = searchQuery === '' || 
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
            faq.a.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <section id="faq" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                    <HelpCircle size={14} className="text-indigo-600" /> Got Questions?
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    Frequently Asked <span className="shimmer-text">Questions</span>
                </h2>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                    Everything you need to know about the product, legal validity, pricing, and document security.
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search answers (e.g. legal, security, export)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none shadow-sm transition-all"
                />
            </div>

            {/* Category Pills */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeCategory === cat.id
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Accordion List Container */}
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-xl shadow-slate-200/40">
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, i) => (
                        <FaqItem key={i} q={faq.q} a={faq.a} defaultOpen={i === 0 && searchQuery === ''} />
                    ))
                ) : (
                    <div className="py-10 text-center text-slate-500">
                        <p className="font-semibold text-base mb-2">No matching questions found.</p>
                        <p className="text-xs">Try a different keyword or reach out to our support team.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FAQSection;


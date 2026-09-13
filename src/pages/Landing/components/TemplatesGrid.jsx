import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Clock, CheckCircle2, Shield, Star } from 'lucide-react';
import { templates as landingTemplates } from '../data/landing-data';
import { useDocumentLaunch } from '../../../hooks/useDocumentLaunch';

const categories = [
    { id: 'all', label: 'All Blueprints' },
    { id: 'legal', label: 'Legal & Protection' },
    { id: 'sales', label: 'Sales & Billing' },
    { id: 'hr', label: 'HR & People' },
];

function TemplatesGrid() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const { launchDocument, AuthModalComponent } = useDocumentLaunch();

    const filteredTemplates = selectedCategory === 'all'
        ? landingTemplates
        : landingTemplates.filter(t => t.category === selectedCategory);

    return (
        <section id="templates" className="py-24 relative">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Battle-Tested Legal Architecture</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    Choose a blueprint to start drafting.
                </h2>
                <p className="text-base sm:text-lg text-slate-600">
                    Engineered by corporate attorneys and designed for seamless deal execution. Customize variables, inject clauses, and sign electronically.
                </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                            selectedCategory === cat.id
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Templates Grid */}
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {filteredTemplates.map((template, idx) => {
                        const Icon = template.icon;
                        return (
                            <motion.div
                                layout
                                key={template.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                whileHover={{ y: -6, boxShadow: "0 25px 35px -10px rgba(0, 0, 0, 0.08)" }}
                                onClick={() => launchDocument(template.id)}
                                className="group relative p-7 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/40 transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
                            >
                                {/* Top Gradient Accent Line */}
                                <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${template.gradient}`} />

                                <div>
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between gap-2 mb-6">
                                        <div className={`w-14 h-14 rounded-2xl ${template.bg} ${template.border} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon size={26} className={template.color} />
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-900 text-white">
                                                {template.badge}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                                                <Clock size={12} /> {template.timeEstimate}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title & Subtitle */}
                                    <h3 className="text-xl font-extrabold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                        {template.title}
                                    </h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                        {template.subtitle}
                                    </p>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
                                        {template.description}
                                    </p>

                                    {/* Clause Features Pills */}
                                    <div className="space-y-2 mb-8">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            Essential Clauses Included:
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {template.clauses?.slice(0, 3).map((clause, cIdx) => (
                                                <span 
                                                    key={cIdx} 
                                                    className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-600"
                                                >
                                                    {clause}
                                                </span>
                                            ))}
                                            {template.clauses?.length > 3 && (
                                                <span className="px-2 py-1 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-500">
                                                    +{template.clauses.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer CTA */}
                                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                        <Star size={14} className="fill-amber-400 text-amber-400" />
                                        <span>4.9/5</span>
                                        <span className="text-slate-400 font-normal">({template.popularCount || '1.2k'}+ used)</span>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            launchDocument(template.id);
                                        }}
                                        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 group-hover:text-indigo-700 group-hover:translate-x-1 transition-all"
                                    >
                                        <span>Use Template</span>
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            {/* Auth Required Modal */}
            <AuthModalComponent />
        </section>
    );
}

export default TemplatesGrid;

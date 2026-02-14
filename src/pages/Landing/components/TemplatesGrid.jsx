import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { templates } from '../data/landing-data';

const TemplatesGrid = () => {
    const navigate = useNavigate();

    return (
        <div id="templates" className="scroll-mt-24 mb-32 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Start Drafting</h2>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto">Select a document type to launch the live editor immediately.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {templates.map((template, idx) => (
                    <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                        onClick={() => navigate(`/create-document/${template.id}`)}
                        className={`group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 transition-all cursor-pointer overflow-hidden flex flex-col h-full ring-1 ring-slate-900/5`}
                    >
                        <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${template.gradient}`} />

                        <div className={`w-14 h-14 rounded-2xl ${template.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ring-1 ring-black/5`}>
                            <template.icon size={28} className={template.color.replace('bg-', 'text-')} />
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 mb-2">{template.title}</h3>
                        <p className="text-indigo-600 font-medium text-sm mb-4 tracking-wide uppercase text-xs">{template.subtitle}</p>
                        <p className="text-slate-500 leading-relaxed mb-8 flex-1">{template.description}</p>

                        <div className="flex items-center text-slate-900 font-bold text-sm group-hover:text-indigo-600 transition-colors mt-auto pt-6 border-t border-slate-50">
                            Launch Editor <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TemplatesGrid;

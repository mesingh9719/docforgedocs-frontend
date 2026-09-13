import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinalCTA = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 relative z-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center py-20 px-6 md:px-12 bg-slate-900 rounded-3xl relative overflow-hidden shadow-2xl shadow-indigo-500/20 mx-auto max-w-6xl border border-slate-800 text-white"
            >
                {/* Vibrant Background Mesh */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
                <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />

                <div className="relative z-10 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
                        <Sparkles size={14} className="text-amber-400" /> Start Closing Deals Today
                    </div>

                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                        Ready to Upgrade Your <br />
                        <span className="shimmer-text">Document Workflow?</span>
                    </h2>

                    <p className="text-slate-300 text-base sm:text-lg md:text-xl mb-10 leading-relaxed font-normal max-w-2xl mx-auto">
                        Generate your first agreement in under 90 seconds. 100% free starter tier, legally enforceable contracts.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                        <button
                            onClick={() => {
                                const el = document.getElementById('templates');
                                el?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full sm:w-auto px-10 py-4 bg-white hover:bg-slate-100 text-slate-900 rounded-2xl font-black text-base md:text-lg shadow-2xl shadow-white/20 transition-all flex items-center justify-center gap-2.5 cursor-pointer group hover:scale-105"
                        >
                            <span>Pick a Blueprint to Start Free</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-indigo-600" />
                        </button>

                        <button
                            onClick={() => navigate('/register')}
                            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-base md:text-lg border border-indigo-400/30 transition-all shadow-xl shadow-indigo-600/30 cursor-pointer"
                        >
                            Create Free Agency Account
                        </button>
                    </div>

                    {/* Guarantees */}
                    <div className="flex items-center justify-center gap-6 md:gap-10 text-xs font-medium text-slate-400 flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={15} className="text-emerald-400" />
                            <span>Zero credit card required</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck size={15} className="text-indigo-400" />
                            <span>ESIGN & eIDAS legally binding</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Zap size={15} className="text-amber-400" />
                            <span>Instant high-res PDF downloads</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default FinalCTA;


import React from 'react';
import { Zap, Layout, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureSpot = ({ icon: Icon, title, desc }) => (
    <motion.div
        whileHover={{ x: 5 }}
        className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-default"
    >
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 ring-1 ring-indigo-100">
            <Icon size={24} />
        </div>
        <div>
            <h4 className="font-bold text-slate-900 mb-1 text-lg">{title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
        </div>
    </motion.div>
);

const FeatureShowcase = () => {
    return (
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32 relative z-10">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ring-1 ring-indigo-100">
                    Powered by DocForge
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                    More than just a generator. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Your entire workflow.</span>
                </h2>
                <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                    This free tool is just the beginning. DocForge is the complete operating system for modern agencies and freelancers.
                </p>

                <div className="space-y-2">
                    <FeatureSpot
                        icon={Zap}
                        title="Integrated eSignatures"
                        desc="Stop paying for Docusign. Request enforceable signatures directly on your documents."
                    />
                    <FeatureSpot
                        icon={Layout}
                        title="Smart Dashboard"
                        desc="Track every proposal sent. See when clients open them and get notified instantly."
                    />
                    <FeatureSpot
                        icon={Users}
                        title="Team Collaboration"
                        desc="Invite your team to draft, review, and approve documents together."
                    />
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative"
            >
                <div className="absolute inset-0 bg-indigo-600 rounded-3xl rotate-3 opacity-5 blur-2xl"></div>
                <div className="relative bg-slate-900 rounded-3xl p-2 shadow-2xl shadow-indigo-500/20 border border-slate-800 ring-1 ring-white/10">
                    <img
                        src="/images/dashboard-preview.png"
                        alt="DocForge Dashboard"
                        className="rounded-2xl w-full h-auto opacity-95"
                        loading="lazy"
                        width="600"
                        height="400"
                    />
                    {/* Floating Stats */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3"
                    >
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 ring-4 ring-white">
                            <Star size={24} fill="currentColor" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Conversion Rate</div>
                            <div className="font-bold text-slate-900 text-xl font-mono">+34%</div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default FeatureShowcase;

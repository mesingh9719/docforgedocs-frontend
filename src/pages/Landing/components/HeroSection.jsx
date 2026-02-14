import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <div className="text-center max-w-4xl mx-auto mb-24 relative z-10">
            {/* Spotlight Effect */}
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-full shadow-sm mb-8 ring-1 ring-slate-200/50"
            >
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Free to use, forever</span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-8 leading-[1.1]"
            >
                Review Less. <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-300% animate-gradient">Close Deals Faster.</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium mb-12 max-w-2xl mx-auto"
            >
                Skip the formatting headaches. Generate professional, legally rigorous documents in seconds.
                <span className="text-slate-900 font-semibold block mt-2"> No signup required to start.</span>
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => document.getElementById('templates').scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 transition-all border border-transparent"
                >
                    Start Drafting Free
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/features')}
                    className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-bold text-lg shadow-sm hover:border-slate-300 transition-all"
                >
                    View All Features
                </motion.button>
            </motion.div>
        </div>
    );
};

export default HeroSection;

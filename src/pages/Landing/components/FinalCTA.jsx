import React from 'react';
import { motion } from 'framer-motion';

const FinalCTA = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-24 bg-indigo-600 rounded-3xl relative overflow-hidden shadow-2xl shadow-indigo-500/30 mx-auto max-w-5xl"
        >
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500 rounded-full blur-[100px] opacity-30 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 px-6">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Ready to look professional?</h2>
                <p className="text-indigo-100 text-xl mb-12 max-w-2xl mx-auto font-medium">Create your first document now. It takes less than 2 minutes and requires no account.</p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => document.getElementById('templates').scrollIntoView({ behavior: 'smooth' })}
                    className="px-12 py-5 bg-white text-indigo-600 rounded-full font-bold text-xl hover:bg-white/90 transition-all shadow-xl"
                >
                    Start Drafting Now
                </motion.button>
            </div>
        </motion.div>
    );
};

export default FinalCTA;

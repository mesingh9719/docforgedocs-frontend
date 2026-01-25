import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
    // If used as a Layout Route (Outlet), render it. 
    // If used as a Wrapper Component (children), render that.
    // If both (nested), this component is designed to be the Wrapper.
    // However, to be safe, if children is present, we use that.

    const content = children || <Outlet />;

    return (
        <div className="min-h-screen flex bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">

            {/* Left Side - Brand Identity */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/60 via-slate-900 to-slate-900"></div>
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob"></div>
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                </div>

                <div className="relative z-10 max-w-lg text-center lg:text-left">
                    <Link to="/" className="flex items-center gap-3 mb-12 group w-fit">
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <span className="text-white font-bold text-xl">D</span>
                        </div>
                        <span className="font-bold text-2xl text-white">DocForge</span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Quote className="text-indigo-400 mb-6 w-10 h-10 opacity-50" />
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Build details. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                Scale vision.
                            </span>
                        </h2>
                        <p className="text-lg text-slate-400 leading-relaxed mb-8">
                            "DocForge has completely transformed how we handle proposals. What used to take hours now takes minutes, and clients are impressed by the professional look."
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30"></div>
                            <div>
                                <h4 className="font-bold text-white">Sarah Jenkins</h4>
                                <p className="text-slate-500 text-sm">CEO, Creative Studio</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">
                <div className="w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        {title && (
                            <motion.h2
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-3xl font-bold text-slate-900 mb-2"
                            >
                                {title}
                            </motion.h2>
                        )}
                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-slate-500"
                            >
                                {subtitle}
                            </motion.p>
                        )}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {content}
                    </motion.div>
                </div>
            </div>

        </div>
    );
};

export default AuthLayout;
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
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                            x: [0, 50, 0],
                            y: [0, -50, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] mix-blend-screen"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.6, 0.3],
                            x: [0, -50, 0],
                            y: [0, 50, 0]
                        }}
                        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen"
                    />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                </div>

                <div className="relative z-10 max-w-lg text-center lg:text-left">
                    <Link to="/" className="flex items-center gap-3 mb-16 group w-fit">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-2xl">
                            <span className="text-white font-black text-2xl tracking-tight">D</span>
                        </div>
                        <span className="font-bold text-3xl text-white tracking-tight">DocForge</span>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <Quote className="text-indigo-400 mb-8 w-12 h-12 opacity-80" />
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-[1.15] tracking-tight">
                            Build details. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                Scale vision.
                            </span>
                        </h2>
                        <p className="text-xl text-slate-400 leading-relaxed mb-12 font-medium max-w-md">
                            "DocForge has completely transformed how we handle proposals. What used to take hours now takes minutes."
                        </p>

                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-br from-indigo-500 to-purple-500">
                                <img
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                    alt="Sarah Jenkins"
                                    className="w-full h-full rounded-full border-2 border-slate-900 object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg">Sarah Jenkins</h4>
                                <p className="text-indigo-400 text-sm font-medium">CEO, Creative Studio</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">
                <div className="w-full max-w-[400px]">
                    <div className="mb-10 text-center lg:text-left">
                        {title && (
                            <motion.h2
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-3xl font-bold text-slate-900 mb-3 tracking-tight"
                            >
                                {title}
                            </motion.h2>
                        )}
                        {subtitle && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-slate-500 text-lg"
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
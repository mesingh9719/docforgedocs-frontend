import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield, Zap, Receipt, PenTool, FileText, UserCheck, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';

const toolsMegaMenu = [
    {
        name: 'NDA Generator',
        desc: 'Unilateral & Mutual confidentiality agreements',
        path: '/tools/nda',
        icon: Shield,
        color: 'text-emerald-600 bg-emerald-50'
    },
    {
        name: 'Business Proposal Builder',
        desc: 'Winning scopes, milestones, and fee tables',
        path: '/tools/business-proposal',
        icon: Zap,
        color: 'text-indigo-600 bg-indigo-50'
    },
    {
        name: 'Electronic Signatures',
        desc: 'Legally binding ESIGN & eIDAS digital eSign',
        path: '/tools/electronic-signature',
        icon: PenTool,
        color: 'text-purple-600 bg-purple-50'
    },
    {
        name: 'Invoice Generator',
        desc: 'Itemized billing, taxes, and payment directions',
        path: '/tools/invoice-generator',
        icon: Receipt,
        color: 'text-amber-600 bg-amber-50'
    },
    {
        name: 'Consulting Agreement',
        desc: 'Independent contractor & advisory service contracts',
        path: '/tools/consulting-agreement',
        icon: FileText,
        color: 'text-blue-600 bg-blue-50'
    },
    {
        name: 'Offer Letter Generator',
        desc: 'Employment compensation & benefits packages',
        path: '/tools/offer-letter',
        icon: UserCheck,
        color: 'text-rose-600 bg-rose-50'
    }
];

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isAuthPage = ['/login', '/register', '/onboarding'].includes(location.pathname);
    if (isAuthPage) return null;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled || mobileMenuOpen
                    ? 'bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-md shadow-slate-900/5 py-3.5'
                    : 'bg-transparent py-5'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-slate-900/20 group-hover:scale-105 group-hover:bg-indigo-600 transition-all">
                        D
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                            DocForge
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 mt-0.5">
                            Document OS
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-7">
                    {/* Tools Dropdown Mega Menu */}
                    <div
                        className="relative"
                        onMouseEnter={() => setToolsOpen(true)}
                        onMouseLeave={() => setToolsOpen(false)}
                    >
                        <button className="text-slate-700 font-bold text-sm hover:text-indigo-600 transition-colors flex items-center gap-1.5 py-2 cursor-pointer">
                            <span>Tools & Blueprints</span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${toolsOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {toolsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 w-[520px] p-4 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-200 grid grid-cols-2 gap-2"
                                >
                                    {toolsMegaMenu.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setToolsOpen(false)}
                                                className="p-3 rounded-2xl hover:bg-slate-50 transition-colors flex items-start gap-3 group"
                                            >
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color} group-hover:scale-110 transition-transform`}>
                                                    <Icon size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-1">
                                                        {item.desc}
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                    <div className="col-span-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-2">
                                        <span>All templates free for guest creation</span>
                                        <Link to="/features" onClick={() => setToolsOpen(false)} className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                                            View all features →
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link
                        to="/features"
                        className={`text-sm font-bold transition-colors ${
                            location.pathname === '/features' ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
                        }`}
                    >
                        Features
                    </Link>

                    <Link
                        to="/pricing"
                        className={`text-sm font-bold transition-colors flex items-center gap-1.5 ${
                            location.pathname === '/pricing' ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
                        }`}
                    >
                        <span>Pricing</span>
                        <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md">
                            Free Tier
                        </span>
                    </Link>

                    <Link
                        to="/about"
                        className={`text-sm font-bold transition-colors ${
                            location.pathname === '/about' ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
                        }`}
                    >
                        About
                    </Link>
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        to="/login"
                        className="text-slate-700 font-bold text-sm hover:text-indigo-600 transition-colors px-2 py-1"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all"
                    >
                        Get Started Free
                    </Link>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    className="md:hidden p-2 text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle mobile navigation"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Drawer Navigation */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-white border-b border-slate-200 overflow-hidden shadow-2xl"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            <div className="space-y-1">
                                <span className="text-slate-400 text-[11px] font-extrabold uppercase tracking-widest block mb-2">
                                    Tools & Templates
                                </span>
                                {toolsMegaMenu.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="py-2 flex items-center gap-2.5 text-sm font-bold text-slate-800 hover:text-indigo-600"
                                    >
                                        <item.icon size={16} className="text-indigo-600" />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </div>

                            <hr className="border-slate-100 my-1" />

                            <Link
                                to="/features"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-800 font-bold text-base py-1"
                            >
                                Features
                            </Link>

                            <Link
                                to="/pricing"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-800 font-bold text-base py-1 flex items-center justify-between"
                            >
                                <span>Pricing</span>
                                <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                    Free Forever
                                </span>
                            </Link>

                            <Link
                                to="/about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-800 font-bold text-base py-1"
                            >
                                About Us
                            </Link>

                            <hr className="border-slate-100 my-1" />

                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-800 font-bold text-base py-1"
                            >
                                Sign In
                            </Link>

                            <Link
                                to="/register"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-center shadow-lg"
                            >
                                Start Drafting Free
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

export default Navbar;
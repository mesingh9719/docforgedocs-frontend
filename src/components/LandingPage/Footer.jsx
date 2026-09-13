import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    FileText, 
    ShieldCheck, 
    CheckCircle2, 
    ArrowRight, 
    Lock, 
    Mail, 
    Sparkles, 
    Globe,
    Github,
    Linkedin,
    Twitter,
    Cpu,
    BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim() && email.includes('@')) {
            setSubscribed(true);
            setEmail('');
        }
    };

    return (
        <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 relative overflow-hidden">
            {/* Background ambient lighting */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Newsletter & Pre-footer banner */}
            <div className="border-b border-slate-800/80 relative">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>The Contract & Document Intelligence Weekly</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                                Stay ahead of deal closing best practices
                            </h3>
                            <p className="text-slate-400 text-sm mt-2 max-w-lg">
                                Join 14,000+ founders, operators, and legal counsels receiving curated contract blueprints, compliance updates, and negotiation tactics.
                            </p>
                        </div>

                        <div className="lg:col-span-6">
                            <AnimatePresence mode="wait">
                                {subscribed ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3"
                                    >
                                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-sm">You're on the list!</p>
                                            <p className="text-xs text-emerald-300/80">Check your inbox for our 2026 Contract Efficiency Master Guide.</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-1">
                                            <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                                            <input 
                                                type="email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="work.email@company.com" 
                                                required
                                                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                                            />
                                        </div>
                                        <button 
                                            type="submit"
                                            className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 hover:translate-y-[-1px] active:translate-y-[0px] whitespace-nowrap cursor-pointer"
                                        >
                                            <span>Subscribe Free</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </form>
                                )}
                            </AnimatePresence>
                            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                <span>🔒 Zero spam guarantee</span>
                                <span>•</span>
                                <span>Unsubscribe anytime</span>
                                <span>•</span>
                                <span>Delivered every Thursday</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Links Grid */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
                    {/* Brand & Mission Column */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-2">
                        <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                                <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-white">
                                Doc<span className="text-indigo-400">Forge</span>
                            </span>
                        </Link>
                        
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                            The intelligent contract generation and cryptographic e-signature platform built for fast-moving founders, agencies, and enterprise teams.
                        </p>

                        {/* Operational Status Pill */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-6">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-4" />
                            <span className="font-medium text-emerald-400">All Systems Operational</span>
                            <span className="text-slate-500">|</span>
                            <span className="text-slate-400">99.99% Uptime</span>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            <a 
                                href="https://twitter.com" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                                aria-label="DocForge on Twitter"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a 
                                href="https://linkedin.com" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                                aria-label="DocForge on LinkedIn"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a 
                                href="https://github.com" 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                                aria-label="DocForge on GitHub"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold text-white text-sm mb-4 tracking-wide uppercase text-xs text-slate-400">
                            Product
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link to="/features" className="text-slate-400 hover:text-indigo-300 transition-colors">
                                    Features Overview
                                </Link>
                            </li>
                            <li>
                                <Link to="/pricing" className="text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                                    <span>Pricing Plans</span>
                                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Save 20%</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/changelog" className="text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                                    <span>Changelog</span>
                                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">v2.4</span>
                                </Link>
                            </li>
                            <li>
                                <a href="#playground" className="text-slate-400 hover:text-indigo-300 transition-colors">
                                    Live Sandbox
                                </a>
                            </li>
                            <li>
                                <a href="#calculator" className="text-slate-400 hover:text-indigo-300 transition-colors">
                                    ROI Calculator
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Free Legal Tools */}
                    <div>
                        <h4 className="font-semibold text-white text-sm mb-4 tracking-wide uppercase text-xs text-slate-400">
                            Free Generators
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link to="/tools/nda" className="text-slate-400 hover:text-indigo-300 transition-colors">
                                    Mutual NDA Generator
                                </Link>
                            </li>
                            <li>
                                <Link to="/tools/business-proposal" className="text-slate-400 hover:text-indigo-300 transition-colors">
                                    Business Proposal
                                </Link>
                            </li>
                            <li>
                                <Link to="/tools/invoice-generator" className="text-slate-400 hover:text-indigo-300 transition-colors">
                                    Freelance Invoice
                                </Link>
                            </li>
                            <li>
                                <Link to="/tools/electronic-signature" className="text-slate-400 hover:text-indigo-300 transition-colors">
                                    eSignature Vault
                                </Link>
                            </li>
                            <li>
                                <Link to="/tools/consulting-agreement" className="text-slate-400 hover:text-indigo-300 transition-colors">
                                    Consulting Agreement
                                </Link>
                            </li>
                            <li>
                                <Link to="/tools/offer-letter" className="text-slate-400 hover:text-indigo-300 transition-colors">
                                    Employee Offer Letter
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-white text-sm mb-4 tracking-wide uppercase text-xs text-slate-400">
                            Company
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link to="/about" className="text-slate-400 hover:text-indigo-300 transition-colors">
                                    About DocForge
                                </Link>
                            </li>
                            <li>
                                <Link to="/careers" className="text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                                    <span>Careers</span>
                                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Hiring</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-slate-400 hover:text-indigo-300 transition-colors">
                                    Contact & Support
                                </Link>
                            </li>
                            <li>
                                <a href="https://techsynchronic.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-300 transition-colors">
                                    TechSynchronic Lab
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Security */}
                    <div>
                        <h4 className="font-semibold text-white text-sm mb-4 tracking-wide uppercase text-xs text-slate-400">
                            Trust & Legal
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link to="/privacy" className="text-slate-400 hover:text-indigo-300 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-slate-400 hover:text-indigo-300 transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <a href="#security" className="text-slate-400 hover:text-indigo-300 transition-colors">
                                    ESIGN Compliance
                                </a>
                            </li>
                            <li>
                                <a href="#security" className="text-slate-400 hover:text-indigo-300 transition-colors">
                                    eIDAS Regulations
                                </a>
                            </li>
                            <li>
                                <a href="#security" className="text-slate-400 hover:text-indigo-300 transition-colors">
                                    Security Architecture
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Trust Seal Badges Strip */}
                <div className="mt-16 pt-8 border-t border-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                        <ShieldCheck className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-semibold text-white">ESIGN & UETA</p>
                            <p className="text-[11px] text-slate-500">100% Legally Binding</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                        <Lock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-semibold text-white">AES-256 + TLS</p>
                            <p className="text-[11px] text-slate-500">Bank-Grade Encryption</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                        <Cpu className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-semibold text-white">SHA-256 Hashes</p>
                            <p className="text-[11px] text-slate-500">Tamper-Evident Audit</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                        <BadgeCheck className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-semibold text-white">GDPR & CCPA</p>
                            <p className="text-[11px] text-slate-500">Privacy Safeguards</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright & Disclaimer */}
                <div className="mt-8 pt-8 border-t border-slate-900/80 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                        <span>© {new Date().getFullYear()} TechSynchronic. DocForge is a registered product.</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span>Crafted for high-velocity teams</span>
                        <span>•</span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <Globe className="w-3.5 h-3.5" />
                            <span>Global (English US)</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
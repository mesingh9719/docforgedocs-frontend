import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    if (isAuthPage) return null; // Don't show Navbar on auth pages if desired, or show a simplified one.

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || mobileMenuOpen
                ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm py-4'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
                        D
                    </div>
                    <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled ? 'text-slate-900' : 'text-slate-900' // Keeping dark since background is white/transparent
                        }`}>
                        DocForge
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLink to="/features">Features</NavLink>
                    <NavLink to="/pricing">Pricing</NavLink>
                    <NavLink to="/about">About</NavLink>
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        to="/login"
                        className="text-slate-600 font-medium hover:text-slate-900 transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-slate-900"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle mobile menu"
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            <MobileNavLink to="/features" onClick={() => setMobileMenuOpen(false)}>Features</MobileNavLink>
                            <MobileNavLink to="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</MobileNavLink>
                            <MobileNavLink to="/about" onClick={() => setMobileMenuOpen(false)}>About</MobileNavLink>
                            <hr className="border-slate-100 my-2" />
                            <MobileNavLink to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</MobileNavLink>
                            <Link
                                to="/register"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-center"
                            >
                                Get Started
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

const NavLink = ({ to, children }) => (
    <Link to={to} className="text-slate-600 font-medium hover:text-slate-900 transition-colors">{children}</Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
    <Link to={to} onClick={onClick} className="text-slate-600 font-medium text-lg py-2 block">{children}</Link>
);

export default Navbar;
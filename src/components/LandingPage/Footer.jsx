import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-white py-12 px-6 border-t border-slate-200">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">D</span>
                            </div>
                            <span className="font-bold text-xl text-slate-900">DocForge</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Forging the future of document management for modern teams.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link to="/features" className="hover:text-slate-900 transition-colors">Features</Link></li>
                            <li><Link to="/pricing" className="hover:text-slate-900 transition-colors">Pricing</Link></li>
                            <li><Link to="/changelog" className="hover:text-slate-900 transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link to="/about" className="hover:text-slate-900 transition-colors">About Us</Link></li>
                            <li><Link to="/careers" className="hover:text-slate-900 transition-colors">Careers</Link></li>
                            <li><Link to="/contact" className="hover:text-slate-900 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link to="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-slate-400 text-sm">
                        © {new Date().getFullYear()} TechSynchronic. All rights reserved.
                    </div>
                    <div className="flex gap-6 text-slate-400">
                        <a href="#" className="hover:text-slate-900 transition-colors">Twitter</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">GitHub</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
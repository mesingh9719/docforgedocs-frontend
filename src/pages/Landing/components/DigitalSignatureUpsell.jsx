import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DigitalSignatureUpsell = () => {
    const navigate = useNavigate();

    return (
        <div id="signatures" className="scroll-mt-24 mb-32 grid md:grid-cols-2 gap-16 items-center relative z-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="order-2 md:order-1 relative"
            >
                <div className="absolute inset-0 bg-emerald-500 rounded-3xl -rotate-2 opacity-5 blur-2xl"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl shadow-emerald-500/10 border border-slate-100 ring-1 ring-slate-200/50">
                    {/* Mockup of a signed document footer */}
                    <div className="space-y-4 font-serif text-slate-800 opacity-80 mb-10">
                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                        <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                        <div className="h-4 bg-slate-100 rounded w-4/6"></div>
                        <p className="text-sm italic pt-4">"The terms aforementioned are hereby agreed upon..."</p>
                    </div>

                    <div className="flex justify-between items-end border-t border-slate-200 pt-6">
                        <div>
                            <div className="text-xs text-slate-400 uppercase font-bold mb-2 tracking-wider">Signed by</div>
                            <div className="font-handwriting text-4xl text-indigo-900 mb-1">John Doe</div>
                            <div className="text-xs text-slate-400 font-mono">Sep 28, 2026 • 10:42 AM • IP: 192.168.1.1</div>
                        </div>
                        <div className="ml-auto">
                            <motion.div
                                initial={{ rotate: 0, scale: 0 }}
                                whileInView={{ rotate: 12, scale: 1 }}
                                transition={{ type: "spring", delay: 0.3 }}
                                className="w-20 h-20 border-4 border-emerald-500 rounded-full flex items-center justify-center text-emerald-600 bg-emerald-50"
                            >
                                <CheckCircle size={40} />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="order-1 md:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ring-1 ring-emerald-100">
                    New Feature
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                    Secure, Legally Binding <br />
                    <span className="text-emerald-600">Digital Signatures.</span>
                </h2>
                <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                    Stop chasing clients for printers and scanners. Upload any PDF, place signature fields, and send for e-signature in seconds.
                </p>

                <ul className="space-y-4 mb-10">
                    {[
                        "Bank-grade security & audit trails",
                        "Unlimited signature requests",
                        "Real-time status tracking"
                    ].map(feature => (
                        <li key={feature} className="flex items-center gap-3 text-slate-700 font-medium">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                <CheckCircle size={14} strokeWidth={3} />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/register?redirect=/signatures')}
                    className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2"
                >
                    Try eSignatures Free <ArrowRight size={20} />
                </motion.button>
            </div>
        </div>
    );
};

export default DigitalSignatureUpsell;

import React from 'react';
import { clientLogos } from '../data/landing-data';
import { ShieldCheck, Sparkles } from 'lucide-react';

const LogoMarquee = () => {
    // Duplicate items to ensure seamless infinite loop
    const duplicatedLogos = [...clientLogos, ...clientLogos, ...clientLogos];

    return (
        <section className="py-12 border-y border-slate-200/60 bg-white/60 backdrop-blur-sm relative overflow-hidden z-10">
            <div className="max-w-7xl mx-auto px-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Trusted by 12,000+ Fast-Moving Teams & Agencies Worldwide
                    </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-500" /> Bank-Grade Security</span>
                    <span className="flex items-center gap-1"><Sparkles size={14} className="text-indigo-500" /> ESIGN & eIDAS Compliant</span>
                </div>
            </div>

            {/* Marquee Track */}
            <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
                <div className="animate-marquee flex items-center gap-10 md:gap-16 whitespace-nowrap py-2">
                    {duplicatedLogos.map((client, idx) => (
                        <div
                            key={`${client.name}-${idx}`}
                            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all cursor-default group"
                        >
                            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                {client.name.charAt(0)}
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-950 transition-colors">
                                    {client.name}
                                </div>
                                <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                                    {client.category}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LogoMarquee;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Clock, DollarSign, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoiCalculator = () => {
    const navigate = useNavigate();
    const [teamSize, setTeamSize] = useState(5);
    const [docsPerMonth, setDocsPerMonth] = useState(30);

    // Calculations
    // Typical manual drafting + review + signing turnaround: 2.5 hours per doc vs. 20 mins with DocForge (saves ~2.16 hrs per doc)
    const hoursSavedPerMonth = Math.round(docsPerMonth * 2.2);
    // Typical competitor software stack (DocuSign $40/user + PandaDoc $35/user + Legal templates) vs DocForge
    const legacyCostPerYear = Math.round(teamSize * 50 * 12 + docsPerMonth * 8 * 12);
    const docForgeCostPerYear = teamSize > 1 ? 49 * 12 : 0; // Agency vs Free/Pro
    const dollarsSaved = Math.max(800, legacyCostPerYear - docForgeCostPerYear);
    const dealsSpeedupPercent = 68;

    return (
        <section id="roi-calculator" className="py-24 bg-slate-50 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Calculator size={14} /> ROI & Productivity Estimator
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
                        Calculate How Much <span className="text-indigo-600">Time & Capital</span> You Save
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        See the tangible impact of streamlining your document generation and electronic signature pipeline with DocForge.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-2xl shadow-slate-200/50 grid lg:grid-cols-12 gap-10 items-center">
                    {/* Left: Sliders */}
                    <div className="lg:col-span-6 space-y-8">
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <span>Team Members / Senders</span>
                                </label>
                                <span className="font-mono text-xl font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
                                    {teamSize} {teamSize === 1 ? 'Person' : 'People'}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={teamSize}
                                onChange={(e) => setTeamSize(Number(e.target.value))}
                                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-1 font-mono">
                                <span>1 Solo</span>
                                <span>25 Medium</span>
                                <span>50 Enterprise</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <span>Monthly Documents Generated</span>
                                </label>
                                <span className="font-mono text-xl font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100">
                                    {docsPerMonth} Docs/mo
                                </span>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="200"
                                step="5"
                                value={docsPerMonth}
                                onChange={(e) => setDocsPerMonth(Number(e.target.value))}
                                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-1 font-mono">
                                <span>5 docs</span>
                                <span>100 docs</span>
                                <span>200+ docs</span>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                                <span>Replaces expensive DocuSign, PandaDoc, & custom legal drafting fees</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                                <span>Zero per-envelope charges or hidden signee licensing costs</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Calculated Metrics Display */}
                    <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-2 text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                                    <Clock size={14} className="text-indigo-400" /> Hours Saved
                                </div>
                                <div className="text-3xl font-black text-white font-mono">
                                    {hoursSavedPerMonth} <span className="text-sm font-sans font-medium text-slate-400">hrs/mo</span>
                                </div>
                                <div className="text-[11px] text-slate-400 mt-1">
                                    ~{Math.round(hoursSavedPerMonth * 12 / 8)} full work days/year
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-2 text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                                    <TrendingUp size={14} className="text-emerald-400" /> Deal Velocity
                                </div>
                                <div className="text-3xl font-black text-emerald-400 font-mono">
                                    +{dealsSpeedupPercent}%
                                </div>
                                <div className="text-[11px] text-slate-400 mt-1">
                                    Faster signature turnaround
                                </div>
                            </div>
                        </div>

                        <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/30">
                            <div className="text-xs text-indigo-200 uppercase font-bold tracking-wider mb-1">
                                Estimated Annual Savings
                            </div>
                            <div className="text-4xl font-black text-white font-mono flex items-baseline gap-2">
                                ${dollarsSaved.toLocaleString()}
                                <span className="text-xs font-sans font-normal text-indigo-200">per year</span>
                            </div>
                            <div className="text-xs text-indigo-300/80 mt-1">
                                Based on average agency legal overhead & software consolidation
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/register')}
                            className="w-full py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-black text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer group"
                        >
                            <span>Start Saving with DocForge Free</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RoiCalculator;

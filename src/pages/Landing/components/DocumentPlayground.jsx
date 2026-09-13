import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, Shield, Zap, Receipt, UserCheck, ArrowRight, Sparkles, Check, Download, Eye, Lock, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDocumentLaunch } from '../../../hooks/useDocumentLaunch';

const demoTemplates = [
    {
        id: 'nda',
        title: 'Non-Disclosure Agreement',
        icon: Shield,
        badge: 'Legal',
        color: 'from-emerald-500 to-teal-600',
        textColor: 'text-emerald-600',
        bgLight: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        inputs: {
            partyA: 'Acme Technologies Inc.',
            partyB: 'Vertex Media LLC',
            jurisdiction: 'State of Delaware, USA',
            termMonths: '24 Months',
            scope: 'Software Architecture & Proprietary Source Code'
        }
    },
    {
        id: 'proposal',
        title: 'Business Proposal',
        icon: Zap,
        badge: 'Sales',
        color: 'from-indigo-600 to-purple-600',
        textColor: 'text-indigo-600',
        bgLight: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
        inputs: {
            projectName: 'Enterprise Portal Redesign 2026',
            clientName: 'Nova FinTech Corp',
            budget: '$34,500 USD',
            timeline: '6 Weeks (Phased Delivery)',
            deliverable: 'Custom React Web App + Design System + Security Audit'
        }
    },
    {
        id: 'invoice',
        title: 'Professional Invoice',
        icon: Receipt,
        badge: 'Billing',
        color: 'from-amber-500 to-orange-600',
        textColor: 'text-amber-600',
        bgLight: 'bg-amber-50',
        borderColor: 'border-amber-200',
        inputs: {
            invoiceNo: 'INV-2026-089',
            clientName: 'Quantum Studios',
            totalAmount: '$8,750.00',
            dueDate: 'Net 15 Days',
            itemDesc: 'Full-Stack Cloud Infrastructure & API Development'
        }
    },
    {
        id: 'consulting-agreement',
        title: 'Consulting Contract',
        icon: FileText,
        badge: 'Contract',
        color: 'from-blue-600 to-cyan-600',
        textColor: 'text-blue-600',
        bgLight: 'bg-blue-50',
        borderColor: 'border-blue-200',
        inputs: {
            consultant: 'Apex Strategy Group',
            client: 'Helix BioHealth Inc.',
            rate: '$225 / Hour',
            retainer: '$6,000 / Month',
            ipOwnership: 'Client Sole Ownership upon Full Payment'
        }
    }
];

const DocumentPlayground = () => {
    const navigate = useNavigate();
    const { launchDocument, AuthModalComponent } = useDocumentLaunch();
    const [activeTab, setActiveTab] = useState(demoTemplates[0].id);
    const currentDemo = demoTemplates.find(t => t.id === activeTab) || demoTemplates[0];
    const [fields, setFields] = useState(currentDemo.inputs);

    // Update fields when tab changes
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        const selected = demoTemplates.find(t => t.id === tabId);
        if (selected) {
            setFields(selected.inputs);
        }
    };

    const handleFieldChange = (key, value) => {
        setFields(prev => ({ ...prev, [key]: value }));
    };

    const copySampleText = () => {
        navigator.clipboard?.writeText(JSON.stringify(fields, null, 2));
        toast.success('Document sample parameters copied!');
    };

    return (
        <section id="interactive-playground" className="py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles size={14} className="text-indigo-600" /> Interactive Live Playground
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
                        Test the Document Engine in <span className="shimmer-text">Real-Time</span>
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Customize sample parameters below and see how DocForge renders pixel-perfect, legally robust documents instantly.
                    </p>
                </div>

                {/* Template Selector Tabs */}
                <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap mb-10">
                    {demoTemplates.map((template) => {
                        const Icon = template.icon;
                        const isActive = activeTab === template.id;
                        return (
                            <button
                                key={template.id}
                                onClick={() => handleTabChange(template.id)}
                                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/15 scale-105 ring-2 ring-slate-900'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100/80 hover:text-slate-900 shadow-sm'
                                }`}
                            >
                                <Icon size={16} className={isActive ? 'text-white' : template.textColor} />
                                <span>{template.title}</span>
                                <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-extrabold ${
                                    isActive ? 'bg-white/20 text-white' : `${template.bgLight} ${template.textColor}`
                                }`}>
                                    {template.badge}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Playground Main Grid */}
                <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left: Interactive Field Controls */}
                    <motion.div
                        key={`controls-${activeTab}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:col-span-5 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-100">
                                <div>
                                    <h3 className="font-extrabold text-slate-900 text-xl">{currentDemo.title}</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Live Parameter Customizer</p>
                                </div>
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                    <Check size={12} /> Auto-Syncing
                                </span>
                            </div>

                            <div className="space-y-4">
                                {Object.entries(fields).map(([key, val]) => {
                                    const formatLabel = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                                    return (
                                        <div key={key}>
                                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                {formatLabel}
                                            </label>
                                            <input
                                                type="text"
                                                value={val}
                                                onChange={(e) => handleFieldChange(key, e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-800 text-sm font-medium transition-all outline-none bg-slate-50/50 hover:bg-white focus:bg-white"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => launchDocument(activeTab)}
                                className="flex-1 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 transition-all cursor-pointer group"
                            >
                                <span>Launch Full Live Editor</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={copySampleText}
                                title="Copy Sample Data"
                                className="p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center cursor-pointer"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </motion.div>

                    {/* Right: Live Rendered Document Preview Mockup */}
                    <motion.div
                        key={`preview-${activeTab}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:col-span-7 bg-slate-900 rounded-3xl p-4 md:p-6 shadow-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden"
                    >
                        {/* Subtle background glow */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                        {/* Top Preview Bar */}
                        <div className="flex items-center justify-between px-2 pb-4 mb-3 border-b border-slate-800 text-slate-400 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                                </div>
                                <span className="font-mono text-slate-400 text-[11px] ml-2">DocForge Live Preview Engine v2.0</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
                                <Lock size={12} /> 256-bit Encrypted
                            </div>
                        </div>

                        {/* Rendered Realistic Paper Mockup */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl text-slate-900 font-sans border border-slate-100 flex-1 my-2 overflow-hidden select-none">
                            {/* Paper Header */}
                            <div className="flex items-start justify-between border-b border-slate-200 pb-5 mb-6">
                                <div>
                                    <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                                        DocForge Standard Agreement
                                    </div>
                                    <h4 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                                        {currentDemo.title}
                                    </h4>
                                    <div className="text-xs text-slate-400 mt-1 font-mono">
                                        Ref: DF-{activeTab.toUpperCase()}-{new Date().getFullYear()} • Draft Status: Ready
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-mono font-bold text-xs border border-emerald-200">
                                        VERIFIED TEMPLATE
                                    </span>
                                </div>
                            </div>

                            {/* Paper Dynamic Content */}
                            {activeTab === 'nda' && (
                                <div className="space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed">
                                    <p>
                                        This <strong>Non-Disclosure Agreement</strong> is made between <strong className="text-indigo-600 underline decoration-indigo-200 decoration-2">{fields.partyA || '[Disclosing Party]'}</strong> ("Disclosing Party") and <strong className="text-indigo-600 underline decoration-indigo-200 decoration-2">{fields.partyB || '[Recipient Party]'}</strong> ("Recipient").
                                    </p>
                                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                                        <div className="font-bold text-slate-900 mb-1 text-xs uppercase tracking-wide">Confidentiality Scope:</div>
                                        <p className="text-slate-600">{fields.scope || 'All proprietary intellectual property and confidential records.'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div className="p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100">
                                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Enforceability Term</span>
                                            <span className="font-semibold text-slate-800">{fields.termMonths}</span>
                                        </div>
                                        <div className="p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100">
                                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Governing Law</span>
                                            <span className="font-semibold text-slate-800">{fields.jurisdiction}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'proposal' && (
                                <div className="space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed">
                                    <p>
                                        Proposal prepared exclusively for <strong className="text-indigo-600 font-bold">{fields.clientName}</strong> covering <strong className="text-slate-900">{fields.projectName}</strong>.
                                    </p>
                                    <div className="p-3.5 bg-indigo-50/40 rounded-xl border border-indigo-100">
                                        <div className="font-bold text-slate-900 mb-1 text-xs uppercase tracking-wide">Key Deliverables:</div>
                                        <p className="text-slate-600">{fields.deliverable}</p>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                                        <div>
                                            <div className="text-[10px] uppercase font-bold text-slate-400">Total Investment</div>
                                            <div className="text-lg font-black text-slate-900 font-mono">{fields.budget}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] uppercase font-bold text-slate-400">Target Schedule</div>
                                            <div className="text-xs font-bold text-indigo-600">{fields.timeline}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'invoice' && (
                                <div className="space-y-4 text-xs md:text-sm text-slate-700">
                                    <div className="flex justify-between items-center text-xs">
                                        <div>
                                            <span className="text-slate-400 uppercase text-[10px] font-bold block">Bill To</span>
                                            <span className="font-bold text-slate-900">{fields.clientName}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-slate-400 uppercase text-[10px] font-bold block">Invoice Number</span>
                                            <span className="font-mono font-bold text-slate-900">{fields.invoiceNo}</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                                        <div className="flex justify-between font-bold text-slate-500 pb-1 mb-1 border-b border-slate-200">
                                            <span>Description</span>
                                            <span>Amount</span>
                                        </div>
                                        <div className="flex justify-between py-1 font-medium text-slate-800">
                                            <span>{fields.itemDesc}</span>
                                            <span className="font-mono">{fields.totalAmount}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                                        <span className="text-xs text-slate-500">Payment Terms: <strong>{fields.dueDate}</strong></span>
                                        <div className="text-right">
                                            <span className="text-[10px] uppercase text-slate-400 block font-bold">Total Due</span>
                                            <span className="text-xl font-black text-slate-900 font-mono">{fields.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'consulting-agreement' && (
                                <div className="space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed">
                                    <p>
                                        Independent Consulting Services Agreement between <strong className="text-blue-600">{fields.consultant}</strong> and <strong className="text-blue-600">{fields.client}</strong>.
                                    </p>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
                                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Hourly Rate</span>
                                            <span className="font-bold text-slate-900 font-mono">{fields.rate}</span>
                                        </div>
                                        <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
                                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Monthly Retainer</span>
                                            <span className="font-bold text-slate-900 font-mono">{fields.retainer}</span>
                                        </div>
                                    </div>
                                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                                        <span className="font-bold text-slate-800 block text-[10px] uppercase mb-0.5">IP Assignment:</span>
                                        <span className="text-slate-600">{fields.ipOwnership}</span>
                                    </div>
                                </div>
                            )}

                            {/* Paper Footer Signature Line */}
                            <div className="mt-6 pt-4 border-t border-dashed border-slate-300 flex items-center justify-between">
                                <div>
                                    <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Authorized Signature</div>
                                    <div className="font-handwriting text-2xl text-indigo-900 leading-none pt-1">Alex Vance</div>
                                </div>
                                <div className="text-right font-mono text-[9px] text-slate-400">
                                    DocForge Cryptographic Seal #DF-{Math.floor(100000 + Math.random() * 900000)}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Action strip */}
                        <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                            <span className="flex items-center gap-1 text-slate-300">
                                <Sparkles size={14} className="text-amber-400" /> Vector PDF generation ready
                            </span>
                            <button
                                onClick={() => launchDocument(activeTab)}
                                className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                                Open in Full Editor →
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Auth Modal */}
            <AuthModalComponent />
        </section>
    );
};

export default DocumentPlayground;

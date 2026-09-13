import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Lock, 
    X, 
    ArrowRight, 
    CheckCircle2, 
    ShieldCheck, 
    FileText, 
    Sparkles, 
    LogIn,
    UserPlus
} from 'lucide-react';

const TEMPLATE_DISPLAY_NAMES = {
    nda: {
        title: 'Non-Disclosure Agreement (NDA)',
        desc: 'Mutual & Unilateral confidentiality agreement with custom IP protection clauses.',
        target: '/documents/nda'
    },
    proposal: {
        title: 'Business Proposal',
        desc: 'Project scope, milestones, deliverables, and commercial pricing schedules.',
        target: '/documents/proposal'
    },
    'business-proposal': {
        title: 'Business Proposal',
        desc: 'Project scope, milestones, deliverables, and commercial pricing schedules.',
        target: '/documents/proposal'
    },
    'consulting-agreement': {
        title: 'Consulting Services Agreement',
        desc: 'Retainer, hourly, and milestone consulting terms with watertight IP transfer.',
        target: '/documents/consulting-agreement'
    },
    invoice: {
        title: 'Professional Invoice',
        desc: 'Automated line item calculations, tax configurations, and payment wiring details.',
        target: '/documents/invoice'
    },
    'invoice-generator': {
        title: 'Professional Invoice',
        desc: 'Automated line item calculations, tax configurations, and payment wiring details.',
        target: '/documents/invoice'
    },
    'offer-letter': {
        title: 'Employee Offer Letter',
        desc: 'Comprehensive employment agreement with salary, benefits, and eSignature blocks.',
        target: '/documents/offer-letter'
    },
    signature: {
        title: 'Electronic Signature Module',
        desc: 'Legally binding cryptographic eSignatures and tamper-evident SHA-256 audit logs.',
        target: '/signatures'
    },
    'electronic-signature': {
        title: 'Electronic Signature Module',
        desc: 'Legally binding cryptographic eSignatures and tamper-evident SHA-256 audit logs.',
        target: '/signatures'
    }
};

const AuthRequiredModal = ({ isOpen, onClose, templateId = 'nda' }) => {
    const navigate = useNavigate();
    const templateInfo = TEMPLATE_DISPLAY_NAMES[templateId] || {
        title: 'Document Workspace',
        desc: 'Create and customize legally binding documents and cryptographic contracts.',
        target: '/documents'
    };

    if (!isOpen) return null;

    const handleCreateAccount = () => {
        onClose();
        navigate(`/register?redirect=${encodeURIComponent(templateInfo.target)}`);
    };

    const handleSignIn = () => {
        onClose();
        navigate(`/login?redirect=${encodeURIComponent(templateInfo.target)}`);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-8"
                >
                    {/* Header Decorative Banner */}
                    <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-indigo-900 p-6 sm:p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                        
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Account Required to Edit &amp; Sign</span>
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                            Ready to craft your {templateInfo.title}?
                        </h2>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Sign in or create your free account to access our full document builder, live variables, and cryptographic e-signature vault.
                        </p>
                    </div>

                    {/* Body Content */}
                    <div className="p-6 sm:p-8 space-y-6">
                        {/* Selected Template Preview Box */}
                        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 flex items-start gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20 shrink-0">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Selected Blueprint</p>
                                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{templateInfo.title}</h4>
                                <p className="text-xs text-slate-500 mt-1 leading-normal">{templateInfo.desc}</p>
                            </div>
                        </div>

                        {/* Perks of Free Account */}
                        <div className="space-y-2.5">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Free Account Includes:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>Legally binding contracts</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>SHA-256 audit trails</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>Unlimited PDF exports</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>Saved custom templates</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-2">
                            <button
                                onClick={handleCreateAccount}
                                className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Create Free Account &amp; Start Drafting</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                                onClick={handleSignIn}
                                className="w-full py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Already have an account? Sign In</span>
                            </button>
                        </div>

                        {/* Trust Footer */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-xs text-slate-400 text-center">
                            <span>✨ Free forever starter tier</span>
                            <span>•</span>
                            <span>🔒 No credit card required</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthRequiredModal;

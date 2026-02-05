import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ArrowLeft } from 'lucide-react';
import SignerManagement from './SignerManagement';

const MobileSignerReview = memo(({ show, onClose, signers, onUpdateSigners, onSend, onBack }) => {
    return (
        <AnimatePresence>
            {show && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-50 lg:hidden flex flex-col"
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                            <h3 className="font-bold text-slate-800">Review Signers</h3>
                            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 bg-white safe-area-bottom">
                            <p className="text-sm text-slate-500 mb-4 px-1">Verify signer order and details before sending.</p>
                            <SignerManagement signers={signers} onUpdateSigners={onUpdateSigners} readOnly={true} />
                        </div>

                        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3 pb-8">
                            <button
                                onClick={onSend}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-600/20 transition-all active:scale-95"
                            >
                                <Send size={18} />
                                <span>Send Document</span>
                            </button>
                            <button
                                onClick={onBack}
                                className="w-full py-3 text-slate-500 font-medium hover:text-slate-800 bg-white border border-slate-200 rounded-xl active:bg-slate-50"
                            >
                                Back to Edit
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
});

export default MobileSignerReview;

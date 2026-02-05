import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, PenTool } from 'lucide-react';
import SignatureToolbar from '../../../../components/Nda/Signatures/SignatureToolbar';

const MobileSignatureTools = memo(({ show, onClose, signers, onProceed, canProceed }) => {
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
                        className="fixed bottom-0 left-0 right-0 h-[60vh] bg-white rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-50 lg:hidden flex flex-col"
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <PenTool size={18} className="text-indigo-600" />
                                Signature Tools
                            </h3>
                            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-white safe-area-bottom">
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Drag Fields to Canvas</h4>
                                {/* 
                                    Note: Drag and drop on mobile from a fixed drawer to a scrollable canvas 
                                    can be tricky. Ideally we might want 'Tap to Place' here, but reusing
                                    wrapper for consistency. Users can tap-hold-drag.
                                */}
                                <SignatureToolbar />
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between text-sm mb-3">
                                    <span className="text-slate-600 font-medium">Signers Required</span>
                                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs">{signers.length}</span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    {signers.map((signer) => (
                                        <div key={signer.id} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                            <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-[10px]">{signer.order}</div>
                                            <span className="truncate flex-1">{signer.name || signer.email || 'New Signer'}</span>
                                        </div>
                                    ))}
                                    {signers.length === 0 && (
                                        <p className="text-xs text-slate-400 italic">No signers yet. Add a field to create one.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-200 bg-slate-50 pb-8">
                            <button
                                onClick={onProceed}
                                disabled={!canProceed}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                            >
                                <span>Review & Send</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
});

export default MobileSignatureTools;

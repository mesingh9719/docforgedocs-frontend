import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, CheckCircle, PenTool, User, Clock, Lock } from 'lucide-react';

const MobileAuditDrawer = memo(({ show, onClose, auditLogs }) => {
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
                        className="fixed bottom-0 left-0 right-0 h-[80vh] bg-white rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-50 lg:hidden flex flex-col"
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <History size={18} className="text-indigo-600" />
                                Audit Trail
                            </h3>
                            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-white">
                            <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-8">
                                {auditLogs.map((log, idx) => {
                                    const getIcon = (action) => {
                                        switch (action) {
                                            case 'COMPLETED': return <CheckCircle size={14} className="text-emerald-600" />;
                                            case 'SIGNED': return <PenTool size={14} className="text-indigo-600" />;
                                            case 'VIEWED': return <User size={14} className="text-amber-600" />;
                                            default: return <Clock size={14} className="text-slate-500" />;
                                        }
                                    };

                                    const getRing = (action) => {
                                        switch (action) {
                                            case 'COMPLETED': return 'bg-emerald-100 ring-emerald-200';
                                            case 'SIGNED': return 'bg-indigo-100 ring-indigo-200';
                                            case 'VIEWED': return 'bg-amber-100 ring-amber-200';
                                            default: return 'bg-slate-100 ring-slate-200';
                                        }
                                    };

                                    return (
                                        <div key={idx} className="relative pl-8">
                                            <div className={`absolute -left-[9px] top-0 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm z-10 ${getRing(log.action)}`}>
                                                {getIcon(log.action)}
                                            </div>
                                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">{log.action}</span>
                                                    <span className="text-[10px] text-slate-400">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <User size={12} className="text-slate-400" />
                                                    <p className="text-xs font-semibold text-slate-800">{log.metadata?.signer_name || log.user || 'System'}</p>
                                                </div>
                                                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200/50 flex justify-between">
                                                    <span>{new Date(log.created_at).toLocaleDateString()}</span>
                                                    {log.ip_address && <span className="font-mono bg-white px-1 rounded border border-slate-100">{log.ip_address}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                                <Lock size={10} /> End-to-End Encrypted Log
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
});

export default MobileAuditDrawer;

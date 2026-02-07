import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { History, CheckCircle, PenTool, User, Clock, Lock } from 'lucide-react';

const SignatureAuditSidebar = memo(({ show, auditLogs }) => {
    return (
        <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{
                width: show ? 320 : 0,
                opacity: show ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: 'anticipate' }}
            className="bg-white border-l border-slate-200 overflow-hidden hidden lg:flex flex-col shadow-xl z-20 relative"
        >
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <History size={16} className="text-indigo-600" />
                    Audit Log
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div className="relative border-l-2 border-slate-100 ml-2.5">
                    {auditLogs.map((log, idx) => {
                        const getIcon = (action) => {
                            switch (action) {
                                case 'COMPLETED': return <CheckCircle size={12} className="text-emerald-600" />;
                                case 'SIGNED': return <PenTool size={12} className="text-indigo-600" />;
                                case 'VIEWED': return <User size={12} className="text-amber-600" />;
                                default: return <Clock size={12} className="text-slate-500" />;
                            }
                        };

                        const getRing = (action) => {
                            switch (action) {
                                case 'COMPLETED': return 'bg-emerald-50 ring-emerald-100';
                                case 'SIGNED': return 'bg-indigo-50 ring-indigo-100';
                                case 'VIEWED': return 'bg-amber-50 ring-amber-100';
                                default: return 'bg-slate-50 ring-slate-100';
                            }
                        };

                        return (
                            <div key={idx} className="relative pl-6 mb-6 last:mb-0">
                                <div className={`absolute -left-[7px] top-0 w-4 h-4 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm z-10 ${getRing(log.action)}`}>
                                    {getIcon(log.action)}
                                </div>

                                <div className="bg-white rounded-lg border border-slate-100 p-3 shadow-sm hover:shadow-md transition-all hover:border-indigo-100 group">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">{log.action}</span>
                                        <span className="text-[10px] text-slate-400">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="text-xs font-semibold text-slate-700 mb-1.5 line-clamp-1" title={log.metadata?.signer_name}>
                                        {log.metadata?.signer_name || log.user || 'System Action'}
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                                        <span className="text-[10px] text-slate-400">{new Date(log.created_at).toLocaleDateString()}</span>
                                        {log.ip_address && <span className="text-[9px] font-mono text-slate-300">{log.ip_address}</span>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Lock size={10} /> Certified Immutable
                </p>
            </div>
        </motion.aside>
    );
});

export default SignatureAuditSidebar;

import React from 'react';
import { X, Calendar, User, Mail, MessageSquare } from 'lucide-react';

const ShareHistoryModal = ({ isOpen, onClose, history, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Mail size={18} className="text-slate-500" /> Share History
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <div className="text-center py-8 text-slate-500">Loading history...</div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <Mail size={48} className="mx-auto mb-2 opacity-20" />
                            <p>No share history found for this document.</p>
                        </div>
                    ) : (
                        history.map((share) => (
                            <div key={share.id} className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{share.recipient_email}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                                <Calendar size={12} />
                                                {new Date(share.sent_at).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded h-fit whitespace-nowrap">
                                        Sent by: {share.sender?.name || 'System'}
                                    </div>
                                </div>
                                {share.message && (
                                    <div className="bg-slate-50 rounded-md p-3 text-sm text-slate-600 mt-2 flex gap-2">
                                        <MessageSquare size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
                                        <p className="italic">"{share.message}"</p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareHistoryModal;

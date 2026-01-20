import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Send, CheckCircle, AlertCircle, Loader2, Bell } from 'lucide-react';
import { sendDocument, remindDocument } from '../api/documents';

const SendDocumentModal = ({ isOpen, onClose, documentId, documentName, isReminder = false, onSuccess, getHtmlContent }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle'); // idle, sending, success, error
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const handleSend = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMessage('');

        try {
            let htmlContent = null;
            if (getHtmlContent) {
                htmlContent = await getHtmlContent();
            }

            let response;
            if (isReminder) {
                response = await remindDocument(documentId, email, message);
            } else {
                response = await sendDocument(documentId, email, message, htmlContent);
            }

            setStatus('success');
            if (onSuccess && response.document) {
                onSuccess(response.document);
            }

            setTimeout(() => {
                onClose();
                setStatus('idle');
                setEmail('');
                setMessage('');
            }, 2000);
        } catch (error) {
            console.error("Failed to send email", error);
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Failed to send email. Please try again.');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                    {isReminder ? <Bell size={20} className="text-amber-500" /> : <Mail size={20} className="text-indigo-600" />}
                                    {isReminder ? 'Send Reminder' : 'Send Document'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {isReminder ? `Follow up on "${documentName}"` : `Share "${documentName}" via email`}
                                </p>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {status === 'success' ? (
                                <div className="text-center py-8">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
                                    >
                                        <CheckCircle size={32} />
                                    </motion.div>
                                    <h4 className="font-bold text-slate-800 text-lg mb-2">{isReminder ? 'Reminder Sent!' : 'Email Queued!'}</h4>
                                    <p className="text-slate-500 text-sm">The {isReminder ? 'reminder' : 'document link'} has been sent to the recipient.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSend} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Recipient Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                                placeholder="client@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Custom Message (Optional)</label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                                            placeholder={isReminder ? "Just checking in on this..." : "Add a personal note..."}
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
                                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                            {errorMessage}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className={`w-full py-2.5 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${isReminder ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                                    >
                                        {status === 'sending' ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" /> Sending...
                                            </>
                                        ) : (
                                            <>
                                                {isReminder ? <Bell size={18} /> : <Send size={18} />}
                                                {isReminder ? 'Send Reminder' : 'Send Application'}
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SendDocumentModal;

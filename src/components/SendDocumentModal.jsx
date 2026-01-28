import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Send, CheckCircle, AlertCircle, Loader2, Bell } from 'lucide-react';
import { sendDocument, remindDocument } from '../api/documents';

const SendDocumentModal = ({ isOpen, onClose, documentId, documentName, isReminder = false, onSuccess, getHtmlContent, signatures = [] }) => {
    // Split recipients into Signers (from signatures) and Viewers (CC)
    const [signers, setSigners] = useState([]);
    const [viewers, setViewers] = useState([]);

    // Form State
    const [newViewerEmail, setNewViewerEmail] = useState('');
    const [message, setMessage] = useState('');

    // Request State
    const [status, setStatus] = useState('idle'); // idle, sending, success, error
    const [progress, setProgress] = useState({ current: 0, total: 0 }); // for batch sending
    const [errors, setErrors] = useState([]);

    // Initialize Signers from Signatures
    React.useEffect(() => {
        if (isOpen && signatures.length > 0) {
            // Deduplicate by email if possible, or just list all signature fields?
            // Usually one person might sign multiple times. We should group by unique email/name combinations.
            const uniqueSigners = [];
            const seen = new Set();

            signatures.forEach(sig => {
                const email = sig.metadata?.signeeEmail || '';
                const name = sig.metadata?.signeeName || 'Unknown Signer';
                const key = `${email}-${name}`;

                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueSigners.push({
                        id: sig.id,
                        name,
                        email,
                        role: 'signer',
                        isValid: !!email // Only valid if email exists
                    });
                }
            });
            setSigners(uniqueSigners);
        } else if (isOpen && signatures.length === 0) {
            setSigners([]);
        }
    }, [isOpen, signatures]);


    if (!isOpen) return null;

    const handleAddViewer = (e) => {
        e.preventDefault();
        if (newViewerEmail && /^\S+@\S+\.\S+$/.test(newViewerEmail)) {
            setViewers([...viewers, { email: newViewerEmail, role: 'viewer' }]);
            setNewViewerEmail('');
        }
    };

    const removeViewer = (index) => {
        setViewers(viewers.filter((_, i) => i !== index));
    };

    const updateSignerEmail = (index, newEmail) => {
        const updated = [...signers];
        updated[index].email = newEmail;
        updated[index].isValid = /^\S+@\S+\.\S+$/.test(newEmail);
        setSigners(updated);
    };

    const handleSend = async () => {
        setStatus('sending');
        setErrors([]);

        const allRecipients = [
            ...signers.filter(s => s.isValid).map(s => ({ email: s.email, type: 'signer' })),
            ...viewers.map(v => ({ email: v.email, type: 'viewer' }))
        ];

        if (allRecipients.length === 0) {
            setStatus('error');
            setErrors(['No valid recipients found. Please add an email.']);
            return;
        }

        setProgress({ current: 0, total: allRecipients.length });

        let successCount = 0;
        const currentErrors = [];

        try {
            // Prepare HTML ONLY ONCE if needed (backend might use it for all)
            let htmlContent = null;
            if (getHtmlContent) {
                htmlContent = await getHtmlContent();
            }

            // Iterate and Send
            for (let i = 0; i < allRecipients.length; i++) {
                const recipient = allRecipients[i];
                try {
                    if (isReminder) {
                        await remindDocument(documentId, recipient.email, message);
                    } else {
                        await sendDocument(documentId, recipient.email, message, htmlContent);
                    }
                    successCount++;
                } catch (err) {
                    console.error(`Failed to send to ${recipient.email}`, err);
                    currentErrors.push(`Failed to send to ${recipient.email}: ${err.message}`);
                }
                setProgress(prev => ({ ...prev, current: i + 1 }));
            }

            if (successCount === allRecipients.length) {
                setStatus('success');
                if (onSuccess) onSuccess({ sent_at: new Date().toISOString() }); // Mock updated doc object
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                    setMessage('');
                    setSigners([]);
                    setViewers([]);
                }, 2000);
            } else {
                setStatus('error');
                setErrors(currentErrors.length > 0 ? currentErrors : ['Some emails failed to send.']);
            }

        } catch (error) {
            console.error("Critical Failure", error);
            setStatus('error');
            setErrors(['A critical error occurred. Please try again.']);
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
                        className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                    {isReminder ? <Bell size={20} className="text-amber-500" /> : <Mail size={20} className="text-indigo-600" />}
                                    {isReminder ? 'Send Reminder' : 'Send Document'}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {isReminder ? `Follow up on "${documentName}"` : `Review signatures and send to recipients`}
                                </p>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {status === 'success' ? (
                                <div className="text-center py-8">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
                                    >
                                        <CheckCircle size={32} />
                                    </motion.div>
                                    <h4 className="font-bold text-slate-800 text-lg mb-2">Sent Successfully!</h4>
                                    <p className="text-slate-500 text-sm">All recipients have been notified.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">

                                    {/* Signers Section */}
                                    {signers.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                Signers (Detected)
                                            </h4>
                                            <div className="space-y-3">
                                                {signers.map((signer, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                                                            S{idx + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-semibold text-slate-700 truncate">{signer.name}</div>
                                                            <input
                                                                type="email"
                                                                value={signer.email}
                                                                onChange={(e) => updateSignerEmail(idx, e.target.value)}
                                                                placeholder="Enter signer email..."
                                                                className={`mt-1 w-full text-xs px-2 py-1 bg-white border rounded focus:ring-1 focus:ring-indigo-500 outline-none ${!signer.isValid ? 'border-red-300 text-red-600' : 'border-slate-200 text-slate-600'}`}
                                                            />
                                                        </div>
                                                        <div className="text-[10px] font-bold text-indigo-500 bg-indigo-100 px-2 py-1 rounded">
                                                            REQ
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Viewers/CC Section */}
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                            CC / Viewers
                                        </h4>
                                        <div className="space-y-3">
                                            {viewers.map((viewer, idx) => (
                                                <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">
                                                        CC
                                                    </div>
                                                    <div className="flex-1 text-sm text-slate-600 truncate">{viewer.email}</div>
                                                    <button onClick={() => removeViewer(idx)} className="text-slate-400 hover:text-red-500 p-1">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Add Viewer Input */}
                                            <form onSubmit={handleAddViewer} className="flex gap-2">
                                                <input
                                                    type="email"
                                                    value={newViewerEmail}
                                                    onChange={(e) => setNewViewerEmail(e.target.value)}
                                                    placeholder="Add a viewer (e.g. hr@company.com)"
                                                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 outline-none"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={!newViewerEmail}
                                                    className="px-3 py-2 bg-slate-100 text-slate-600 font-medium rounded-lg text-sm hover:bg-slate-200 disabled:opacity-50"
                                                >
                                                    Add
                                                </button>
                                            </form>
                                        </div>
                                    </div>

                                    {/* Message Section */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Custom Message</label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows={2}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
                                            placeholder={isReminder ? "Checking in..." : "Please review and sign..."}
                                        />
                                    </div>

                                    {/* Errors */}
                                    {errors.length > 0 && (
                                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                            {errors.map((err, i) => <div key={i} className="flex gap-2"><AlertCircle size={14} className="mt-1 shrink-0" /> {err}</div>)}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {status !== 'success' && (
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
                                <button
                                    onClick={handleSend}
                                    disabled={status === 'sending' || (signers.length === 0 && viewers.length === 0)}
                                    className={`w-full py-3 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${isReminder ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                                >
                                    {status === 'sending' ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Sending ({progress.current}/{progress.total})...
                                        </>
                                    ) : (
                                        <>
                                            {isReminder ? <Bell size={18} /> : <Send size={18} />}
                                            {isReminder ? 'Send Reminders' : 'Send to All Recipients'}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SendDocumentModal;

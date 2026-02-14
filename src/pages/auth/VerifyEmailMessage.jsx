import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { resendVerification } from '../../api/auth';
import AuthLayout from '../../components/auth/AuthLayout';

const VerifyEmailMessage = () => {
    const [resendStatus, setResendStatus] = useState('idle'); // idle, loading, success, error
    const [resendMessage, setResendMessage] = useState('');

    const handleResend = async () => {
        setResendStatus('loading');
        try {
            await resendVerification();
            setResendStatus('success');
            setResendMessage('Verification link resent!');
            setTimeout(() => {
                setResendStatus('idle');
                setResendMessage('');
            }, 5000);
        } catch (error) {
            console.error(error);
            setResendStatus('error');
            setResendMessage(error.response?.data?.message || 'Failed to resend.');
        }
    };

    return (
        <AuthLayout title="Check your inbox" subtitle="We've sent a verification link to your email.">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-indigo-100">
                    <Mail className="text-indigo-600" size={32} />
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 text-left">
                    <p className="text-sm font-bold text-slate-800 mb-3">
                        Click the link in the email to unlock:
                    </p>
                    <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-green-500 rounded-full shadow-sm shadow-green-200" />
                            Full access to all tools
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-green-500 rounded-full shadow-sm shadow-green-200" />
                            Secure document sharing
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-green-500 rounded-full shadow-sm shadow-green-200" />
                            Team collaboration features
                        </li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <div>
                        <p className="text-sm text-slate-500 mb-2">
                            Didn't receive the email? <span className="text-slate-400">Check spam or</span>
                        </p>
                        <button
                            onClick={handleResend}
                            disabled={resendStatus === 'loading' || resendStatus === 'success'}
                            className="inline-flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 font-bold text-sm bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {resendStatus === 'loading' ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Sending...
                                </>
                            ) : (
                                'Click to resend'
                            )}
                        </button>

                        <AnimatePresence>
                            {(resendStatus === 'success' || resendStatus === 'error') && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`text-xs mt-3 font-bold ${resendStatus === 'success' ? 'text-green-600' : 'text-red-500'}`}
                                >
                                    {resendMessage}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </AuthLayout>
    );
};

export default VerifyEmailMessage;

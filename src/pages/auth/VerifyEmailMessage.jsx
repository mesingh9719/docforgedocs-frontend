import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const VerifyEmailMessage = () => {
    return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 relative z-10 text-center"
            >
                <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                    <Mail className="h-8 w-8 text-purple-400" />
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Check your inbox</h2>
                    <p className="text-gray-400 text-lg">
                        We've sent a verification link to your email.
                    </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 text-left border border-white/5">
                    <p className="text-sm text-gray-300 mb-2">
                        Click the link in the email to verify your account and unlock:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            Full access to all tools
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            Secure document sharing
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            Team collaboration features
                        </li>
                    </ul>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-gray-500">
                        Didn't receive the email? <span className="text-gray-400">Check your spam folder or</span>
                        <button className="ml-1 text-purple-400 hover:text-purple-300 font-medium transition-colors">
                            click to resend
                        </button>
                    </p>
                </div>

                <div className="text-sm">
                    <Link to="/login" className="text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2 group">
                        Back to login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyEmailMessage;

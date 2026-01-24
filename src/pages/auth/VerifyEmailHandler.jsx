import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const VerifyEmailHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { fetchUser } = useAuth(); // To refresh user state after verification
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const verify = async () => {
            const verifyUrl = searchParams.get('verify_url');

            if (!verifyUrl) {
                setStatus('error');
                setMessage('Invalid verification link.');
                return;
            }

            try {
                // The verifyUrl is the full backend signed URL. 
                // We need to bypass the axios baseURL if the verifyUrl is absolute, 
                // but our axios instance might prepend baseURL if we are not careful.
                // However, our backend generates a full URL.
                // Let's use fetch or a clean axios call.

                // Assuming verifyUrl is something like http://localhost:8000/api/v1/email/verify/...
                // Our axios instance usually has baseURL set.

                // Let's extract the path or just use the full URL. 
                // Since it's a signed URL, it must be exact.

                await axios.get(verifyUrl);

                setStatus('success');
                setMessage('Email verified successfully!');

                // Refresh user context
                await fetchUser();

                // Redirect to onboarding after a delay
                setTimeout(() => {
                    navigate('/onboarding');
                }, 2000);


            } catch (error) {
                console.error("Verification failed", error);
                setStatus('error');
                const errMsg = error.response?.data?.message || 'Verification failed. The link may be expired.';
                setMessage(errMsg);
                toast.error(errMsg);
            }
        };

        verify();
    }, [searchParams, navigate, fetchUser]);

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex justify-center items-center px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center relative z-10"
            >
                {status === 'verifying' && (
                    <>
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                        <h2 className="text-xl font-semibold text-white">Verifying...</h2>
                        <p className="text-gray-400 mt-2">Please wait while we secure your account.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Verified!</h2>
                        <p className="text-gray-400 mt-2">{message}</p>
                        <p className="text-sm text-gray-500 mt-4">Redirecting to onboarding...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                            <XCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Verification Failed</h2>
                        <p className="text-gray-400 mt-2">{message}</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10"
                        >
                            Back to Login
                        </button>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyEmailHandler;

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle, X, CloudUpload, Shield, Zap, Info, ArrowUp } from 'lucide-react';

const PDFUploader = ({ onFileUpload }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [isValidating, setIsValidating] = useState(false);

    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    const validateFile = (file) => {
        setError(null);
        if (file.type !== 'application/pdf') {
            setError('Please upload a valid PDF document.');
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            setError('File size must be under 10MB.');
            return false;
        }
        return true;
    };

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileSelection = (file) => {
        setIsValidating(true);
        setTimeout(() => {
            if (validateFile(file)) {
                setSelectedFile(file);
                setError(null);
                setTimeout(() => onFileUpload(file), 1500);
            } else {
                setSelectedFile(null);
            }
            setIsValidating(false);
        }, 1000);
    };

    const handleInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const handleRemove = () => {
        setSelectedFile(null);
        setError(null);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + ['Bytes', 'KB', 'MB'][i];
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 lg:p-12 relative overflow-hidden">

            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-5xl bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-white/50 flex flex-col md:flex-row overflow-hidden min-h-[550px]"
            >
                {/* Left Panel: Context & Features */}
                <div className="hidden md:flex w-full md:w-5/12 bg-white/40 p-10 lg:p-14 flex-col justify-between border-r border-slate-100/50">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full mb-8">
                            <Shield size={12} className="fill-indigo-700" />
                            Secure Environment
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-800 leading-tight mb-4">
                            Upload your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Document</span>
                        </h1>
                        <p className="text-slate-500 text-base leading-relaxed">
                            Drag and drop your PDF to get started. We use banking-grade encryption to ensure your documents remain private and secure throughout the signing workflow.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-700 text-sm">Lightning Fast</h3>
                                <p className="text-xs text-slate-500 mt-1">Instant processing and rendering.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                                <Shield size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-700 text-sm">Encrypted Storage</h3>
                                <p className="text-xs text-slate-500 mt-1">Your data never leaves our secure loop.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Interactive Dropzone */}
                <div className="w-full md:w-7/12 p-6 lg:p-12 flex flex-col items-center justify-center bg-gradient-to-br from-white to-slate-50/50 relative">
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => !selectedFile && document.getElementById('file-upload').click()}
                        className={`
                            relative w-full h-full min-h-[350px] border-[3px] border-dashed rounded-[2rem] flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer group
                            ${dragActive
                                ? 'border-indigo-500 bg-indigo-50/50 scale-[0.98]'
                                : selectedFile
                                    ? 'border-emerald-400 bg-emerald-50/30'
                                    : error
                                        ? 'border-red-300 bg-red-50/50'
                                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                            }
                        `}
                    >
                        <AnimatePresence mode="wait">
                            {isValidating ? (
                                <motion.div
                                    key="validating"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-col items-center p-8"
                                >
                                    <div className="relative w-24 h-24 mb-6">
                                        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin" />
                                        <FileText className="absolute inset-0 m-auto text-indigo-600" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">Verifying...</h3>
                                    <p className="text-slate-500 mt-2">Checking file integrity</p>
                                </motion.div>
                            ) : selectedFile ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center p-8 w-full max-w-sm"
                                >
                                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                        <CheckCircle size={48} className="text-emerald-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 break-words w-full px-4">{selectedFile.name}</h3>
                                    <p className="text-sm font-mono text-slate-500 mt-2 mb-6 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">
                                        {formatFileSize(selectedFile.size)}
                                    </p>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                                        className="text-rose-500 hover:text-rose-700 text-sm font-semibold flex items-center gap-2 px-4 py-2 hover:bg-rose-50 rounded-lg transition-colors"
                                    >
                                        <X size={16} /> Cancel
                                    </button>
                                </motion.div>
                            ) : error ? (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center p-8"
                                >
                                    <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                                        <AlertCircle size={40} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">Upload Failed</h3>
                                    <p className="text-red-500 mt-1 text-center max-w-xs">{error}</p>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setError(null); }}
                                        className="mt-6 text-slate-500 hover:text-slate-800 underline underline-offset-4"
                                    >
                                        Try again
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center p-8"
                                >
                                    <div className="w-28 h-28 bg-indigo-50/80 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-sm group-hover:shadow-md">
                                        <CloudUpload size={48} className="text-indigo-600 transition-colors group-hover:text-indigo-700" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">Drag & Drop PDF</h3>
                                    <p className="text-slate-500 mb-8 max-w-xs leading-relaxed">
                                        Drop your file here or click to browse. <br />
                                        <span className="text-xs text-slate-400 mt-1 block">Supports PDF up to 10MB</span>
                                    </p>

                                    <button className="px-8 py-3.5 bg-slate-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group-hover:bg-indigo-600">
                                        <FileText size={18} />
                                        <span>Choose Local File</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleInputChange}
                        className="hidden"
                    />
                </div>
            </motion.div>

            <p className="mt-8 text-center text-xs text-slate-400 font-medium">
                By uploading, you agree to our <span className="underline cursor-pointer hover:text-slate-600">Terms of Service</span> and <span className="underline cursor-pointer hover:text-slate-600">Privacy Policy</span>.
            </p>
        </div>
    );
};

export default PDFUploader;
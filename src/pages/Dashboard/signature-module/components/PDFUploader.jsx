import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';

const PDFUploader = ({ onFileUpload }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [isValidating, setIsValidating] = useState(false);

    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    const validateFile = (file) => {
        setError(null);
        
        if (file.type !== 'application/pdf') {
            setError('Only PDF files are allowed');
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError('File size must be less than 10MB');
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
            } else {
                setSelectedFile(null);
            }
            setIsValidating(false);
        }, 500);
    };

    const handleInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const handleProceed = () => {
        if (selectedFile) {
            onFileUpload(selectedFile);
        }
    };

    const handleRemove = () => {
        setSelectedFile(null);
        setError(null);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12"
            >
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        Upload Your Document
                    </h2>
                    <p className="text-slate-600">
                        Upload a PDF document to add signatures
                    </p>
                </div>

                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
                        relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300
                        ${dragActive 
                            ? 'border-indigo-500 bg-indigo-50' 
                            : selectedFile 
                                ? 'border-emerald-300 bg-emerald-50/50' 
                                : error 
                                    ? 'border-red-300 bg-red-50/50'
                                    : 'border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/30'
                        }
                    `}
                >
                    {isValidating ? (
                        <div className="text-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"
                            />
                            <p className="text-slate-600 font-medium">Validating file...</p>
                        </div>
                    ) : selectedFile ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-200">
                                <CheckCircle size={40} className="text-white" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">
                                {selectedFile.name}
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">
                                {formatFileSize(selectedFile.size)}
                            </p>
                            <button
                                onClick={handleRemove}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            >
                                <X size={16} />
                                Remove File
                            </button>
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={40} className="text-red-600" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-lg font-bold text-red-600 mb-2">
                                Upload Failed
                            </h3>
                            <p className="text-sm text-red-500 mb-4">
                                {error}
                            </p>
                            <button
                                onClick={() => setError(null)}
                                className="text-sm font-medium text-red-600 hover:text-red-700"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    ) : (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Upload size={40} className="text-indigo-600" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">
                                {dragActive ? 'Drop your file here' : 'Drag & drop your PDF here'}
                            </h3>
                            <p className="text-sm text-slate-500 mb-6">
                                or click to browse your files
                            </p>
                            <label className="inline-block cursor-pointer">
                                <span className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all inline-block">
                                    Choose File
                                </span>
                                <input
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={handleInputChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    )}
                </div>

                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                        File Requirements
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                            File format: PDF only
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                            Maximum size: 10MB
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                            Ensure document is readable and properly formatted
                        </li>
                    </ul>
                </div>

                {selectedFile && !error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 text-center"
                    >
                        <button
                            onClick={handleProceed}
                            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transition-all transform hover:scale-105"
                        >
                            Continue to Place Signatures
                        </button>
                    </motion.div>
                )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                >
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                        <FileText size={24} className="text-indigo-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mb-2">
                        Secure Upload
                    </h3>
                    <p className="text-xs text-slate-600">
                        Your documents are encrypted and secure
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                >
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                        <CheckCircle size={24} className="text-purple-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mb-2">
                        Easy Process
                    </h3>
                    <p className="text-xs text-slate-600">
                        Simple drag-and-drop signature placement
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                >
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                        <Upload size={24} className="text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mb-2">
                        Instant Download
                    </h3>
                    <p className="text-xs text-slate-600">
                        Get your signed document immediately
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default PDFUploader;
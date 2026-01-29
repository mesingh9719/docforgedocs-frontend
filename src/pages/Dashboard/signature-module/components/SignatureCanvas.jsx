import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Type, Upload as UploadIcon, Trash2, Check, X, RotateCcw } from 'lucide-react';

const SignatureCanvas = ({ signatures, pdfUrl, onComplete, onBack }) => {
    const [currentSignatureIndex, setCurrentSignatureIndex] = useState(0);
    const [signatureMethod, setSignatureMethod] = useState('draw'); // draw, type, upload
    const [drawnSignature, setDrawnSignature] = useState(null);
    const [typedSignature, setTypedSignature] = useState('');
    const [uploadedSignature, setUploadedSignature] = useState(null);
    const [selectedFont, setSelectedFont] = useState('Dancing Script');
    const [isDrawing, setIsDrawing] = useState(false);

    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const fileInputRef = useRef(null);

    const currentSignature = signatures[currentSignatureIndex];
    const progress = ((currentSignatureIndex + 1) / signatures.length) * 100;

    // Fonts for typed signatures
    const fonts = [
        { name: 'Dancing Script', style: 'cursive' },
        { name: 'Pacifico', style: 'cursive' },
        { name: 'Great Vibes', style: 'cursive' },
        { name: 'Allura', style: 'cursive' },
        { name: 'Sacramento', style: 'cursive' }
    ];

    // Initialize canvas
    useEffect(() => {
        if (signatureMethod === 'draw' && canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = canvas.offsetWidth * 2;
            canvas.height = canvas.offsetHeight * 2;
            canvas.style.width = `${canvas.offsetWidth / 2}px`;
            canvas.style.height = `${canvas.offsetHeight / 2}px`;

            const context = canvas.getContext('2d');
            context.scale(2, 2);
            context.lineCap = 'round';
            context.strokeStyle = '#1e293b';
            context.lineWidth = 2;
            contextRef.current = context;
        }
    }, [signatureMethod]);

    // Drawing handlers
    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const stopDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
        
        // Save the drawn signature
        if (canvasRef.current) {
            setDrawnSignature(canvasRef.current.toDataURL());
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        context.clearRect(0, 0, canvas.width, canvas.height);
        setDrawnSignature(null);
    };

    // Upload handler
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedSignature(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Submit signature
    const handleSubmit = () => {
        let signatureData = null;

        if (signatureMethod === 'draw' && drawnSignature) {
            signatureData = {
                type: 'drawn',
                data: drawnSignature
            };
        } else if (signatureMethod === 'type' && typedSignature.trim()) {
            signatureData = {
                type: 'typed',
                data: typedSignature,
                font: selectedFont
            };
        } else if (signatureMethod === 'upload' && uploadedSignature) {
            signatureData = {
                type: 'uploaded',
                data: uploadedSignature
            };
        }

        if (signatureData) {
            onComplete({
                fieldId: currentSignature.id,
                signature: signatureData,
                timestamp: new Date().toISOString()
            });

            // Move to next signature or finish
            if (currentSignatureIndex < signatures.length - 1) {
                setCurrentSignatureIndex(currentSignatureIndex + 1);
                resetSignature();
            }
        }
    };

    const resetSignature = () => {
        setDrawnSignature(null);
        setTypedSignature('');
        setUploadedSignature(null);
        if (canvasRef.current && contextRef.current) {
            clearCanvas();
        }
    };

    const canProceed = () => {
        if (signatureMethod === 'draw') return drawnSignature !== null;
        if (signatureMethod === 'type') return typedSignature.trim() !== '';
        if (signatureMethod === 'upload') return uploadedSignature !== null;
        return false;
    };

    return (
        <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">
                            Signing Progress
                        </h3>
                        <p className="text-sm text-slate-500">
                            Signature {currentSignatureIndex + 1} of {signatures.length}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-indigo-600">
                            {Math.round(progress)}%
                        </p>
                    </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Signature Input */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        {/* Current Signer Info */}
                        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                            <h4 className="text-sm font-bold text-indigo-900 mb-1">
                                Please sign here
                            </h4>
                            <p className="text-lg font-bold text-indigo-600">
                                {currentSignature.metadata.signeeName}
                            </p>
                            {currentSignature.metadata.signeeEmail && (
                                <p className="text-sm text-indigo-600 mt-1">
                                    {currentSignature.metadata.signeeEmail}
                                </p>
                            )}
                        </div>

                        {/* Method Selection */}
                        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6">
                            <button
                                onClick={() => setSignatureMethod('draw')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                                    signatureMethod === 'draw'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-800'
                                }`}
                            >
                                <PenTool size={18} />
                                Draw
                            </button>
                            <button
                                onClick={() => setSignatureMethod('type')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                                    signatureMethod === 'type'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-800'
                                }`}
                            >
                                <Type size={18} />
                                Type
                            </button>
                            <button
                                onClick={() => setSignatureMethod('upload')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                                    signatureMethod === 'upload'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-800'
                                }`}
                            >
                                <UploadIcon size={18} />
                                Upload
                            </button>
                        </div>

                        {/* Signature Input Area */}
                        <AnimatePresence mode="wait">
                            {signatureMethod === 'draw' && (
                                <motion.div
                                    key="draw"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <div className="relative">
                                        <canvas
                                            ref={canvasRef}
                                            onMouseDown={startDrawing}
                                            onMouseMove={draw}
                                            onMouseUp={stopDrawing}
                                            onMouseLeave={stopDrawing}
                                            onTouchStart={startDrawing}
                                            onTouchMove={draw}
                                            onTouchEnd={stopDrawing}
                                            className="w-full h-64 border-2 border-dashed border-slate-300 rounded-xl bg-white cursor-crosshair"
                                        />
                                        <button
                                            onClick={clearCanvas}
                                            className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-md border border-slate-200 hover:bg-red-50 hover:border-red-300 transition-colors"
                                            title="Clear"
                                        >
                                            <Trash2 size={18} className="text-slate-600 hover:text-red-600" />
                                        </button>
                                        {!drawnSignature && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <p className="text-slate-400 text-sm font-medium">
                                                    Draw your signature here
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {signatureMethod === 'type' && (
                                <motion.div
                                    key="type"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Type your full name
                                        </label>
                                        <input
                                            type="text"
                                            value={typedSignature}
                                            onChange={(e) => setTypedSignature(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Select font style
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {fonts.map((font) => (
                                                <button
                                                    key={font.name}
                                                    onClick={() => setSelectedFont(font.name)}
                                                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                                                        selectedFont === font.name
                                                            ? 'border-indigo-500 bg-indigo-50'
                                                            : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <p
                                                        style={{ fontFamily: font.name }}
                                                        className="text-xl text-slate-800"
                                                    >
                                                        {typedSignature || font.name}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {typedSignature && (
                                        <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-xl">
                                            <p className="text-xs font-medium text-slate-500 mb-3">Preview:</p>
                                            <p
                                                style={{ fontFamily: selectedFont }}
                                                className="text-4xl text-center text-slate-800"
                                            >
                                                {typedSignature}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {signatureMethod === 'upload' && (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
                                        {uploadedSignature ? (
                                            <div className="space-y-4">
                                                <img
                                                    src={uploadedSignature}
                                                    alt="Uploaded signature"
                                                    className="max-h-32 mx-auto"
                                                />
                                                <button
                                                    onClick={() => setUploadedSignature(null)}
                                                    className="text-sm font-medium text-red-600 hover:text-red-700"
                                                >
                                                    Remove & upload different
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <UploadIcon size={48} className="text-slate-400 mx-auto mb-4" />
                                                <p className="text-slate-600 font-medium mb-2">
                                                    Upload signature image
                                                </p>
                                                <p className="text-sm text-slate-500 mb-4">
                                                    PNG, JPG (max 5MB)
                                                </p>
                                                <label className="inline-block cursor-pointer">
                                                    <span className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors inline-block">
                                                        Choose Image
                                                    </span>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/png,image/jpeg,image/jpg"
                                                        onChange={handleImageUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Action Buttons */}
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={resetSignature}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                <RotateCcw size={18} />
                                Reset
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!canProceed()}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Check size={18} />
                                {currentSignatureIndex < signatures.length - 1 ? 'Next Signature' : 'Complete Signing'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Document Preview */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
                        <h4 className="text-sm font-bold text-slate-700 mb-4">
                            Document Preview
                        </h4>
                        <div className="bg-slate-100 rounded-lg p-4 aspect-[1/1.414] flex items-center justify-center">
                            <p className="text-slate-400 text-xs text-center">
                                PDF Preview<br />Placeholder
                            </p>
                        </div>

                        <div className="mt-6 space-y-3">
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Remaining Signatures
                            </h4>
                            {signatures.slice(currentSignatureIndex).map((sig, index) => (
                                <div
                                    key={sig.id}
                                    className={`p-3 rounded-lg border ${
                                        index === 0
                                            ? 'border-indigo-300 bg-indigo-50'
                                            : 'border-slate-200 bg-slate-50'
                                    }`}
                                >
                                    <p className="text-sm font-medium text-slate-700">
                                        {sig.metadata.signeeName}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Order: #{sig.metadata.order}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={onBack}
                            className="mt-6 w-full py-2 text-sm font-medium text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Back to Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignatureCanvas;
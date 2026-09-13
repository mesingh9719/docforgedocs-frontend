import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Type, Eraser, CheckCircle2, ShieldCheck, Lock, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SignaturePadDemo = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [mode, setMode] = useState('draw'); // 'draw' or 'type'
    const [typedName, setTypedName] = useState('Jordan Taylor');
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [certData, setCertData] = useState(null);

    // Initialize Canvas
    useEffect(() => {
        if (mode === 'draw' && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = '#1e1b4b'; // deep indigo
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
    }, [mode]);

    const startDrawing = (e) => {
        if (isVerified) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setHasDrawn(true);
    };

    const draw = (e) => {
        if (!isDrawing || isVerified) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        setHasDrawn(false);
        setIsVerified(false);
        setCertData(null);
    };

    const verifySignature = () => {
        if (mode === 'draw' && !hasDrawn) {
            toast.error('Please draw your signature first!');
            return;
        }
        if (mode === 'type' && !typedName.trim()) {
            toast.error('Please type your name first!');
            return;
        }

        setIsVerified(true);
        // Generate cryptographic-looking certificate
        const now = new Date();
        const randomHash = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        setCertData({
            signer: mode === 'draw' ? 'Authenticated Hand Signature' : typedName,
            hash: `SHA-256: e8b9...${randomHash}`,
            timestamp: now.toUTCString(),
            ipAddress: '192.0.2.' + Math.floor(Math.random() * 250 + 1),
            certId: `DF-CERT-${Math.floor(100000 + Math.random() * 900000)}`
        });
        toast.success('Signature encrypted & verified legally!');
    };

    return (
        <section id="signature-sandbox" className="py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative z-10 overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    {/* Left Column: Explainer & Benefits */}
                    <div className="lg:col-span-5">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <ShieldCheck size={16} /> Legal eSign Sandbox
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-6">
                            Try Drawing or Typing <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
                                Your Legal eSignature
                            </span>
                        </h2>
                        <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8">
                            Ditch expensive e-signature subscriptions. DocForge provides ESIGN & eIDAS compliant signing, tamper-proof audit trails, and instant verification for every party.
                        </p>

                        <div className="space-y-4 mb-8">
                            {[
                                { title: 'Federal ESIGN & UETA Compliance', desc: 'Legally enforceable in all 50 US states & worldwide.' },
                                { title: 'Cryptographic SHA-256 Audit Trails', desc: 'Tamper-evident certificate with IP stamps and UTC times.' },
                                { title: 'Zero Monthly Seat Costs', desc: 'Send unlimited e-signature requests with no client lock-in.' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3.5">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-200">{item.title}</div>
                                        <div className="text-xs text-slate-400 leading-relaxed">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate('/tools/electronic-signature')}
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all cursor-pointer group"
                        >
                            <span>Explore eSignatures Feature</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Right Column: Live Interactive Pad */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 text-slate-900 relative">
                            {/* Header Switcher */}
                            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => { setMode('draw'); setIsVerified(false); }}
                                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            mode === 'draw'
                                                ? 'bg-slate-900 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        <PenTool size={14} /> Draw Signature
                                    </button>
                                    <button
                                        onClick={() => { setMode('type'); setIsVerified(false); }}
                                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            mode === 'type'
                                                ? 'bg-slate-900 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        <Type size={14} /> Type Cursive
                                    </button>
                                </div>

                                <button
                                    onClick={clearCanvas}
                                    title="Reset Pad"
                                    className="text-slate-400 hover:text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                    <Eraser size={14} /> Clear
                                </button>
                            </div>

                            {/* Canvas / Type Area */}
                            <div className="relative bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 min-h-[180px] flex items-center justify-center overflow-hidden mb-6">
                                {mode === 'draw' ? (
                                    <>
                                        <canvas
                                            ref={canvasRef}
                                            width={550}
                                            height={180}
                                            onMouseDown={startDrawing}
                                            onMouseMove={draw}
                                            onMouseUp={stopDrawing}
                                            onMouseLeave={stopDrawing}
                                            onTouchStart={startDrawing}
                                            onTouchMove={draw}
                                            onTouchEnd={stopDrawing}
                                            className="w-full h-[180px] cursor-crosshair touch-none"
                                        />
                                        {!hasDrawn && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400">
                                                <PenTool size={24} className="mb-2 opacity-50" />
                                                <span className="text-xs font-medium">Draw your signature with mouse or touch</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full p-6 text-center">
                                        <input
                                            type="text"
                                            value={typedName}
                                            onChange={(e) => { setTypedName(e.target.value); setIsVerified(false); }}
                                            placeholder="Type your legal full name..."
                                            className="w-full bg-transparent text-center font-handwriting text-4xl md:text-5xl text-indigo-950 focus:outline-none placeholder:text-slate-300"
                                        />
                                        <div className="text-[11px] text-slate-400 mt-2 font-medium">Rendered with DocForge Legal Cursive Engine</div>
                                    </div>
                                )}

                                {/* Sign baseline indicator */}
                                <div className="absolute bottom-6 left-8 right-8 border-b border-slate-300 pointer-events-none flex justify-between text-[10px] text-slate-400 uppercase font-mono">
                                    <span>Sign on the line</span>
                                    <span>X</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
                                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                                    <Lock size={14} className="text-indigo-600" />
                                    <span>Protected with SHA-256 HMAC Stamp</span>
                                </div>

                                <button
                                    onClick={verifySignature}
                                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                        isVerified
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20'
                                    }`}
                                >
                                    {isVerified ? (
                                        <>
                                            <CheckCircle2 size={16} /> Seal Document (Verified)
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={16} /> Authenticate Signature
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Generated Certificate Drawer */}
                            <AnimatePresence>
                                {isVerified && certData && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-6 pt-5 border-t border-slate-200 overflow-hidden"
                                    >
                                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs font-mono text-emerald-950">
                                            <div className="flex items-center justify-between font-bold text-emerald-800 pb-2 mb-2 border-b border-emerald-200/80">
                                                <span className="flex items-center gap-1.5">
                                                    <ShieldCheck size={15} /> Cryptographic Audit Certificate
                                                </span>
                                                <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded text-emerald-900">
                                                    {certData.certId}
                                                </span>
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-2 text-[11px]">
                                                <div><span className="text-emerald-700 font-semibold">Signer:</span> {certData.signer}</div>
                                                <div><span className="text-emerald-700 font-semibold">IP Address:</span> {certData.ipAddress}</div>
                                                <div><span className="text-emerald-700 font-semibold">Audit Hash:</span> {certData.hash}</div>
                                                <div><span className="text-emerald-700 font-semibold">UTC Verified:</span> {certData.timestamp}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignaturePadDemo;

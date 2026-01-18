import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function NdaDocumentPreview({ data, content, zoom = 1 }) {

    // Helper to render placeholder or value
    const RenderField = ({ value, placeholder, className = "" }) => {
        if (!value) {
            return <span className={`bg-blue-50/50 px-1 border-b border-blue-200 text-slate-400 italic transition-colors hover:bg-blue-100 ${className}`}>{placeholder}</span>;
        }
        return <span className={`font-medium text-slate-900 border-b border-transparent hover:border-indigo-200 hover:bg-indigo-50 transition-all px-0.5 rounded ${className}`}>{value}</span>;
    };

    // Component to parse text and replace {{variable}} with RenderField components
    const DynamicText = ({ template, values }) => {
        if (!template) return null;

        const parts = template.split(/(\{\{[^}]+\}\})/g);

        return (
            <span>
                {parts.map((part, index) => {
                    if (part.startsWith('{{') && part.endsWith('}}')) {
                        const key = part.slice(2, -2).trim();
                        // Special handling for placeholder names if needed, defaults to key name
                        return <RenderField key={index} value={values[key]} placeholder={`[${key}]`} />;
                    }
                    return <span key={index}>{part}</span>;
                })}
            </span>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
            }}
            className="w-[210mm] min-h-[297mm] bg-white text-slate-800 text-[11pt] leading-relaxed font-serif relative mb-20 origin-top"
        >
            {/* Realistic Paper Effects */}
            <div className="absolute inset-0 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.1)] rounded-sm pointer-events-none"></div>

            <div className="p-[25mm] relative z-10">
                <h1 className="text-xl font-bold text-center mb-10 uppercase tracking-widest border-b-2 border-slate-900 pb-2">
                    {content.title}
                </h1>

                <p className="mb-6 text-justify">
                    <DynamicText template={content.preamble} values={data} />
                </p>

                <div className="mb-8 pl-4 border-l-4 border-slate-100">
                    <p className="font-bold text-xs uppercase text-slate-400 mb-1">BY AND BETWEEN</p>
                    <p className="mb-4 text-justify">
                        <DynamicText template={content.partiesDisclosing} values={data} />
                    </p>

                    <p className="font-bold text-xs uppercase text-slate-400 mb-1">AND</p>
                    <p className="mb-2 text-justify">
                        <DynamicText template={content.partiesReceiving} values={data} />
                    </p>
                </div>

                <p className="text-justify mb-8">
                    <DynamicText template={content.partiesFooter} values={data} />
                </p>

                {/* Dynamic Sections Loop */}
                <div className="space-y-6 min-h-[100px]">
                    <AnimatePresence>
                        {content.sections && content.sections.map((section, index) => (
                            <motion.section
                                key={section.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <h2 className="font-bold text-sm uppercase mb-2">
                                    {index + 1}. {section.title}
                                </h2>
                                <p className="text-justify">
                                    <DynamicText template={section.content} values={data} />
                                </p>
                            </motion.section>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Signatures (Fixed at bottom) */}
                <div className="mt-12 break-inside-avoid">
                    <h2 className="font-bold text-sm uppercase mb-6 border-b border-slate-900 pb-1">{content.sections.length + 1}. Signatures</h2>
                    <p className="mb-8">IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.</p>

                    <div className="grid grid-cols-2 gap-16">
                        <div className="space-y-1">
                            <p className="font-bold uppercase text-xs tracking-wider mb-8">For Disclosing Party</p>

                            <div className="relative border-b border-slate-800 h-8 mb-2">
                                {/* Simulated Signature */}
                                {data.disclosingSignatoryName && (
                                    <span className="absolute bottom-1 left-2 font-cursive text-xl text-blue-900 opacity-80 rotate-[-2deg]">
                                        {data.disclosingSignatoryName}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs uppercase text-slate-500">Authorized Signature</p>

                            <div className="pt-4 grid grid-cols-[80px_1fr] gap-x-2 gap-y-1 items-baseline">
                                <span className="text-sm font-medium">Name:</span>
                                <span className="border-b border-slate-300 w-full inline-block h-5 pl-1">{data.disclosingSignatoryName}</span>

                                <span className="text-sm font-medium">Title:</span>
                                <span className="border-b border-slate-300 w-full inline-block h-5 pl-1">{data.disclosingSignatoryDesignation}</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="font-bold uppercase text-xs tracking-wider mb-8">For Receiving Party</p>
                            <div className="relative border-b border-slate-800 h-8 mb-2">
                                {/* Simulated Signature */}
                                {data.receivingSignatoryName && (
                                    <span className="absolute bottom-1 left-2 font-cursive text-xl text-blue-900 opacity-80 rotate-[-2deg]">
                                        {data.receivingSignatoryName}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs uppercase text-slate-500">Authorized Signature</p>

                            <div className="pt-4 grid grid-cols-[80px_1fr] gap-x-2 gap-y-1 items-baseline">
                                <span className="text-sm font-medium">Name:</span>
                                <span className="border-b border-slate-300 w-full inline-block h-5 pl-1">{data.receivingSignatoryName}</span>

                                <span className="text-sm font-medium">Title:</span>
                                <span className="border-b border-slate-300 w-full inline-block h-5 pl-1">{data.receivingSignatoryDesignation}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Branding Footer specific to document */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-[9px] text-slate-300 uppercase tracking-widest font-sans">Powered by DocForge</p>
                </div>
            </div>
        </motion.div>
    );
}

export default NdaDocumentPreview;

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignatureLayer from '../../../components/Nda/Signatures/SignatureLayer';

function NdaDocumentPreview({
    data,
    content,
    zoom = 1,
    printing = false,
    readOnly = false,
    // Signature Props
    signatures = [],
    onUpdateSignature,
    onRemoveSignature,
    onEditSignature
}) {

    // Helper to render placeholder or value
    const RenderField = ({ value, placeholder, className = "" }) => {
        if (!value) {
            // In readOnly mode, show placeholder cleanly or empty? Usually placeholder is better but subtle.
            if (readOnly) return <span className={`text-slate-500 italic ${className}`}>{placeholder}</span>;
            return <span className={`bg-blue-50/50 px-1 border-b border-blue-200 text-slate-400 italic transition-colors hover:bg-blue-100 ${className}`}>{placeholder}</span>;
        }
        // In readOnly mode, just show the text
        if (readOnly) return <span className={`font-medium text-slate-900 ${className}`}>{value}</span>;
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

    const Container = printing ? 'div' : motion.div;
    const Section = printing ? 'div' : motion.section;

    return (
        <Container
            id="printable-document"
            {...(!printing ? {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
            } : {})}
            style={{
                transform: printing ? 'none' : `scale(${zoom})`,
                transformOrigin: 'top center',
            }}
            className="w-[210mm] min-h-[297mm] bg-white text-slate-800 text-[11pt] leading-relaxed font-serif relative mb-20 origin-top shadow-lg"
        >
            {/* Realistic Paper Effects - Hide when printing */}
            {!printing && (
                <div className="no-print absolute inset-0 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.1)] rounded-sm pointer-events-none"></div>
            )}

            {/* Signature Layer Overlay */}
            {!printing && !readOnly && (
                <SignatureLayer
                    signatures={signatures}
                    onUpdateSignature={onUpdateSignature}
                    onRemoveSignature={onRemoveSignature}
                    onEditSignature={onEditSignature}
                />
            )}

            {/* Flattened Static Signatures for PDF/Print */}
            {(printing || readOnly) && signatures.length > 0 && (
                <div className="absolute inset-0 z-50 pointer-events-none">
                    {signatures.map(sig => (
                        <div
                            key={sig.id}
                            style={{
                                position: 'absolute',
                                left: `${sig.position.x}px`,
                                top: `${sig.position.y}px`,
                                width: '200px', // Approximate width
                                height: '60px', // Approximate height
                                borderBottom: '1px solid #000',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end'
                            }}
                        >
                            {/* Signee Name (Script Style) or Image */}
                            <div style={{
                                fontFamily: 'cursive',
                                fontSize: '14pt',
                                color: '#1e3a8a',
                                marginBottom: '4px'
                            }}>
                                {sig.metadata.signeeName || 'Sign Here'}
                            </div>

                            {/* Label */}
                            <div style={{
                                fontSize: '8pt',
                                color: '#64748b',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {sig.metadata.type === 'date' ? 'Date' : 'Authorized Signature'}
                            </div>

                            {/* Optional Email/Details */}
                            {sig.metadata.signeeEmail && (
                                <div style={{
                                    fontSize: '7pt',
                                    color: '#94a3b8',
                                    position: 'absolute',
                                    bottom: '-14px',
                                    left: '0'
                                }}>
                                    {sig.metadata.signeeEmail}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="p-[10mm] relative z-10">
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
                    <AnimatePresence mode="popLayout">
                        {content.sections && content.sections.map((section, index) => (
                            <Section
                                key={section.id}
                                {...(!printing ? {
                                    layout: true,
                                    initial: { opacity: 0, y: 10 },
                                    animate: { opacity: 1, y: 0 },
                                    exit: { opacity: 0, scale: 0.95 }
                                } : {})}
                            >
                                <h2 className="font-bold text-sm uppercase mb-2">
                                    {index + 1}. {section.title}
                                </h2>
                                <p className="text-justify">
                                    <DynamicText template={section.content} values={data} />
                                </p>
                            </Section>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Signatures (Fixed at bottom) */}
                <div className="mt-12 break-inside-avoid">
                    <h2 className="font-bold text-sm uppercase mb-6 border-b border-slate-900 pb-1">{content.sections.length + 1}. Signatures</h2>
                    <p className="mb-8">IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.</p>

                    {printing ? (
                        /* Table Layout for PDF Generation (DomPDF is robust with tables) */
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <tbody>
                                <tr>
                                    {/* Column 1: Disclosing Party */}
                                    <td style={{ width: '48%', verticalAlign: 'top', paddingRight: '2%' }}>
                                        <p className="font-bold uppercase text-xs tracking-wider mb-8">For Disclosing Party</p>

                                        <div className="relative border-b border-slate-800 h-8 mb-2" style={{ borderBottom: '1px solid #000', height: '40px', marginBottom: '10px' }}>
                                            {/* Signature - Text representation for PDF or Image if needed */}
                                            {data.disclosingSignatoryName && (
                                                <span style={{ fontFamily: 'cursive', fontSize: '16pt', color: '#1e3a8a' }}>
                                                    {data.disclosingSignatoryName}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs uppercase text-slate-500">Authorized Signature</p>

                                        <table style={{ width: '100%', marginTop: '15px' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: '60px', fontWeight: 'bold', fontSize: '10pt' }}>Name:</td>
                                                    <td style={{ borderBottom: '1px solid #ccc' }}>{data.disclosingSignatoryName}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ paddingBottom: '5px' }}></td><td></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '60px', fontWeight: 'bold', fontSize: '10pt' }}>Title:</td>
                                                    <td style={{ borderBottom: '1px solid #ccc' }}>{data.disclosingSignatoryDesignation}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>

                                    {/* Spacer */}
                                    <td style={{ width: '4%' }}></td>

                                    {/* Column 2: Receiving Party */}
                                    <td style={{ width: '48%', verticalAlign: 'top' }}>
                                        <p className="font-bold uppercase text-xs tracking-wider mb-8">For Receiving Party</p>

                                        <div className="relative border-b border-slate-800 h-8 mb-2" style={{ borderBottom: '1px solid #000', height: '40px', marginBottom: '10px' }}>
                                            {data.receivingSignatoryName && (
                                                <span style={{ fontFamily: 'cursive', fontSize: '16pt', color: '#1e3a8a' }}>
                                                    {data.receivingSignatoryName}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs uppercase text-slate-500">Authorized Signature</p>

                                        <table style={{ width: '100%', marginTop: '15px' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: '60px', fontWeight: 'bold', fontSize: '10pt' }}>Name:</td>
                                                    <td style={{ borderBottom: '1px solid #ccc' }}>{data.receivingSignatoryName}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ paddingBottom: '5px' }}></td><td></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '60px', fontWeight: 'bold', fontSize: '10pt' }}>Title:</td>
                                                    <td style={{ borderBottom: '1px solid #ccc' }}>{data.receivingSignatoryDesignation}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        /* Grid Layout for Browser View */
                        /* Grid Layout for Browser View */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
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
                    )}
                </div>

                {/* Branding Footer specific to document */}
                <div className={`absolute bottom-4 left-0 right-0 text-center ${printing ? 'no-absolute-print' : ''}`} style={printing ? { position: 'fixed', bottom: '0px', width: '100%', textAlign: 'center' } : {}}>
                    <p className="text-[9px] text-slate-300 uppercase tracking-widest font-sans">Powered by DocForge</p>
                </div>
            </div>
        </Container>
    );
}

export default NdaDocumentPreview;

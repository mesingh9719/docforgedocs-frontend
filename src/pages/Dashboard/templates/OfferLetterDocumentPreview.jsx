import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignatureLayer from '../../../components/Nda/Signatures/SignatureLayer';

function OfferLetterDocumentPreview({
    data,
    content,
    zoom = 1,
    printing = false,
    readOnly = false,
    // Signature Props
    signatures = [],
    onUpdateSignature,
    onRemoveSignature,
    onEditSignature,
    businessLogo,
    styles // Add styles prop
}) {

    // Helper to get consistent color for a variable name
    const getVariableColor = (name) => {
        if (!name) return 'bg-slate-100 text-slate-600 border-slate-200';
        const colors = [
            'bg-indigo-50 text-indigo-700 border-indigo-200',
            'bg-emerald-50 text-emerald-700 border-emerald-200',
            'bg-amber-50 text-amber-700 border-amber-200',
            'bg-rose-50 text-rose-700 border-rose-200',
            'bg-violet-50 text-violet-700 border-violet-200',
            'bg-sky-50 text-sky-700 border-sky-200'
        ];
        // Simple hash
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    // Helper to render placeholder or value
    const RenderField = ({ value, placeholder, name, className = "" }) => {
        const colorClass = getVariableColor(name);

        if (!value) {
            if (readOnly || printing) return <span className={`text-slate-500 italic ${className}`}>{placeholder}</span>;
            return <span className={`px-1.5 py-0.5 rounded border border-dashed ${colorClass} bg-opacity-50 font-medium text-xs mx-0.5 ${className}`}>{placeholder}</span>;
        }

        if (readOnly || printing) return <span className={`font-medium text-slate-900 ${className}`}>{value}</span>;

        // Highlighted filled value
        return (
            <span className={`px-1.5 py-0.5 rounded border ${colorClass} font-medium mx-0.5 transition-all hover:brightness-95 ${className}`}>
                {value}
            </span>
        );
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
                        // Handle multiline address
                        const val = values[key];
                        if (key.toLowerCase().includes('address') && val) {
                            return <span key={index} className="whitespace-pre-line"><RenderField value={val} name={key} placeholder={`[${key}]`} /></span>
                        }
                        return <RenderField key={index} value={values[key]} name={key} placeholder={`[${key}]`} />;
                    }
                    return <span key={index}>{part}</span>;
                })}
            </span>
        );
    };

    const Container = printing ? 'div' : motion.div;
    const Section = printing ? 'div' : motion.section;

    // Default styles for backward compatibility
    const s = styles || {
        fontFamily: 'font-sans',
        fontSize: 'text-[11pt]',
        lineHeight: 'leading-relaxed',
        textColor: '#1e293b',
        headingColor: '#0f172a',
        accentColor: '#4f46e5',
        pageMargin: 'p-[10mm]',
        paragraphSpacing: 'mb-6',
    };

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
                color: s.textColor,
            }}
            className={`
                w-[210mm] min-h-[297mm] bg-white relative mb-20 origin-top 
                ${printing ? '' : 'shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/60'}
                ${s.fontFamily} ${s.fontSize} ${s.lineHeight}
            `}
        >
            {/* Realistic Paper Effects - Hide when printing */}
            {!printing && (
                <div className="no-print absolute inset-0 rounded-sm pointer-events-none bg-gradient-to-b from-white to-slate-50/20"></div>
            )}

            {/* ... Signatures ... */}

            <div className={`${s.pageMargin} relative z-10`}>

                {/* Brand Logo */}
                {businessLogo && data.brandingEnabled !== false && data.brandingEnabled !== 'false' && (
                    <div
                        className={`flex mb-8 ${data.logoAlignment === 'left' ? 'justify-start' : data.logoAlignment === 'right' ? 'justify-end' : 'justify-center'}`}
                        style={printing ? { textAlign: data.logoAlignment || 'center' } : {}}
                    >
                        <img
                            src={businessLogo}
                            alt="Company Logo"
                            style={{ height: `${data.logoSize || 70}px`, objectFit: 'contain' }}
                        />
                    </div>
                )} {/**/}

                {/* Letter Header */}
                <div className="mb-8">
                    <p className={`font-medium ${s.paragraphSpacing}`}>
                        <DynamicText template={content.preamble} values={data} />
                    </p>

                    <div className={`whitespace-pre-line ${s.paragraphSpacing}`}>
                        <DynamicText template={content.partiesDisclosing} values={data} />
                    </div>

                    <p className={`${s.paragraphSpacing}`}>
                        <DynamicText template={content.partiesFooter} values={data} />
                    </p>
                </div>

                <div className={`text-justify ${s.paragraphSpacing}`}>
                    {/* Standard Letter Intro if not part of sections */}
                </div>

                {/* Dynamic Sections Loop */}
                <div className="space-y-6 min-h-[100px]">
                    <AnimatePresence mode="popLayout">
                        {content.sections && content.sections.map((section, index) => (
                            <Section
                                key={section.id}
                                className={s.paragraphSpacing}
                                {...(!printing ? {
                                    layout: true,
                                    initial: { opacity: 0, y: 10 },
                                    animate: { opacity: 1, y: 0 },
                                    exit: { opacity: 0, scale: 0.95 }
                                } : {})}
                            >
                                <h2
                                    className="font-bold text-sm uppercase mb-2"
                                    style={{ color: s.headingColor }}
                                >
                                    {section.title}
                                </h2>
                                <p className="text-justify">
                                    <DynamicText template={section.content} values={data} />
                                </p>
                            </Section>
                        ))}
                    </AnimatePresence>
                </div>

                {/* ... */}

                {/* Signatures (Fixed at bottom) */}
                <div className="mt-12 break-inside-avoid">
                    <p className="mb-8">Sincerely,</p>

                    {printing ? (
                        /* Table Layout for PDF Generation */
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <tbody>
                                <tr>
                                    {/* Column 1: Employer */}
                                    <td style={{ width: '48%', verticalAlign: 'top', paddingRight: '2%' }}>
                                        <p className="font-bold uppercase text-xs tracking-wider mb-8">For {data.employerName || 'The Company'}</p>

                                        <div className="relative border-b border-slate-800 h-8 mb-2" style={{ borderBottom: '1px solid #000', height: '40px', marginBottom: '10px' }}>
                                            {data.employerSignatoryName && (
                                                <span style={{ fontFamily: 'cursive', fontSize: '16pt', color: '#1e3a8a' }}>
                                                    {data.employerSignatoryName}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs uppercase text-slate-500">Authorized Signature</p>

                                        <table style={{ width: '100%', marginTop: '15px' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: '60px', fontWeight: 'bold', fontSize: '10pt' }}>Name:</td>
                                                    <td style={{ borderBottom: '1px solid #ccc' }}>{data.employerSignatoryName}</td>
                                                </tr>
                                                <tr><td style={{ paddingBottom: '5px' }}></td><td></td></tr>
                                                <tr>
                                                    <td style={{ width: '60px', fontWeight: 'bold', fontSize: '10pt' }}>Title:</td>
                                                    <td style={{ borderBottom: '1px solid #ccc' }}>{data.employerSignatoryTitle}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>

                                    <td style={{ width: '4%' }}></td>

                                    {/* Column 2: Candidate */}
                                    <td style={{ width: '48%', verticalAlign: 'top' }}>
                                        <p className="font-bold uppercase text-xs tracking-wider mb-8">Accepted By</p>

                                        <div className="relative border-b border-slate-800 h-8 mb-2" style={{ borderBottom: '1px solid #000', height: '40px', marginBottom: '10px' }}>
                                            {data.candidateSignatoryName && (
                                                <span style={{ fontFamily: 'cursive', fontSize: '16pt', color: '#1e3a8a' }}>
                                                    {data.candidateSignatoryName}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs uppercase text-slate-500">Candidate Signature</p>

                                        <table style={{ width: '100%', marginTop: '15px' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: '60px', fontWeight: 'bold', fontSize: '10pt' }}>Name:</td>
                                                    <td style={{ borderBottom: '1px solid #ccc' }}>{data.candidateName}</td>
                                                </tr>
                                                <tr><td style={{ paddingBottom: '5px' }}></td><td></td></tr>
                                                <tr>
                                                    <td style={{ width: '60px', fontWeight: 'bold', fontSize: '10pt' }}>Date:</td>
                                                    <td style={{ borderBottom: '1px solid #ccc' }}></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        /* Grid Layout for Browser View */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                            <div className="space-y-1">
                                <p className="font-bold uppercase text-xs tracking-wider mb-8">For {data.employerName || 'The Company'}</p>

                                <div className="relative border-b border-slate-800 h-8 mb-2">
                                    {data.employerSignatoryName && (
                                        <span className="absolute bottom-1 left-2 font-cursive text-xl text-blue-900 opacity-80 rotate-[-2deg]">
                                            {data.employerSignatoryName}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs uppercase text-slate-500">Authorized Signature</p>
                                <div className="pt-4 grid grid-cols-[60px_1fr] gap-x-2 gap-y-1 items-baseline">
                                    <span className="text-sm font-medium">Name:</span>
                                    <span className="border-b border-slate-300 w-full inline-block h-5 pl-1">{data.employerSignatoryName}</span>
                                    <span className="text-sm font-medium">Title:</span>
                                    <span className="border-b border-slate-300 w-full inline-block h-5 pl-1">{data.employerSignatoryTitle}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="font-bold uppercase text-xs tracking-wider mb-8">Accepted By</p>
                                <div className="relative border-b border-slate-800 h-8 mb-2">
                                    {data.candidateSignatoryName && (
                                        <span className="absolute bottom-1 left-2 font-cursive text-xl text-blue-900 opacity-80 rotate-[-2deg]">
                                            {data.candidateSignatoryName}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs uppercase text-slate-500">Candidate Signature</p>
                                <div className="pt-4 grid grid-cols-[60px_1fr] gap-x-2 gap-y-1 items-baseline">
                                    <span className="text-sm font-medium">Name:</span>
                                    <span className="border-b border-slate-300 w-full inline-block h-5 pl-1">{data.candidateName}</span>
                                    <span className="text-sm font-medium">Date:</span>
                                    <span className="border-b border-slate-300 w-full inline-block h-5 pl-1"></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {!printing && (
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                        <p className="text-[9px] text-slate-300 uppercase tracking-widest font-sans">Powered by DocForge</p>
                    </div>
                )}
            </div>
        </Container>
    );
}

export default OfferLetterDocumentPreview;

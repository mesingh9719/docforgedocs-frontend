import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ProposalDocumentPreview({ data, content, zoom = 1, printing = false, readOnly = false }) {

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

        return (
            <span className={`px-1.5 py-0.5 rounded border ${colorClass} font-medium mx-0.5 transition-all hover:brightness-95 ${className}`}>
                {value}
            </span>
        );
    };

    // Component to parse text and replace {{variable}} with RenderField components
    const DynamicText = ({ template, values }) => {
        if (!template) return null;

        // Support basic markdown-style bolding **text**
        const boldParts = template.split(/(\*\*[^*]+\*\*)/g);

        return (
            <span>
                {boldParts.map((part, index) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={index}>{part.slice(2, -2)}</strong>;
                    }

                    // Normal text parsing for {{variables}}
                    const varParts = part.split(/(\{\{[^}]+\}\})/g);
                    return (
                        <span key={index}>
                            {varParts.map((vPart, vIndex) => {
                                if (vPart.startsWith('{{') && vPart.endsWith('}}')) {
                                    const key = vPart.slice(2, -2).trim();
                                    return <RenderField key={vIndex} value={values[key]} name={key} placeholder={`[${key}]`} />;
                                }
                                // Handle newlines
                                return vPart.split('\n').map((line, lIndex) => (
                                    <React.Fragment key={lIndex}>
                                        {lIndex > 0 && <br />}
                                        {line}
                                    </React.Fragment>
                                ));
                            })}
                        </span>
                    );
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
            className="w-[210mm] min-h-[297mm] bg-white text-slate-800 text-[11pt] leading-relaxed font-serif relative mb-20 origin-top"
        >
            {/* Realistic Paper Effects */}
            <div className="no-print absolute inset-0 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.1)] rounded-sm pointer-events-none"></div>

            <div className="p-[10mm] h-full flex flex-col relative z-10 min-h-[297mm]">

                {/* 1. COVER PAGE LANDING */}
                <div
                    className={`flex-1 flex flex-col justify-center ${data.logoAlignment === 'left' ? 'items-start text-left' : data.logoAlignment === 'right' ? 'items-end text-right' : 'items-center text-center'} border-b-2 border-slate-900 mb-12 pb-12 break-after-page`}
                    style={printing ? { textAlign: data.logoAlignment || 'center' } : {}}
                >

                    {/* Brand Logo */}
                    {data.businessLogo && data.brandingEnabled !== false && data.brandingEnabled !== 'false' && (
                        <div className="mb-8 w-full">
                            <img
                                src={data.businessLogo}
                                alt="Company Logo"
                                style={{ height: `${data.logoSize || 80}px`, objectFit: 'contain', marginLeft: data.logoAlignment === 'right' ? 'auto' : data.logoAlignment === 'center' ? 'auto' : '0', marginRight: data.logoAlignment === 'left' ? 'auto' : data.logoAlignment === 'center' ? 'auto' : '0', display: 'block' }}
                                className={`object-contain ${data.logoAlignment === 'left' ? '' : data.logoAlignment === 'right' ? 'ml-auto' : 'mx-auto'}`}
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <span className="uppercase tracking-[0.2em] text-slate-400 text-sm font-sans">Project Proposal</span>
                    </div>

                    <h1 className="text-4xl font-bold text-slate-900 mb-2 max-w-lg leading-tight">
                        <RenderField value={data.proposalTitle} placeholder="[Project Name]" />
                    </h1>

                    <div className="w-16 h-1 bg-indigo-500 my-8"></div>

                    <div className={`grid grid-cols-1 gap-12 w-full max-w-md mt-8 ${data.logoAlignment === 'right' ? 'text-right' : 'text-left'}`}>
                        <div>
                            <p className="text-xs uppercase font-bold text-slate-400 mb-2 font-sans">Prepared For</p>
                            <div className="text-lg font-medium"><RenderField value={data.clientName} placeholder="[Client Name]" /></div>
                            <div className="text-slate-600"><RenderField value={data.clientCompany} placeholder="[Client Company]" /></div>
                            <div className="text-slate-500 text-sm mt-1 whitespace-pre-wrap"><RenderField value={data.clientAddress} placeholder="[Client Address]" /></div>
                        </div>

                        <div>
                            <p className="text-xs uppercase font-bold text-slate-400 mb-2 font-sans">Prepared By</p>
                            <div className="text-lg font-medium"><RenderField value={data.providerName} placeholder="[Your Name]" /></div>
                            <div className="text-slate-600"><RenderField value={data.providerCompany} placeholder="[Your Company]" /></div>
                            <div className="text-slate-500 text-sm mt-1 whitespace-pre-wrap"><RenderField value={data.providerAddress} placeholder="[Your Address]" /></div>
                        </div>
                    </div>

                    <div className={`mt-auto grid grid-cols-2 gap-8 w-full max-w-md text-sm border-t border-slate-100 pt-8`}>
                        <div className={data.logoAlignment === 'right' ? 'text-right order-2' : ''}>
                            <span className="text-slate-400">Date:</span> <RenderField value={data.proposalDate} placeholder="DD/MM/YYYY" />
                        </div>
                        <div className={data.logoAlignment === 'right' ? 'text-left order-1' : 'text-right'}>
                            <span className="text-slate-400">Ref:</span> <RenderField value={data.referenceNo} placeholder="-" />
                        </div>
                    </div>
                </div>

                {/* 2. DYNAMIC CONTENT */}
                <div className="space-y-8">
                    <AnimatePresence>
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
                                <h2 className="font-bold text-lg uppercase mb-3 text-slate-900 border-l-4 border-indigo-500 pl-3">
                                    {index + 2}. {section.title}
                                </h2>
                                <div className="text-justify text-slate-700">
                                    <DynamicText template={section.content} values={data} />
                                </div>

                                {/* SPECIAL RENDER: Timeline Table for the Timeline Section */}
                                {section.title.includes('Timeline') && (
                                    <div className="mt-6 mb-8 overflow-hidden rounded-lg border border-slate-200">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-xs">
                                                <tr>
                                                    <th className="px-4 py-3">Phase</th>
                                                    <th className="px-4 py-3">Description</th>
                                                    <th className="px-4 py-3 text-right">Duration</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {data.timeline.map((item, i) => (
                                                    <tr key={i} className="bg-white">
                                                        <td className="px-4 py-3 font-medium text-slate-900">{item.phase}</td>
                                                        <td className="px-4 py-3 text-slate-600">{item.description}</td>
                                                        <td className="px-4 py-3 text-right text-slate-500">{item.duration}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Section>
                        ))}
                    </AnimatePresence>
                </div>

                {/* 3. SIGNATURES */}
                <section className="mt-16 break-inside-avoid border-t-2 border-slate-900 pt-8">
                    <h2 className="font-bold text-lg uppercase mb-6 text-slate-900 pl-3 border-l-4 border-indigo-500">{content.sections.length + 2}. Acceptance</h2>
                    <p className="mb-8">By signing below, both parties agree to the terms and conditions outlined in this proposal.</p>

                    {printing ? (
                        /* TABLE LAYOUT FOR PDF */
                        <table style={{ width: '100%', marginTop: '20px' }}>
                            <tbody>
                                <tr>
                                    <td style={{ width: '48%', verticalAlign: 'top', paddingRight: '2%' }}>
                                        <p style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10pt', marginBottom: '20px', backgroundColor: '#f1f5f9', padding: '5px' }}>For Client</p>
                                        <table style={{ width: '100%' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: '80px', paddingBottom: '15px' }}>Name:</td>
                                                    <td style={{ borderBottom: '1px solid #ccc' }}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '80px', paddingBottom: '15px' }}>Designation:</td>
                                                    <td style={{ borderBottom: '1px solid #ccc' }}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '80px', paddingBottom: '15px' }}>Signature:</td>
                                                    <td style={{ borderBottom: '1px solid #ccc', height: '40px' }}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '80px' }}>Date:</td>
                                                    <td style={{ borderBottom: '1px solid #ccc' }}></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>

                                    <td style={{ width: '4%' }}></td>

                                    <td style={{ width: '48%', verticalAlign: 'top' }}>
                                        <p style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10pt', marginBottom: '20px', backgroundColor: '#f1f5f9', padding: '5px' }}>For Service Provider</p>
                                        <table style={{ width: '100%' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: '80px', paddingBottom: '15px' }}>Name:</td>
                                                    <td style={{ borderBottom: '1px solid #ccc' }}>{data.providerName}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '80px', paddingBottom: '15px' }}>Designation:</td>
                                                    <td style={{ borderBottom: '1px solid #ccc' }}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '80px', paddingBottom: '15px' }}>Signature:</td>
                                                    <td style={{ borderBottom: '1px solid #ccc', height: '40px' }}></td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '80px' }}>Date:</td>
                                                    <td style={{ borderBottom: '1px solid #ccc' }}></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        /* GRID LAYOUT FOR BROWSER */
                        /* Grid Layout for Browser View */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                            <div className="space-y-4">
                                <p className="font-bold uppercase text-xs tracking-wider mb-8 bg-slate-100 p-2 inline-block rounded">For Client</p>
                                <div className="grid grid-cols-[100px_1fr] gap-x-2 gap-y-4 items-baseline text-sm">
                                    <span className="font-medium text-slate-500">Name:</span>
                                    <div className="border-b border-slate-300 h-6"></div>

                                    <span className="font-medium text-slate-500">Designation:</span>
                                    <div className="border-b border-slate-300 h-6"></div>

                                    <span className="font-medium text-slate-500">Signature:</span>
                                    <div className="border-b border-slate-300 h-10"></div>

                                    <span className="font-medium text-slate-500">Date:</span>
                                    <div className="border-b border-slate-300 h-6"></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="font-bold uppercase text-xs tracking-wider mb-8 bg-slate-100 p-2 inline-block rounded">For Service Provider</p>
                                <div className="grid grid-cols-[100px_1fr] gap-x-2 gap-y-4 items-baseline text-sm">
                                    <span className="font-medium text-slate-500">Name:</span>
                                    <div className="border-b border-slate-300 h-6 text-slate-900">{data.providerName}</div>

                                    <span className="font-medium text-slate-500">Designation:</span>
                                    <div className="border-b border-slate-300 h-6"></div>

                                    <span className="font-medium text-slate-500">Signature:</span>
                                    <div className="border-b border-slate-300 h-10"></div>

                                    <span className="font-medium text-slate-500">Date:</span>
                                    <div className="border-b border-slate-300 h-6"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {!printing && (
                    <div className="mt-auto pt-12 text-center">
                        <p className="text-[9px] text-slate-300 uppercase tracking-widest font-sans">Generated by DocForge</p>
                    </div>
                )}
            </div>
        </Container>
    );
}

export default ProposalDocumentPreview;

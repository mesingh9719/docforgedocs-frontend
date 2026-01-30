import React from 'react';
import { motion } from 'framer-motion';

function InvoiceDocumentPreview({ data, totals, zoom = 1, printing = false, readOnly = false }) {

    const logoSize = data.logoSize || 60;
    const logoAlign = data.logoAlignment || 'left';

    const Logo = ({ className = "", style = {} }) => (
        data.businessLogo && data.brandingEnabled !== false && data.brandingEnabled !== 'false' ? (
            <img
                src={data.businessLogo}
                alt="Business Logo"
                className={`${className}`}
                style={{ height: `${logoSize}px`, objectFit: 'contain', ...style }}
            />
        ) : null
    );

    const RenderField = ({ value, placeholder, className = "" }) => {
        if (!value) {
            if (readOnly) return <span className={`text-slate-500 italic ${className}`}>{placeholder}</span>;
            return <span className={`bg-blue-50/50 px-1 border-b border-blue-200 text-slate-400 italic transition-colors hover:bg-blue-100 ${className}`}>{placeholder}</span>;
        }
        if (readOnly) return <span className={`font-medium text-slate-900 ${className}`}>{value}</span>;
        return <span className={`font-medium text-slate-900 border-b border-transparent hover:border-indigo-200 hover:bg-indigo-50 transition-all px-0.5 rounded ${className}`}>{value}</span>;
    };

    const Container = printing ? 'div' : motion.div;

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
            className="w-[210mm] min-h-[297mm] bg-white text-slate-800 text-[10pt] leading-relaxed font-sans relative mb-20 origin-top shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/60"
        >
            {/* Realistic Paper Effects */}
            {!printing && <div className="no-print absolute inset-0 rounded-sm pointer-events-none bg-gradient-to-b from-white to-slate-50/20"></div>}

            <div className="p-[10mm] h-full flex flex-col relative z-10 min-h-[297mm]">

                {/* 1. SELLER & INVOICE HEADER */}
                {printing ? (
                    <table style={{ width: '100%', marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '20px' }}>
                        <tbody>
                            {/* Center Logo Row */}
                            {logoAlign === 'center' && data.businessLogo && (
                                <tr>
                                    <td colSpan="2" style={{ textAlign: 'center', paddingBottom: '20px' }}>
                                        <Logo style={{ marginBottom: '15px' }} />
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td style={{ verticalAlign: 'top', width: '50%' }}>
                                    {/* Left Logo */}
                                    {logoAlign === 'left' && <div style={{ marginBottom: '15px' }}><Logo /></div>}

                                    <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-800">{data.invoiceTitle || 'Invoice'}</h1>
                                    <div className="mt-4 text-sm">
                                        <h2 className="font-bold text-lg"><RenderField value={data.sellerName} placeholder="[Your Company Name]" /></h2>
                                        <div className="text-slate-600 max-w-[250px] whitespace-pre-wrap"><RenderField value={data.sellerAddress} placeholder="[Full Address]" /></div>
                                        {data.sellerTaxId && <div className="mt-1"><span className="font-bold text-xs uppercase">GSTIN/Tax ID:</span> {data.sellerTaxId}</div>}
                                        <div className="mt-1 text-xs">
                                            {data.sellerEmail && <div>{data.sellerEmail}</div>}
                                            {data.sellerPhone && <div>{data.sellerPhone}</div>}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ verticalAlign: 'top', width: '50%', textAlign: 'right' }}>
                                    {/* Right Logo */}
                                    {logoAlign === 'right' && <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'flex-end' }}><Logo /></div>}

                                    <table style={{ float: 'right', width: 'auto', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <tbody>
                                            <tr><td style={{ fontWeight: 'bold', color: '#64748b', paddingRight: '10px' }}>Invoice #:</td><td className="font-mono"><RenderField value={data.invoiceNumber} placeholder="INV-0001" /></td></tr>
                                            <tr><td style={{ fontWeight: 'bold', color: '#64748b', paddingRight: '10px' }}>Date:</td><td><RenderField value={data.invoiceDate} placeholder="DD/MM/YYYY" /></td></tr>
                                            <tr><td style={{ fontWeight: 'bold', color: '#64748b', paddingRight: '10px' }}>Due Date:</td><td><RenderField value={data.dueDate} placeholder="DD/MM/YYYY" /></td></tr>
                                            <tr><td style={{ fontWeight: 'bold', color: '#64748b', paddingRight: '10px' }}>Place of Supply:</td><td><RenderField value={data.placeOfSupply} placeholder="State" /></td></tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <div className="flex flex-col gap-6 mb-8 border-b-2 border-slate-900 pb-6">
                        {/* Center Logo */}
                        {logoAlign === 'center' && (
                            <div className="flex justify-center mb-4">
                                <Logo />
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-0">
                            {/* Left Column */}
                            <div>
                                {/* Left Logo */}
                                {logoAlign === 'left' && <div className="mb-4"><Logo /></div>}

                                <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-800">{data.invoiceTitle || 'Invoice'}</h1>
                                <div className="mt-4 text-sm">
                                    <h2 className="font-bold text-lg"><RenderField value={data.sellerName} placeholder="[Your Company Name]" /></h2>
                                    <div className="text-slate-600 max-w-[250px] whitespace-pre-wrap"><RenderField value={data.sellerAddress} placeholder="[Full Address]" /></div>
                                    {data.sellerTaxId && <div className="mt-1"><span className="font-bold text-xs uppercase">GSTIN/Tax ID:</span> {data.sellerTaxId}</div>}
                                    <div className="mt-1 text-xs">
                                        {data.sellerEmail && <div>{data.sellerEmail}</div>}
                                        {data.sellerPhone && <div>{data.sellerPhone}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="text-right flex flex-col items-end">
                                {/* Right Logo */}
                                {logoAlign === 'right' && <div className="mb-4"><Logo /></div>}

                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm min-w-[200px]">
                                    <div className="flex justify-between mb-1 gap-4">
                                        <span className="text-slate-500 font-bold">Invoice #:</span>
                                        <RenderField value={data.invoiceNumber} placeholder="INV-0001" className="font-mono" />
                                    </div>
                                    <div className="flex justify-between mb-1 gap-4">
                                        <span className="text-slate-500 font-bold">Date:</span>
                                        <RenderField value={data.invoiceDate} placeholder="DD/MM/YYYY" />
                                    </div>
                                    <div className="flex justify-between mb-1 gap-4">
                                        <span className="text-slate-500 font-bold">Due Date:</span>
                                        <RenderField value={data.dueDate} placeholder="DD/MM/YYYY" />
                                    </div>
                                    <div className="flex justify-between gap-4">
                                        <span className="text-slate-500 font-bold">Place of Supply:</span>
                                        <RenderField value={data.placeOfSupply} placeholder="State" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. CLIENT INFO */}
                <div className="mb-8">
                    <p className="text-xs uppercase font-bold text-slate-400 mb-1">Bill To</p>
                    <div className="text-lg font-bold"><RenderField value={data.clientName} placeholder="[Client Name]" /></div>
                    <div className="text-slate-600 max-w-[300px] whitespace-pre-wrap"><RenderField value={data.clientAddress} placeholder="[Client Address]" /></div>
                    {data.clientTaxId && <div className="mt-1 text-sm"><span className="font-semibold">GSTIN/Tax ID:</span> {data.clientTaxId}</div>}
                </div>

                {/* 3. LINE ITEMS TABLE */}
                <div className="mb-8">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-800 text-white uppercase text-xs">
                            <tr>
                                <th className="px-3 py-2 text-left w-12">Sr.</th>
                                <th className="px-3 py-2 text-left">Description</th>
                                <th className="px-3 py-2 text-center w-20">Qty</th>
                                <th className="px-3 py-2 text-right w-24">Rate</th>
                                <th className="px-3 py-2 text-right w-32">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 border-b border-slate-200">
                            {data.items.map((item, index) => (
                                <tr key={index} className="even:bg-slate-50">
                                    <td className="px-3 py-2 text-slate-500">{index + 1}</td>
                                    <td className="px-3 py-2 font-medium">{item.description}</td>
                                    <td className="px-3 py-2 text-center">{item.quantity}</td>
                                    <td className="px-3 py-2 text-right">{Number(item.rate).toLocaleString()}</td>
                                    <td className="px-3 py-2 text-right font-bold">{Number(item.amount).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 4. TOTALS & TAX */}
                {printing ? (
                    <table style={{ width: '100%', marginBottom: '20px' }}>
                        <tbody>
                            <tr>
                                <td style={{ width: '50%' }}></td> {/* Spacer */}
                                <td style={{ width: '50%' }}>
                                    <table className="w-full text-sm">
                                        <tbody className="divide-y divide-slate-100">
                                            <tr>
                                                <td className="py-2 text-slate-600 font-medium">Subtotal</td>
                                                <td className="py-2 text-right font-bold">{totals.subtotal.toLocaleString()}</td>
                                            </tr>
                                            {data.taxType && Number(data.taxRate) > 0 && (
                                                <tr>
                                                    <td className="py-2 text-slate-600 font-medium">{data.taxType} ({data.taxRate}%)</td>
                                                    <td className="py-2 text-right font-bold">{totals.taxAmount.toLocaleString()}</td>
                                                </tr>
                                            )}
                                            <tr className="border-t-2 border-slate-800 text-base">
                                                <td className="py-2 font-extrabold text-slate-900">Total</td>
                                                <td className="py-2 text-right font-extrabold text-indigo-700">{totals.grandTotal.toLocaleString()}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: '50%' }}></td>
                                <td style={{ width: '50%', textAlign: 'right', fontSize: '10px', fontStyle: 'italic', color: '#64748b' }}>
                                    Amount in Words: <span className="font-semibold text-slate-700">{totals.amountInWords}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <div className="flex justify-end mb-8 break-inside-avoid">
                        <div className="w-[300px]">
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="py-2 text-slate-600 font-medium">Subtotal</td>
                                        <td className="py-2 text-right font-bold">{totals.subtotal.toLocaleString()}</td>
                                    </tr>
                                    {data.taxType && Number(data.taxRate) > 0 && (
                                        <tr>
                                            <td className="py-2 text-slate-600 font-medium">{data.taxType} ({data.taxRate}%)</td>
                                            <td className="py-2 text-right font-bold">{totals.taxAmount.toLocaleString()}</td>
                                        </tr>
                                    )}
                                    <tr className="border-t-2 border-slate-800 text-base">
                                        <td className="py-2 font-extrabold text-slate-900">Total</td>
                                        <td className="py-2 text-right font-extrabold text-indigo-700">{totals.grandTotal.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="mt-2 text-right text-xs text-slate-500 italic border-t border-slate-100 pt-1">
                                Amount in Words: <span className="font-semibold text-slate-700">{totals.amountInWords}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. BANK & FOOTER */}
                {printing ? (
                    <div className="mt-auto pt-8 border-t border-slate-200">
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr>
                                    <td style={{ verticalAlign: 'top', width: '60%' }}>
                                        <p className="font-bold uppercase text-xs text-slate-400 mb-2">Bank Details</p>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100" style={{ fontSize: '12px' }}>
                                            <p><span className="font-semibold">Account Name:</span> {data.accountName || '-'}</p>
                                            <p><span className="font-semibold">Bank Name:</span> {data.bankName || '-'}</p>
                                            <p><span className="font-semibold">Account No.:</span> {data.accountNumber || '-'}</p>
                                            <p><span className="font-semibold">IFSC/SWIFT:</span> {data.ifscCode || '-'}</p>
                                        </div>
                                        <div className="mt-4">
                                            <p className="font-bold uppercase text-xs text-slate-400 mb-1">Terms</p>
                                            <p className="text-xs text-slate-500">{data.notes}</p>
                                        </div>
                                    </td>
                                    <td style={{ verticalAlign: 'bottom', width: '40%', textAlign: 'right' }}>
                                        <p className="font-bold text-sm text-slate-900 mb-12">For {data.sellerName || '[Company Name]'}</p>
                                        <table style={{ width: '100%' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ borderTop: '1px solid #94a3b8', paddingTop: '8px', textAlign: 'center' }}>
                                                        <p className="font-bold">{data.signatoryName || 'Authorized Signatory'}</p>
                                                        <p className="text-xs text-slate-500">Authorized Signature</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="mt-auto grid grid-cols-2 gap-12 border-t border-slate-200 pt-8 break-inside-avoid">
                        <div className="text-sm">
                            <p className="font-bold uppercase text-xs text-slate-400 mb-2">Bank Details</p>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="grid grid-cols-[100px_1fr] gap-1 text-slate-700">
                                    <span className="font-semibold">Account Name:</span> <span>{data.accountName || '-'}</span>
                                    <span className="font-semibold">Bank Name:</span> <span>{data.bankName || '-'}</span>
                                    <span className="font-semibold">Account No.:</span> <span className="font-mono">{data.accountNumber || '-'}</span>
                                    <span className="font-semibold">IFSC/SWIFT:</span> <span className="font-mono">{data.ifscCode || '-'}</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="font-bold uppercase text-xs text-slate-400 mb-1">Terms</p>
                                <p className="text-xs text-slate-500">{data.notes}</p>
                            </div>
                        </div>

                        <div className="text-right flex flex-col items-end">
                            <p className="font-bold text-sm text-slate-900 mb-16">For {data.sellerName || '[Company Name]'}</p>
                            <div className="border-t border-slate-400 w-48 pt-2 text-center">
                                <p className="font-bold">{data.signatoryName || 'Authorized Signatory'}</p>
                                <p className="text-xs text-slate-500">Authorized Signature</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className={`mt-auto pt-4 text-center ${printing ? 'no-absolute-print' : ''}`} style={printing ? { position: 'fixed', bottom: '0px', width: '100%', textAlign: 'center' } : {}}>
                    <p className="text-[9px] text-slate-300 uppercase tracking-widest font-sans">Powered by DocForge</p>
                </div>

            </div>
        </Container>
    );
}

export default InvoiceDocumentPreview;

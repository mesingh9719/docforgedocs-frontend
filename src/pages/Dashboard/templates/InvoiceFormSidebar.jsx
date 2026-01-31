import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileText, User, ShoppingBag, Percent, Landmark, Info, Trash2, Plus, Palette, Type } from 'lucide-react';
import { BrandingControls } from '../../../components/Common/BrandingControls';
import StyleEditor from '../../../components/Common/StyleEditor';

// ... AccordionItem and InputGroup ...

const InvoiceFormSidebar = ({
    formData,
    onChange,
    updateItem,
    addItem,
    removeItem,
    totals,
    // Style Props
    styles,
    onStyleUpdate,
    onStyleReset
}) => {
    const [openSection, setOpenSection] = useState('details');
    const [mode, setMode] = useState('fill'); // 'fill' or 'style'

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="bg-white min-h-full pb-20">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
                <div className="flex gap-1 bg-slate-200/50 p-1 rounded-lg mb-4">
                    <button
                        onClick={() => setMode('fill')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === 'fill' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <FileText size={16} />
                        Invoice Details
                    </button>
                    <button
                        onClick={() => setMode('style')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === 'style' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Type size={16} />
                        Appearance
                    </button>
                </div>

                <h2 className="text-lg font-bold text-slate-900">{mode === 'fill' ? 'Invoice Details' : 'Styling & Appearance'}</h2>
                <p className="text-xs text-slate-500 mt-1">{mode === 'fill' ? 'Configure invoice data and line items' : 'Fonts, colors and spacing'}</p>
                {mode === 'fill' && (
                    <div className="mt-4 bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-800 uppercase">Grand Total</span>
                        <span className="text-lg font-bold text-emerald-600">{totals.grandTotal.toLocaleString()}</span>
                    </div>
                )}
            </div>

            {mode === 'fill' ? (
                <>
                    {/* 1. Invoice Basics */}
                    <AccordionItem
                        title="Invoice Basics"
                        icon={FileText}
                        isOpen={openSection === 'details'}
                        onClick={() => toggleSection('details')}
                    >
                        <InputGroup label="Invoice Title" name="invoiceTitle" value={formData.invoiceTitle} onChange={onChange} placeholder="INVOICE" />
                        <InputGroup label="Invoice Number" name="invoiceNumber" value={formData.invoiceNumber} onChange={onChange} placeholder="INV-001" />
                        <div className="grid grid-cols-2 gap-3">
                            <InputGroup label="Date" name="invoiceDate" value={formData.invoiceDate} onChange={onChange} placeholder="DD/MM/YYYY" />
                            <InputGroup label="Due Date" name="dueDate" value={formData.dueDate} onChange={onChange} placeholder="DD/MM/YYYY" />
                        </div>
                        <InputGroup label="Place of Supply" name="placeOfSupply" value={formData.placeOfSupply} onChange={onChange} placeholder="State/Country" />
                    </AccordionItem>

                    {/* Branding Settings */}
                    <AccordionItem
                        title="Document Branding"
                        icon={Palette}
                        isOpen={openSection === 'branding'}
                        onClick={() => toggleSection('branding')}
                    >
                        <BrandingControls formData={formData} onChange={onChange} />
                    </AccordionItem>


                    {/* 2. Bill From / Bill To */}
                    <AccordionItem
                        title="Parties Involved"
                        icon={User}
                        isOpen={openSection === 'parties'}
                        onClick={() => toggleSection('parties')}
                    >
                        <div className="space-y-4">
                            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                <h4 className="text-xs font-bold text-indigo-900 uppercase mb-3">Seller (You)</h4>
                                <div className="space-y-3">
                                    <InputGroup label="Name" name="sellerName" value={formData.sellerName} onChange={onChange} placeholder="Your Company" />
                                    <InputGroup label="Address" name="sellerAddress" value={formData.sellerAddress} onChange={onChange} placeholder="Address" rows={2} />
                                    <InputGroup label="Tax ID (GST/PAN)" name="sellerTaxId" value={formData.sellerTaxId} onChange={onChange} placeholder="Optional" />
                                    <div className="grid grid-cols-2 gap-2">
                                        <InputGroup label="Email" name="sellerEmail" value={formData.sellerEmail} onChange={onChange} placeholder="Email" />
                                        <InputGroup label="Phone" name="sellerPhone" value={formData.sellerPhone} onChange={onChange} placeholder="Phone" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <h4 className="text-xs font-bold text-slate-700 uppercase mb-3">Bill To (Client)</h4>
                                <div className="space-y-3">
                                    <InputGroup label="Client Name" name="clientName" value={formData.clientName} onChange={onChange} placeholder="Client Name" />
                                    <InputGroup label="Address" name="clientAddress" value={formData.clientAddress} onChange={onChange} placeholder="Client Address" rows={2} />
                                    <InputGroup label="Tax ID (GSTIN)" name="clientTaxId" value={formData.clientTaxId} onChange={onChange} placeholder="Optional" />
                                </div>
                            </div>
                        </div>
                    </AccordionItem>

                    {/* 3. Items */}
                    <AccordionItem
                        title="Line Items"
                        icon={ShoppingBag}
                        isOpen={openSection === 'items'}
                        onClick={() => toggleSection('items')}
                    >
                        <div className="space-y-4">
                            {formData.items.map((item, index) => (
                                <div key={index} className="bg-white border border-slate-200 rounded-lg p-3 relative group shadow-sm">
                                    <div className="mb-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Description</label>
                                        <input
                                            value={item.description}
                                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-sm outline-none focus:border-indigo-400 transition-colors"
                                            placeholder="Item Name"
                                        />
                                    </div>
                                    <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 items-end">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Qty</label>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-sm text-center font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Rate</label>
                                            <input
                                                type="number"
                                                value={item.rate}
                                                onChange={(e) => updateItem(index, 'rate', e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-sm text-right font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Amount</label>
                                            <div className="w-full bg-slate-100 border border-slate-200 rounded px-2 py-1.5 text-sm text-right font-bold text-slate-600 font-mono">
                                                {item.amount}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => removeItem(index)}
                                        className="absolute top-2 right-2 text-slate-300 hover:text-red-500 p-1 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addItem}
                                className="w-full py-2 border border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={14} /> Add Item
                            </button>
                        </div>
                    </AccordionItem>

                    {/* 4. Tax & Totals Config */}
                    <AccordionItem
                        title="Tax Details"
                        icon={Percent}
                        isOpen={openSection === 'tax'}
                        onClick={() => toggleSection('tax')}
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <InputGroup label="Tax Type" name="taxType" value={formData.taxType} onChange={onChange} placeholder="GST" />
                            <InputGroup label="Tax Rate (%)" name="taxRate" value={formData.taxRate} onChange={onChange} placeholder="18" type="number" />
                        </div>
                    </AccordionItem>

                    {/* 5. Bank Details */}
                    <AccordionItem
                        title="Bank & Payment"
                        icon={Landmark}
                        isOpen={openSection === 'bank'}
                        onClick={() => toggleSection('bank')}
                    >
                        <div className="space-y-3">
                            <InputGroup label="Account Name" name="accountName" value={formData.accountName} onChange={onChange} placeholder="Account Holder" />
                            <InputGroup label="Bank Name" name="bankName" value={formData.bankName} onChange={onChange} placeholder="Bank Name" />
                            <InputGroup label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={onChange} placeholder="XXXX XXXX XXXX" />
                            <InputGroup label="IFSC / SWIFT" name="ifscCode" value={formData.ifscCode} onChange={onChange} placeholder="Code" />
                        </div>
                    </AccordionItem>

                    {/* 6. Misc */}
                    <AccordionItem
                        title="Notes & Signatory"
                        icon={Info}
                        isOpen={openSection === 'notes'}
                        onClick={() => toggleSection('notes')}
                    >
                        <InputGroup label="Authorized Signatory Name" name="signatoryName" value={formData.signatoryName} onChange={onChange} placeholder="Name" />
                        <div className="h-2"></div>
                        <InputGroup label="Notes / Terms" name="notes" value={formData.notes} onChange={onChange} placeholder="Terms..." rows={3} />
                    </AccordionItem>
                </>
            ) : (
                <div className="p-4 pb-20">
                    <StyleEditor
                        styles={styles}
                        onUpdate={onStyleUpdate}
                        onReset={onStyleReset}
                    />
                </div>
            )}

        </div>
    );
};

export default InvoiceFormSidebar;

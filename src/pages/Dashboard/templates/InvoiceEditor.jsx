import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Download, Printer, ZoomIn, ZoomOut, Save } from 'lucide-react';
import InvoiceFormSidebar from './InvoiceFormSidebar';
import InvoiceDocumentPreview from './InvoiceDocumentPreview';
import { createDocument, getDocument, updateDocument } from '../../../api/documents';
import { getBusiness } from '../../../api/business';
import { useParams } from 'react-router-dom';

const InvoiceEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [zoom, setZoom] = useState(1);
    const [isSaving, setIsSaving] = useState(false);

    // Default form data
    const [formData, setFormData] = useState({
        // Invoice Details
        invoiceNumber: 'INV-0001',
        invoiceDate: new Date().toLocaleDateString(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(), // +15 days default
        placeOfSupply: 'State/Country',

        // Seller Details
        sellerName: '',
        sellerAddress: '',
        sellerTaxId: '', // GSTIN/PAN
        sellerEmail: '',
        sellerPhone: '',

        // Client Details
        clientName: '',
        clientAddress: '',
        clientTaxId: '',

        // Line Items
        items: [
            { description: 'Web Development Services', quantity: 1, rate: 5000, amount: 5000 },
        ],

        // Tax Configuration
        taxType: 'GST', // CGST/SGST or IGST or VAT
        taxRate: 18, // Percent

        // Bank Details
        accountName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',

        // Misc
        notes: 'This invoice is generated electronically and does not require a physical signature.',
        disputeDays: '7',
        signatoryName: ''
    });

    // Calculated fields state (derived from formData, but kept for clarity/passing down)
    const [totals, setTotals] = useState({
        subtotal: 0,
        taxAmount: 0,
        grandTotal: 0,
        amountInWords: 'Zero Only'
    });

    // Load Document
    useEffect(() => {
        if (id) {
            loadDocument(id);
        }
    }, [id]);

    const loadDocument = async (docId) => {
        try {
            const doc = await getDocument(docId);
            const content = doc.data.content || {};
            if (content.formData) setFormData(content.formData);
        } catch (error) {
            console.error("Failed to load invoice", error);
        }
    };

    // Load Business Details for Defaults
    useEffect(() => {
        if (!id) { // Only auto-populate for new documents
            const fetchBusinessDetails = async () => {
                try {
                    const business = await getBusiness();
                    if (business) {
                        setFormData(prev => ({
                            ...prev,
                            sellerName: business.name || '',
                            sellerAddress: [business.address, business.city, business.state, business.country, business.zip].filter(Boolean).join(', '),
                            sellerEmail: business.email || '',
                            sellerPhone: business.phone || '',
                            taxType: business.tax_label || 'Tax',
                            taxRate: business.tax_percentage || 0,
                            businessLogo: business.logo || null,
                            currencySymbol: business.currency_symbol || '$' // If you have currency in formData
                        }));
                    }
                } catch (error) {
                    console.error("Failed to load business details", error);
                }
            };
            fetchBusinessDetails();
        }
    }, [id]);

    // EFFECT: Auto-calculate totals whenever items or tax changes
    useEffect(() => {
        const subtotal = formData.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        const taxAmount = (subtotal * Number(formData.taxRate)) / 100;
        const grandTotal = subtotal + taxAmount;

        setTotals({
            subtotal,
            taxAmount,
            grandTotal,
            // Placeholder: A real implementation would use a library for number-to-words
            amountInWords: `${grandTotal.toLocaleString()} Only`
        });
    }, [formData.items, formData.taxRate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ----- Item Management -----

    const updateItem = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        // Auto-calculate amount if qty or rate changes
        if (field === 'quantity' || field === 'rate') {
            const qty = Number(field === 'quantity' ? value : newItems[index].quantity) || 0;
            const rate = Number(field === 'rate' ? value : newItems[index].rate) || 0;
            newItems[index].amount = qty * rate;
        }

        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
        }));
    };

    const removeItem = (index) => {
        if (formData.items.length <= 1) return;
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    // ---------------------------

    const handleBack = () => navigate('/documents');
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                name: `Invoice #${formData.invoiceNumber}` || 'Untitled Invoice',
                type_slug: 'invoice',
                content: {
                    formData
                },
                status: 'draft'
            };

            if (id) {
                await updateDocument(id, payload);
            } else {
                const newDoc = await createDocument(payload);
                navigate(`/documents/invoice/${newDoc.data.id}`, { replace: true });
            }
        } catch (error) {
            console.error("Failed to save", error);
            alert("Failed to save.");
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
            {/* Toolbar */}
            <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between flex-shrink-0 z-30 shadow-sm">
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                        title="Back to Documents"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-bold text-slate-800 text-sm md:text-lg">Service Invoice</h1>
                        <p className="text-[10px] md:text-xs text-slate-400 font-medium whitespace-nowrap">#{formData.invoiceNumber}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1 mr-4">
                        <button onClick={handleZoomOut} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 transition-all"><ZoomOut size={16} /></button>
                        <span className="text-xs font-semibold text-slate-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
                        <button onClick={handleZoomIn} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 transition-all"><ZoomIn size={16} /></button>
                    </div>

                    <button className="hidden md:flex items-center gap-2 px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all">
                        <Printer size={18} />
                        <span className="hidden sm:inline">Print</span>
                    </button>

                    <button className="flex items-center gap-2 px-3 md:px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all">
                        <Download size={18} />
                        <span className="hidden sm:inline">Export</span>
                    </button>

                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-4 md:px-5 py-2 rounded-lg text-white font-medium shadow-md transition-all ${isSaving ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {isSaving ? <Check size={18} /> : <Save size={18} />}
                        <span className="hidden md:inline">{isSaving ? 'Saved!' : 'Save'}</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
                {/* Left Panel: Editor Sidebar */}
                <div className="w-full lg:w-[400px] h-auto lg:h-full bg-white border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto z-20 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.1)] lg:shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] flex-shrink-0 order-2 lg:order-1 max-h-[40vh] lg:max-h-full">
                    <InvoiceFormSidebar
                        formData={formData}
                        onChange={handleChange}
                        updateItem={updateItem}
                        addItem={addItem}
                        removeItem={removeItem}
                        totals={totals}
                    />
                </div>

                {/* Right Panel: Live Preview */}
                <div className="flex-1 h-full overflow-y-auto bg-slate-100/50 p-4 md:p-8 sm:p-12 flex justify-center items-start scrollbar-thin scrollbar-thumb-slate-300 order-1 lg:order-2">
                    <InvoiceDocumentPreview data={formData} totals={totals} zoom={zoom} />
                </div>
            </div>
        </div>
    );
};

export default InvoiceEditor;

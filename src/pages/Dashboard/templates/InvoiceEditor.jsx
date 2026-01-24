import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Download, Printer, ZoomIn, ZoomOut, Save, Mail, Bell, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import InvoiceFormSidebar from './InvoiceFormSidebar';
import InvoiceDocumentPreview from './InvoiceDocumentPreview';
import PrintPortal from '../../../components/PrintPortal';
import SendDocumentModal from '../../../components/SendDocumentModal';
import { createDocument, getDocument, updateDocument, getNextInvoiceNumber } from '../../../api/documents';
import { getBusiness } from '../../../api/business';
import { generateDocumentPdf, wrapHtmlForPdf } from '../../../utils/pdfGenerator';
import { renderToStaticMarkup } from 'react-dom/server';
import { useParams } from 'react-router-dom';

const InvoiceEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [zoom, setZoom] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [documentName, setDocumentName] = useState('Untitled Invoice');

    // Default form data
    const [formData, setFormData] = useState({
        // Invoice Details
        invoiceTitle: 'INVOICE',
        invoiceNumber: '', // Will be populated
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
            if (doc.data.name) setDocumentName(doc.data.name);

            // Set tracking data
            if (doc.data.sent_at) setSentAt(doc.data.sent_at);

            const content = doc.data.content || {};
            if (content.formData) {
                setFormData(prev => ({
                    ...prev,
                    ...content.formData
                }));
            }
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

            const fetchNextNumber = async () => {
                try {
                    const res = await getNextInvoiceNumber();
                    if (res && res.next_number) {
                        setFormData(prev => ({ ...prev, invoiceNumber: res.next_number }));
                        setDocumentName(`Invoice #${res.next_number}`);
                    }
                } catch (error) {
                    console.error("Failed to fetch next invoice number", error);
                    setFormData(prev => ({ ...prev, invoiceNumber: 'INV-0001' }));
                    setDocumentName('Invoice #INV-0001');
                }
            };

            fetchBusinessDetails();
            fetchNextNumber();
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

        if (name === 'invoiceNumber') {
            setDocumentName(`Invoice #${value}`);
        }
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
                toast.success("Invoice updated successfully");
            } else {
                const newDoc = await createDocument(payload);
                toast.success("Invoice created successfully");
                navigate(`/documents/invoice/${newDoc.data.id}`, { replace: true });
            }
        } catch (error) {
            console.error("Failed to save", error);
            toast.error("Failed to save invoice");
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    };

    const [isPrinting, setIsPrinting] = useState(false);
    const lastGeneratedData = React.useRef(null);
    const [cachedPdfUrl, setCachedPdfUrl] = useState(null);

    const handlePrint = async () => {
        if (!id) {
            toast.error("Please save the document before printing.");
            return;
        }

        const currentDataString = JSON.stringify({ formData, totals });
        if (cachedPdfUrl && lastGeneratedData.current === currentDataString) {
            window.open(cachedPdfUrl, '_blank');
            return;
        }

        setIsPrinting(true);
        try {
            const documentHtml = renderToStaticMarkup(
                <InvoiceDocumentPreview data={formData} totals={totals} zoom={1} printing={true} />
            );

            const response = await generateDocumentPdf(
                id,
                documentHtml,
                formData.invoiceNumber ? `Invoice #${formData.invoiceNumber}` : 'Invoice'
            );

            if (response.url) {
                setCachedPdfUrl(response.url);
                lastGeneratedData.current = currentDataString;
                window.open(response.url, '_blank');
            }
        } catch (error) {
            console.error("PDF Generation failed", error);
            toast.error("Failed to generate PDF");
        } finally {
            setIsPrinting(false);
        }
    };

    // ...


    // ...

    const [isSending, setIsSending] = useState(false);
    const [sentAt, setSentAt] = useState(null);

    // Track sent status from document data
    useEffect(() => {
        // We need to fetch the document again or check if we already have it in a way 
        // that exposes sent_at. Currently loadDocument sets formData but not the metadata directly into state so easily.
        // Let's modify loadDocument to also check for sent_at or update a doc metadata state.
        // For now, let's assume we can get it from the API response we just fetched.
    }, [id]);

    // Better approach: Update loadDocument to setSentAt

    // ... INSTEAD OF THAT, I will replace the loadDocument and state definition area ...

    const handleSendEmail = () => {
        if (!id) {
            toast.error("Please save the document before sending.");
            return;
        }
        setIsSending(true);
    };

    const handleSendSuccess = (updatedDoc) => {
        if (updatedDoc && updatedDoc.sent_at) {
            setSentAt(updatedDoc.sent_at);
        }
    };

    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        if (!id) {
            toast.error("Please save the document before exporting.");
            return;
        }

        setIsExporting(true);
        try {
            const documentHtml = renderToStaticMarkup(
                <InvoiceDocumentPreview data={formData} totals={totals} zoom={1} printing={true} />
            );

            const response = await generateDocumentPdf(
                id,
                documentHtml,
                formData.invoiceNumber ? `Invoice #${formData.invoiceNumber}` : 'Invoice'
            );

            if (response.url) {
                const link = document.createElement('a');
                link.href = response.url;
                link.download = `${(formData.invoiceNumber ? `Invoice_${formData.invoiceNumber}` : 'Invoice').replace(/[^a-z0-9]/gi, '_')}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("Invoice exported successfully");
            }
        } catch (error) {
            console.error("Export failed", error);
            toast.error("Failed to export invoice");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {isPrinting && (
                <PrintPortal>
                    <InvoiceDocumentPreview data={formData} totals={totals} zoom={1} />
                </PrintPortal>
            )}

            {/* ... Modal ... */}
            <SendDocumentModal
                isOpen={isSending}
                onClose={() => setIsSending(false)}
                documentId={id}
                documentName={`Invoice #${formData.invoiceNumber}`}
                isReminder={!!sentAt}
                onSuccess={handleSendSuccess}
                getHtmlContent={async () => {
                    const documentHtml = renderToStaticMarkup(
                        <InvoiceDocumentPreview data={formData} totals={totals} zoom={1} printing={true} />
                    );
                    return wrapHtmlForPdf(documentHtml, `Invoice #${formData.invoiceNumber}`);
                }}
            />

            {/* Header */}
            <header className="no-print h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                        title="Back to Documents"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-bold text-slate-800 text-sm md:text-lg">Service Invoice</h1>
                            {sentAt && (
                                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium border border-emerald-100">
                                    <Check size={10} /> Sent {new Date(sentAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] md:text-xs text-slate-400 font-medium whitespace-nowrap">#{formData.invoiceNumber}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1 mr-4">
                        <button onClick={handleZoomOut} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 transition-all"><ZoomOut size={16} /></button>
                        <span className="text-xs font-semibold text-slate-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
                        <button onClick={handleZoomIn} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 transition-all"><ZoomIn size={16} /></button>
                    </div>

                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 p-2 md:px-4 md:py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all"
                    >
                        <Printer size={18} />
                        <span className="hidden sm:inline">Print</span>
                    </button>

                    <button
                        onClick={handleSendEmail}
                        className={`flex items-center gap-2 px-3 md:px-4 py-2 text-sm font-medium rounded-lg border border-transparent transition-all ${sentAt ? 'text-amber-600 hover:bg-amber-50 hover:border-amber-200' : 'text-slate-600 hover:bg-slate-50 hover:border-slate-200'}`}
                    >
                        {sentAt ? <Bell size={18} /> : <Mail size={18} />}
                        <span className="hidden sm:inline">{sentAt ? 'Remind' : 'Send'}</span>
                    </button>

                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50"
                    >
                        {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                        <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
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
                <div className="no-print w-full lg:w-[400px] h-auto lg:h-full bg-white border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto z-20 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.1)] lg:shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] flex-shrink-0 order-2 lg:order-1 max-h-[40vh] lg:max-h-full">
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

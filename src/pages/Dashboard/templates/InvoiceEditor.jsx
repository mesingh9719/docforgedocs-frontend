import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Download, Printer, ZoomIn, ZoomOut, Save, Mail, Bell, Loader2, Clock, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';
import InvoiceFormSidebar from './InvoiceFormSidebar';
import InvoiceDocumentPreview from './InvoiceDocumentPreview';
import PrintPortal from '../../../components/PrintPortal';
import SendDocumentModal from '../../../components/SendDocumentModal';
import VersionHistorySidebar from './VersionHistorySidebar';
import { createDocument, getDocument, updateDocument, getNextInvoiceNumber } from '../../../api/documents';
import { getBusiness } from '../../../api/business';
import { generateDocumentPdf, wrapHtmlForPdf } from '../../../utils/pdfGenerator';
import { renderToStaticMarkup } from 'react-dom/server';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useDocumentStyles } from '../../../hooks/useDocumentStyles';

const InvoiceEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isDesktop = useMediaQuery('(min-width: 1024px)'); // lg breakpoint
    const [activeTab, setActiveTab] = useState('edit');

    const [zoom, setZoom] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [documentName, setDocumentName] = useState('Untitled Invoice');
    const [showHistory, setShowHistory] = useState(false);
    const [previewVersion, setPreviewVersion] = useState(null);
    const originalState = React.useRef(null);

    // Default form data
    const [formData, setFormData] = useState({
        // Invoice Details
        invoiceTitle: 'INVOICE',
        invoiceNumber: '', // Will be populated
        invoiceDate: new Date().toLocaleDateString(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(), // +15 days default
        placeOfSupply: 'State/Country',

        // Branding
        logoSize: 60,
        logoAlignment: 'left', // left, center, right
        brandingEnabled: true,

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

    // Calculated fields state
    const [totals, setTotals] = useState({
        subtotal: 0,
        taxAmount: 0,
        grandTotal: 0,
        amountInWords: 'Zero Only'
    });

    // Style Integration
    const { styles, updateStyle, resetStyles } = useDocumentStyles();

    // Performance Optimization: Defer the preview data
    const deferredFormData = React.useDeferredValue(formData);
    const deferredTotals = React.useDeferredValue(totals);

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

            let content = doc.data.content || {};
            if (typeof content === 'string') {
                try { content = JSON.parse(content); } catch (e) { console.error(e); }
            }
            if (content.formData) {
                setFormData(prev => ({
                    ...prev,
                    ...content.formData
                }));
            }
            if (content.styles) {
                Object.entries(content.styles).forEach(([k, v]) => updateStyle(k, v));
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
                    formData,
                    styles
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



    const convertUrlToBase64 = async (url) => {
        try {
            // Check if URL is from our backend storage
            if (url && url.includes('/storage/')) {
                // Use the proxy endpoint to bypass CORS
                const proxyUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/file-proxy?path=${encodeURIComponent(url)}`;
                const response = await fetch(proxyUrl);
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            }

            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error("Failed to convert image to base64", error);
            return null;
        }
    };

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
            // Prepare Base64 Logo for PDF
            let logoBase64 = formData.businessLogo;
            if (formData.businessLogo && !formData.businessLogo.startsWith('data:')) {
                const base64 = await convertUrlToBase64(formData.businessLogo);
                if (base64) logoBase64 = base64;
            }

            // Create temporary data with base64 logo
            const printData = {
                ...formData,
                businessLogo: logoBase64
            };

            const documentHtml = renderToStaticMarkup(
                <InvoiceDocumentPreview data={printData} totals={totals} zoom={1} printing={true} styles={styles} />
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


    const [isSending, setIsSending] = useState(false);
    const [sentAt, setSentAt] = useState(null);

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
            // Prepare Base64 Logo for PDF
            let logoBase64 = formData.businessLogo;
            if (formData.businessLogo && !formData.businessLogo.startsWith('data:')) {
                const base64 = await convertUrlToBase64(formData.businessLogo);
                if (base64) logoBase64 = base64;
            }

            // Create temporary data with base64 logo
            const printData = {
                ...formData,
                businessLogo: logoBase64
            };

            const documentHtml = renderToStaticMarkup(
                <InvoiceDocumentPreview data={printData} totals={totals} zoom={1} printing={true} />
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

    const handlePreviewVersion = (version) => {
        if (!originalState.current) {
            originalState.current = { formData };
        }

        let content = version.content;
        if (typeof content === 'string') {
            try { content = JSON.parse(content); } catch (e) { }
        }
        if (content.formData) setFormData(content.formData);

        setPreviewVersion(version);
        setShowHistory(false);
        toast.success(`Previewing Version ${version.version_number}`);
    };

    const handleExitPreview = () => {
        if (originalState.current) {
            setFormData(originalState.current.formData);
            originalState.current = null;
        }
        setPreviewVersion(null);
        toast.success("Exited preview mode");
    };

    const handleDownloadVersion = async (version) => {
        const toastId = toast.loading("Preparing version PDF...");
        try {
            let content = version.content;
            if (typeof content === 'string') {
                try { content = JSON.parse(content); } catch (e) { }
            }

            const docFormData = content.formData || formData;

            // Recalculate totals for the version data since totals are derived state
            const subtotal = (docFormData.items || []).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
            const taxAmount = (subtotal * Number(docFormData.taxRate)) / 100;
            const grandTotal = subtotal + taxAmount;
            const docTotals = {
                subtotal,
                taxAmount,
                grandTotal,
                amountInWords: `${grandTotal.toLocaleString()} Only`
            };

            // Render HTML for this version
            const documentHtml = renderToStaticMarkup(
                <InvoiceDocumentPreview data={docFormData} totals={docTotals} zoom={1} printing={true} />
            );

            const response = await generateDocumentPdf(
                id,
                documentHtml,
                `${documentName} - v${version.version_number}`
            );

            if (response.url) {
                const link = document.createElement('a');
                link.href = response.url;
                link.download = `${documentName.replace(/[^a-z0-9]/gi, '_')}_v${version.version_number}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success(`Version ${version.version_number} downloaded`, { id: toastId });
            }
        } catch (error) {
            console.error("Version download failed", error);
            toast.error("Failed to download version PDF", { id: toastId });
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Preview Banner */}
            {previewVersion && (
                <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-amber-800 text-sm">
                    <div className="flex items-center gap-2">
                        <Eye size={16} />
                        <span className="font-medium">Previewing Version {previewVersion.version_number}</span>
                        <span className="text-amber-600 hidden md:inline">({new Date(previewVersion.created_at).toLocaleString()})</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExitPreview}
                            className="text-amber-700 hover:text-amber-900 font-medium hover:underline flex items-center gap-1"
                        >
                            <X size={14} /> Exit Preview
                        </button>
                    </div>
                </div>
            )}

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
                    // Prepare Base64 Logo for PDF
                    let logoBase64 = formData.businessLogo;
                    if (formData.businessLogo && !formData.businessLogo.startsWith('data:')) {
                        const base64 = await convertUrlToBase64(formData.businessLogo);
                        if (base64) logoBase64 = base64;
                    }

                    // Create temporary data with base64 logo
                    const printData = {
                        ...formData,
                        businessLogo: logoBase64
                    };

                    const documentHtml = renderToStaticMarkup(
                        <InvoiceDocumentPreview data={printData} totals={totals} zoom={1} printing={true} />
                    );
                    return wrapHtmlForPdf(documentHtml, `Invoice #${formData.invoiceNumber}`);
                }}
            />

            {/* Header */}
            <header className="no-print h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm transition-all duration-300">
                <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors flex-shrink-0"
                        title="Back to Documents"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="font-bold text-slate-800 text-sm md:text-lg truncate">Service Invoice</h1>
                            {sentAt && (
                                <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium border border-emerald-100">
                                    <Check size={10} /> Sent
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] md:text-xs text-slate-400 font-medium whitespace-nowrap hidden sm:block">#{formData.invoiceNumber}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <div className="hidden lg:flex items-center bg-slate-100 rounded-lg p-1 mr-4">
                        <button onClick={handleZoomOut} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 transition-all"><ZoomOut size={16} /></button>
                        <span className="text-xs font-semibold text-slate-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
                        <button onClick={handleZoomIn} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 transition-all"><ZoomIn size={16} /></button>
                    </div>

                    <button
                        onClick={() => setShowHistory(true)}
                        className="flex items-center gap-2 p-2 md:px-4 md:py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all"
                    >
                        <Clock size={18} />
                        <span className="hidden lg:inline">History</span>
                    </button>

                    <button
                        onClick={handlePrint}
                        className="hidden md:flex items-center gap-2 p-2 md:px-4 md:py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all"
                    >
                        <Printer size={18} />
                        <span className="hidden lg:inline">Print</span>
                    </button>

                    <button
                        onClick={handleSendEmail}
                        className={`flex items-center gap-2 px-2 md:px-4 py-2 text-sm font-medium rounded-lg border border-transparent transition-all ${sentAt ? 'text-amber-600 hover:bg-amber-50 hover:border-amber-200' : 'text-slate-600 hover:bg-slate-50 hover:border-slate-200'}`}
                    >
                        {sentAt ? <Bell size={18} /> : <Mail size={18} />}
                        <span className="hidden lg:inline">{sentAt ? 'Remind' : 'Send'}</span>
                    </button>

                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-2 md:px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50"
                    >
                        {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                        <span className="hidden lg:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
                    </button>

                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-3 md:px-5 py-2 rounded-lg text-white font-medium shadow-md transition-all ${isSaving ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {isSaving ? <Check size={18} /> : <Save size={18} />}
                        <span className="hidden md:inline">{isSaving ? 'Saved!' : 'Save'}</span>
                    </button>
                </div>
            </header>

            {/* Mobile Tabs */}
            {!isDesktop && (
                <div className="flex bg-white border-b border-slate-200 px-4">
                    <button
                        onClick={() => setActiveTab('edit')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'edit' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'preview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Preview
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">

                {/* Left Panel: Editor Sidebar */}
                <div className={`
                    no-print w-full lg:w-[400px] h-full bg-white border-b lg:border-b-0 lg:border-r border-slate-200 
                    overflow-y-auto z-20 shadow-sm flex-shrink-0 lg:order-1
                    ${isDesktop ? 'block' : (activeTab === 'edit' ? 'block' : 'hidden')}
                `}>
                    <InvoiceFormSidebar
                        formData={formData}
                        onChange={handleChange}
                        updateItem={updateItem}
                        addItem={addItem}
                        removeItem={removeItem}
                        totals={totals}
                        // Style Props
                        styles={styles}
                        onStyleUpdate={updateStyle}
                        onStyleReset={resetStyles}
                    />
                </div>

                {/* Right Panel: Live Preview */}
                <div className={`
                    flex-1 h-full overflow-y-auto bg-slate-50/50 p-4 md:p-8 sm:p-12 
                    flex justify-center items-start scrollbar-thin scrollbar-thumb-slate-300 lg:order-2
                    ${isDesktop ? 'flex' : (activeTab === 'preview' ? 'flex' : 'hidden')}
                `}
                    style={{
                        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                >
                    <InvoiceDocumentPreview
                        data={deferredFormData}
                        totals={deferredTotals}
                        zoom={zoom}
                        styles={styles}
                    />
                </div>
            </div>
            <VersionHistorySidebar
                documentId={id}
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                onPreview={handlePreviewVersion}
                onDownload={handleDownloadVersion}
                onRestore={(docData) => {
                    if (docData && docData.content) {
                        let content = docData.content;
                        if (typeof content === 'string') {
                            try { content = JSON.parse(content); } catch (e) { }
                        }
                        if (content.formData) setFormData(content.formData);
                    }
                    setPreviewVersion(null);
                    originalState.current = null;
                }}
            />
        </div>
    );
};

export default InvoiceEditor;

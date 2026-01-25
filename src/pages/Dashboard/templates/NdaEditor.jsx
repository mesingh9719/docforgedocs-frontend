import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Download, Printer, ZoomIn, ZoomOut, Save, Mail, Layers, Bell, Loader2, Clock, Eye, X } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import toast from 'react-hot-toast';
import NdaFormSidebar from './NdaFormSidebar';
import NdaDocumentPreview from './NdaDocumentPreview';
import { createDocument, getDocument, updateDocument } from '../../../api/documents';
import { generateDocumentPdf } from '../../../utils/pdfGenerator';
import { getBusiness } from '../../../api/business';
import SendDocumentModal from '../../../components/SendDocumentModal';
import VersionHistorySidebar from './VersionHistorySidebar';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultContent = {
    title: "Non-Disclosure Agreement",
    preamble: "This Non-Disclosure Agreement (“Agreement”) is made and entered into on this {{effectiveDateDay}} day of {{effectiveDateMonth}}, 20{{effectiveDateYear}} (“Effective Date”),",
    partiesDisclosing: "{{disclosingPartyName}}, a company/individual having its registered office/address at {{disclosingPartyAddress}} (hereinafter referred to as the \"Disclosing Party\"),",
    partiesReceiving: "{{receivingPartyName}}, a company/individual having its registered office/address at {{receivingPartyAddress}} (hereinafter referred to as the \"Receiving Party\").",
    partiesFooter: "The Disclosing Party and the Receiving Party may hereinafter be collectively referred to as the \"Parties\" and individually as a \"Party\".",

    // Dynamic Sections Array
    sections: [
        {
            id: '1',
            title: 'Purpose',
            content: "The Disclosing Party intends to disclose certain confidential and proprietary information to the Receiving Party for the purpose of {{purpose}} (“Purpose”)."
        },
        {
            id: '2',
            title: 'Definition of Confidential Information',
            content: "For the purposes of this Agreement, \"Confidential Information\" shall mean any information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, electronically, visually, or in any other form, including but not limited to business plans, strategies, financial information, and technical data."
        },
        {
            id: '3',
            title: 'Exclusions from Confidential Information',
            content: "Confidential Information shall not include information that is publicly available, lawfully known to the Receiving Party prior to disclosure, or independently developed by the Receiving Party."
        },
        {
            id: '4',
            title: 'Obligations of the Receiving Party',
            content: "The Receiving Party agrees to keep all Confidential Information strictly confidential, use it solely for the Purpose, and not disclose it to any third party without prior written consent."
        },
        {
            id: '5',
            title: 'Disclosure',
            content: "The Receiving Party may disclose Confidential Information only to its employees, agents, or representatives who have a legitimate need to know for the Purpose and are bound by confidentiality obligations."
        },
        {
            id: '6',
            title: 'No License',
            content: "Nothing in this Agreement shall be construed as granting any rights, licenses, or ownership in the Confidential Information, except for the limited right to use it for the Purpose."
        },
        {
            id: '7',
            title: 'Term and Survival',
            content: "This Agreement shall commence on the Effective Date and remain in effect for a period of {{termYears}} years. The confidentiality obligations shall survive the termination for a period of {{survivalYears}} years thereafter."
        },
        {
            id: '8',
            title: 'Return of Information',
            content: "Upon termination of this Agreement or upon written request by the Disclosing Party, the Receiving Party shall promptly return or destroy all Confidential Information."
        },
        {
            id: '9',
            title: 'Remedies',
            content: "The Receiving Party acknowledges that unauthorized disclosure or misuse of Confidential Information may cause irreparable harm. The Disclosing Party shall be entitled to seek injunctive relief."
        },
        {
            id: '10',
            title: 'Governing Law',
            content: "This Agreement shall be governed by and construed in accordance with the laws of {{jurisdiction}}, and the courts of {{courtCity}} shall have exclusive jurisdiction."
        },
        {
            id: '11',
            title: 'Miscellaneous',
            content: "This Agreement constitutes the entire understanding between the Parties. Any amendment must be in writing. Failure to enforce any provision shall not constitute a waiver."
        }
    ]
};

const NdaEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isDesktop = useMediaQuery('(min-width: 1024px)'); // lg breakpoint
    const [activeTab, setActiveTab] = useState('edit');

    const [zoom, setZoom] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [documentName, setDocumentName] = useState('Untitled NDA');
    const [showHistory, setShowHistory] = useState(false);
    const [previewVersion, setPreviewVersion] = useState(null);
    const originalState = React.useRef(null);

    // State for the Document Variables (Inputs)
    const [formData, setFormData] = useState({
        effectiveDateDay: '',
        effectiveDateMonth: '',
        effectiveDateYear: '',
        disclosingPartyName: '',
        disclosingPartyAddress: '',
        receivingPartyName: '',
        receivingPartyAddress: '',
        purpose: '',
        termYears: '',
        survivalYears: '',
        jurisdiction: '',
        courtCity: '',
        disclosingSignatoryName: '',
        disclosingSignatoryDesignation: '',
        receivingSignatoryName: '',
        receivingSignatoryDesignation: ''
    });

    // State for the Document Structure (Template Text)
    const [docContent, setDocContent] = useState(defaultContent);

    // Performance Optimization: Defer the preview data
    const deferredFormData = React.useDeferredValue(formData);
    const deferredDocContent = React.useDeferredValue(docContent);

    // Load Document if ID exists
    useEffect(() => {
        if (id) {
            loadDocument(id);
        }
    }, [id]);

    const loadDocument = async (docId) => {
        try {
            const doc = await getDocument(docId);
            if (doc.data.name) setDocumentName(doc.data.name);

            if (doc.data.sent_at) {
                setSentAt(doc.data.sent_at);
            }

            let content = doc.data?.content || doc.content;

            if (typeof content === 'string') {
                try {
                    content = JSON.parse(content);
                } catch (e) {
                    console.error("Error parsing content", e);
                }
            }

            content = content || {};

            if (content.formData) {
                setFormData(prev => ({ ...prev, ...content.formData }));
            }
            if (content.docContent) setDocContent(content.docContent);
        } catch (error) {
            console.error("Failed to load document", error);
        }
    };

    // Load Business Details for Defaults
    useEffect(() => {
        if (!id) {
            const fetchBusinessDetails = async () => {
                try {
                    const business = await getBusiness();
                    if (business) {
                        setFormData(prev => ({
                            ...prev,
                            disclosingPartyName: business.name || '',
                            disclosingPartyAddress: [business.address, business.city, business.state, business.country].filter(Boolean).join(', '),
                            businessLogo: business.logo || null
                        }));
                    }
                } catch (error) {
                    console.error("Failed to load business details", error);
                }
            };
            fetchBusinessDetails();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContentChange = (e) => {
        const { name, value } = e.target;
        setDocContent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addSection = () => {
        const newSection = {
            id: generateId(),
            title: "New Section",
            content: "Enter the details of this new clause here..."
        };
        setDocContent(prev => ({
            ...prev,
            sections: [...prev.sections, newSection]
        }));
    };

    const removeSection = (id) => {
        setDocContent(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s.id !== id)
        }));
    };

    const updateSection = (id, field, value) => {
        setDocContent(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === id ? { ...s, [field]: value } : s
            )
        }));
    };

    const reorderSections = (newSections) => {
        setDocContent(prev => ({
            ...prev,
            sections: newSections
        }));
    };

    // ---------------------------------------

    const handleBack = () => navigate('/documents');
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                name: documentName,
                type_slug: 'nda',
                content: {
                    formData,
                    docContent
                },
                status: 'draft'
            };

            if (id) {
                await updateDocument(id, payload);
                toast.success("Document updated successfully");
            } else {
                const newDoc = await createDocument(payload);
                toast.success("Document created successfully");
                navigate(`/documents/nda/${newDoc.data.id}`, { replace: true });
            }
        } catch (error) {
            console.error("Failed to save", error);
            toast.error("Failed to save document");
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    };

    const lastGeneratedData = React.useRef(null);
    const [cachedPdfUrl, setCachedPdfUrl] = useState(null);

    const handlePrint = async () => {
        if (!id) {
            toast.error("Please save the document before printing.");
            return;
        }

        const currentDataString = JSON.stringify({ formData, docContent });
        if (cachedPdfUrl && lastGeneratedData.current === currentDataString) {
            window.open(cachedPdfUrl, '_blank');
            return;
        }

        setIsGeneratingPdf(true);
        try {
            const documentHtml = renderToStaticMarkup(
                <NdaDocumentPreview data={formData} content={docContent} zoom={1} printing={true} />
            );

            const fullHtml = `
    <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                    <title>${documentName}</title>
                    <style>
                        * {box-sizing: border-box; }
                        body {font-family: 'Times New Roman', serif; line-height: 1.5; color: #333; font-size: 12pt; margin: 0; padding: 40px; }
                        .text-center {text-align: center; }
                        .uppercase {text-transform: uppercase; }
                        .font-bold {font-weight: bold; }
                        .text-sm {font-size: 10pt; }
                        .text-xs {font-size: 9pt; }
                        .text-justify {text-align: justify; }
                        .mb-2 {margin-bottom: 0.5rem; }
                        .mb-4 {margin-bottom: 1rem; }
                        .mb-6 {margin-bottom: 1.5rem; }
                        .mb-8 {margin-bottom: 2rem; }
                        .mb-10 {margin-bottom: 2.5rem; }
                        .pb-2 {padding-bottom: 0.5rem; }
                        .mt-12 {margin-top: 3rem; }
                        .border-b {border-bottom: 1px solid #000; }
                        .border-b-2 {border-bottom: 2px solid #000; }
                        @page {margin: 40px; }
                        body {margin: 0; padding: 0; }
                        h1 {font-size: 16pt; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px; text-align: center; font-weight: bold; letter-spacing: 2px; }
                        p {margin-bottom: 12px; }
                    </style>
            </head>
            <body>
                ${documentHtml}
            </body>
        </html>
`;

            const response = await generateDocumentPdf(id, fullHtml, documentName);

            if (response.url) {
                setCachedPdfUrl(response.url);
                lastGeneratedData.current = currentDataString;
                window.open(response.url, '_blank');
            }
        } catch (error) {
            console.error("PDF Generation failed", error);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsGeneratingPdf(false);
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
            const documentHtml = renderToStaticMarkup(
                <NdaDocumentPreview data={formData} content={docContent} zoom={1} printing={true} />
            );

            const response = await generateDocumentPdf(
                id,
                documentHtml,
                documentName
            );

            if (response.url) {
                const link = document.createElement('a');
                link.href = response.url;
                link.download = `${documentName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("Document exported successfully");
            }
        } catch (error) {
            console.error("Export failed", error);
            toast.error("Failed to export document");
        } finally {
            setIsExporting(false);
        }
    };

    const handlePreviewVersion = (version) => {
        if (!originalState.current) {
            originalState.current = { formData, docContent };
        }

        let content = version.content;
        if (typeof content === 'string') {
            try { content = JSON.parse(content); } catch (e) { }
        }
        if (content.formData) setFormData(content.formData);
        if (content.docContent) setDocContent(content.docContent);

        setPreviewVersion(version);
        setShowHistory(false);
        toast.success(`Previewing Version ${version.version_number}`);
    };

    const handleExitPreview = () => {
        if (originalState.current) {
            setFormData(originalState.current.formData);
            setDocContent(originalState.current.docContent);
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

            const documentHtml = renderToStaticMarkup(
                <NdaDocumentPreview data={content.formData || formData} content={content.docContent || docContent} zoom={1} printing={true} />
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
        <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
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

            {/* Print Portal */}
            {/* Note: NdaDocumentPreview does not use a portal for printing here, logic is in handlePrint raw html generation, 
                BUT create Portal logic if needed or just rely on the pure HTML gen logic which is already robust here.
                Wait, the original code had PrintPortal logic commented out? No, I see it usage? 
                Actually the original code didn't use PrintPortal in the return?
                Ah, lines 443 in original code:
                {isPrinting && ( <PrintPortal>... // wait, that was InvoiceEditor?
                Let's check NdaEditor original.
                Lines 492: {isPrinting && ( ... PrintPortal ... ?? No, I don't see PrintPortal used in the NdaEditor original return JSX block I read?
                Let me checking... Ah, I see `handlePrint` doing manual HTML string generation.
                BUT wait, line 7 in imports: `import PrintPortal ...`
                Let's double check the NdaEditor file retrieval...
                Line 443 in NdaEditor? No.
                Line 281 in NdaEditor handles print manually.
                I will stick to the manual generation approach as it seems preferred for NdaEditor to ensure exact CSS control for dompdf.
            */}

            <SendDocumentModal
                isOpen={isSending}
                onClose={() => setIsSending(false)}
                documentId={id}
                documentName={documentName}
                isReminder={!!sentAt}
                onSuccess={handleSendSuccess}
                getHtmlContent={async () => {
                    const documentHtml = renderToStaticMarkup(
                        <NdaDocumentPreview data={formData} content={docContent} zoom={1} printing={true} />
                    );
                    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${documentName}</title><style>*{box-sizing:border-box;}body{font-family:'Times New Roman',serif;line-height:1.5;color:#333;font-size:12pt;margin:0;padding:40px;}.text-center{text-align:center;}.uppercase{text-transform:uppercase;}.font-bold{font-weight:bold;}.text-sm{font-size:10pt;}.text-xs{font-size:9pt;}.text-justify{text-align:justify;}.mb-2{margin-bottom:0.5rem;}.mb-4{margin-bottom:1rem;}.mb-6{margin-bottom:1.5rem;}.mb-8{margin-bottom:2rem;}.mb-10{margin-bottom:2.5rem;}.pb-2{padding-bottom:0.5rem;}.mt-12{margin-top:3rem;}.border-b{border-bottom:1px solid #000;}.border-b-2{border-bottom:2px solid #000;}@page{margin:40px;}body{margin:0;padding:0;}h1{font-size:16pt;text-transform:uppercase;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:30px;text-align:center;font-weight:bold;letter-spacing:2px;}p{margin-bottom:12px;}</style></head><body>${documentHtml}</body></html>`;
                }}
            />

            {/* Toolbar */}
            <header className="no-print h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between flex-shrink-0 z-30 shadow-sm">
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
                            <input
                                type="text"
                                value={documentName}
                                onChange={(e) => setDocumentName(e.target.value)}
                                className="font-bold text-slate-800 text-sm md:text-lg bg-transparent border-none focus:ring-0 p-0 m-0 w-auto min-w-[120px] max-w-[200px] placeholder-slate-400 truncate"
                                placeholder="Enter Document Name"
                            />
                            {sentAt && (
                                <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium border border-emerald-100">
                                    <Check size={10} /> Sent
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] md:text-xs text-slate-400 font-medium whitespace-nowrap hidden sm:block">Last saved: Just now</p>
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
                        title="Version History"
                    >
                        <Clock size={18} />
                        <span className="hidden lg:inline">History</span>
                    </button>

                    <button
                        onClick={handlePrint}
                        disabled={isGeneratingPdf}
                        className="hidden md:flex items-center gap-2 p-2 md:px-4 md:py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50"
                    >
                        {isGeneratingPdf ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />}
                        <span className="hidden lg:inline">{isGeneratingPdf ? 'Generating...' : 'Print'}</span>
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

            {/* MainContent */}
            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">

                {/* Left Panel: Editor Sidebar */}
                <div className={`
                    no-print w-full lg:w-[400px] h-full bg-white border-b lg:border-b-0 lg:border-r border-slate-200 
                    overflow-y-auto z-20 shadow-sm flex-shrink-0 lg:order-1
                    ${isDesktop ? 'block' : (activeTab === 'edit' ? 'block' : 'hidden')}
                `}>
                    <NdaFormSidebar
                        formData={formData}
                        onChange={handleChange}
                        docContent={docContent}
                        onContentChange={handleContentChange}
                        // Section Handlers
                        addSection={addSection}
                        removeSection={removeSection}
                        updateSection={updateSection}
                        reorderSections={reorderSections}
                    />
                </div>

                {/* Right Panel: Live Preview */}
                <div className={`
                    flex-1 h-full overflow-y-auto bg-slate-100/50 p-4 md:p-8 sm:p-12 
                    flex justify-center items-start scrollbar-thin scrollbar-thumb-slate-300 lg:order-2
                    ${isDesktop ? 'flex' : (activeTab === 'preview' ? 'flex' : 'hidden')}
                `}>
                    <NdaDocumentPreview
                        data={deferredFormData}
                        content={deferredDocContent}
                        zoom={zoom}
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
                        if (content.docContent) setDocContent(content.docContent);
                    }
                    setPreviewVersion(null);
                    originalState.current = null;
                }}
            />
        </div>
    );
};

export default NdaEditor;

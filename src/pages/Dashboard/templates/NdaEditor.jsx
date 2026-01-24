import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Download, Printer, ZoomIn, ZoomOut, Save, Mail, Layers, Bell, Loader2 } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import toast from 'react-hot-toast';
import NdaFormSidebar from './NdaFormSidebar';
import NdaDocumentPreview from './NdaDocumentPreview';
import { createDocument, getDocument, updateDocument } from '../../../api/documents';
import { generateDocumentPdf, wrapHtmlForPdf } from '../../../utils/pdfGenerator';
import { getBusiness } from '../../../api/business';
import SendDocumentModal from '../../../components/SendDocumentModal';

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
    const { id } = useParams(); // Get ID from URL
    const [zoom, setZoom] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [documentName, setDocumentName] = useState('Untitled NDA');

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
                // Redirect to edit mode to prevent duplicate creations
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
            // Render the document to HTML string
            const documentHtml = renderToStaticMarkup(
                <NdaDocumentPreview data={formData} content={docContent} zoom={1} printing={true} />
            );

            // Wrap in basic HTML for DomPDF
            const fullHtml = `
    <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                    <title>${documentName}</title>
                    <style>
                        /* Reset and Basic Typography */
                        * {box-sizing: border-box; }
                        body {font-family: 'Times New Roman', serif; line-height: 1.5; color: #333; font-size: 12pt; margin: 0; padding: 40px; }

                        /* Utilities Mapped for DomPDF */
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

                        /* Layout - Signatures */
                        /* We actully switched to tables for printing in the component, so we don't need complex float grids here anymore. */
                        /* The component directly injects style attributes which DomPDF supports very well. */

                        /* Ensure full page use */
                        @page {margin: 40px; }
                        body {margin: 0; padding: 0; }


                        h1 {font-size: 16pt; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px; text-align: center; font-weight: bold; letter-spacing: 2px; }
                        p {margin-bottom: 12px; }

                    /* Footer handling */
                    /* We use position: fixed in the component style for paging, but let's ensure it doesn't overlap text */
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
                // Trigger download
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

    return (
        <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
            {/* ... Modal ... */}
            {/* ... Modal ... */}
            <SendDocumentModal
                isOpen={isSending}
                onClose={() => setIsSending(false)}
                documentId={id}
                documentName={documentName}
                isReminder={!!sentAt}
                onSuccess={handleSendSuccess}
                getHtmlContent={async () => {
                    // We can rely on renderToStaticMarkup, similar to print logic but returning string
                    const documentHtml = renderToStaticMarkup(
                        <NdaDocumentPreview data={formData} content={docContent} zoom={1} printing={true} />
                    );
                    // Add wrapper
                    return `
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
                            <body>${documentHtml}</body>
                        </html>
                    `;
                }}
            />

            {/* Toolbar */}
            <header className="no-print h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between flex-shrink-0 z-30 shadow-sm">
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
                            <input
                                type="text"
                                value={documentName}
                                onChange={(e) => setDocumentName(e.target.value)}
                                className="font-bold text-slate-800 text-sm md:text-lg bg-transparent border-none focus:ring-0 p-0 m-0 w-auto min-w-[200px] placeholder-slate-400"
                                placeholder="Enter Document Name"
                            />
                            {sentAt && (
                                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium border border-emerald-100">
                                    <Check size={10} /> Sent {new Date(sentAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] md:text-xs text-slate-400 font-medium whitespace-nowrap">Last saved: Just now</p>
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
                        disabled={isGeneratingPdf}
                        className="flex items-center gap-2 p-2 md:px-4 md:py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50"
                    >
                        {isGeneratingPdf ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />}
                        <span className="hidden sm:inline">{isGeneratingPdf ? 'Generating...' : 'Print'}</span>
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

            {/* MainContent */}
            < div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative" >
                {/* Left Panel: Editor Sidebar */}
                < div className="no-print w-full lg:w-[400px] h-auto lg:h-full bg-white border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto z-20 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.1)] lg:shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] flex-shrink-0 order-2 lg:order-1 max-h-[40vh] lg:max-h-full" >
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
                </div >

                {/* Right Panel: Live Preview */}
                < div className="flex-1 h-full overflow-y-auto bg-slate-100/50 p-4 md:p-8 sm:p-12 flex justify-center items-start scrollbar-thin scrollbar-thumb-slate-300 order-1 lg:order-2" >
                    <NdaDocumentPreview data={formData} content={docContent} zoom={zoom} />
                </div >
            </div >
        </div >
    );
};

export default NdaEditor;

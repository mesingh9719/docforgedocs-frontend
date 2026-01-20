import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Download, Printer, ZoomIn, ZoomOut, Save, Mail, Bell } from 'lucide-react';
import ProposalFormSidebar from './ProposalFormSidebar';
import ProposalDocumentPreview from './ProposalDocumentPreview';
import PrintPortal from '../../../components/PrintPortal';
import SendDocumentModal from '../../../components/SendDocumentModal';
import { createDocument, getDocument, updateDocument } from '../../../api/documents';
import { getBusiness } from '../../../api/business';
import { generateDocumentPdf, wrapHtmlForPdf } from '../../../utils/pdfGenerator';
import { renderToStaticMarkup } from 'react-dom/server';
import { useParams } from 'react-router-dom';

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultContent = {
    title: "Business / Project Proposal",

    // Dynamic Sections Array
    sections: [
        {
            id: '1',
            title: 'Introduction',
            content: "This proposal is submitted by {{providerCompany}} to {{clientName}} to outline the scope, deliverables, timelines, and commercial terms for {{projectDescription}}. This document is intended to present a clear understanding of the proposed engagement and to serve as a basis for mutual agreement."
        },
        {
            id: '2',
            title: 'Client Objectives',
            content: "The objective of this proposal is to assist {{clientCompany}} in achieving the following goals:\n\n1. [Objective 1]\n2. [Objective 2]\n3. [Objective 3]"
        },
        {
            id: '3',
            title: 'Scope of Work',
            content: "The scope of work under this proposal shall include, but is not limited to, the following services:\n\n**4.1 Services Included**\n[Service 1]\n[Service 2]\n\n**4.2 Services Excluded**\nAny services not explicitly mentioned above shall be considered outside the scope and may be provided under a separate agreement or change request."
        },
        {
            id: '4',
            title: 'Deliverables',
            content: "The following deliverables shall be provided as part of this engagement:\n\n1. [Deliverable 1]\n2. [Deliverable 2]\n\nAll deliverables shall be submitted in the agreed format and within the defined timeline."
        },
        // Timeline is special, handled via separate data prop but placed here conceptually
        {
            id: '5',
            title: 'Project Timeline',
            content: "The estimated timeline for completion of the project is as follows (see table below). Timelines are indicative and subject to client approvals and dependencies."
        },
        {
            id: '6',
            title: 'Commercials & Pricing',
            content: "The total professional fees for the services described in this proposal shall be: {{totalProjectCost}}.\n\n**Payment Terms**\n- [Percentage] payable upon acceptance\n- [Percentage] payable upon milestone completion\n- [Percentage] payable upon final delivery\n\nAll payments shall be made within {{paymentDays}} days from the date of invoice."
        },
        {
            id: '7',
            title: 'Client Responsibilities',
            content: "The Client agrees to:\n- Provide accurate and timely information\n- Share necessary access, approvals, and feedback\n- Assign a single point of contact for communication\n\nDelays caused due to client dependencies may impact project timelines."
        },
        {
            id: '8',
            title: 'Confidentiality',
            content: "Both parties agree to maintain strict confidentiality of all proprietary, technical, commercial, and business information exchanged during the course of this engagement. Confidential information shall not be disclosed to any third party without prior written consent."
        },
        {
            id: '9',
            title: 'Intellectual Property Rights',
            content: "Unless otherwise agreed in writing:\n- All intellectual property developed during the project shall remain the property of {{providerCompany}} until full payment is received.\n- Upon full payment, ownership or license rights shall be transferred as mutually agreed."
        },
        {
            id: '10',
            title: 'Limitation of Liability',
            content: "In no event shall either party be liable for indirect, incidental, or consequential damages. The total liability of {{providerCompany}} shall not exceed the total fees paid under this proposal."
        },
        {
            id: '11',
            title: 'Term & Termination',
            content: "This proposal shall remain valid for {{validityDays}} days from the proposal date. Either party may terminate the engagement by providing {{noticeDays}} days written notice. Fees for work completed up to the termination date shall be payable."
        },
        {
            id: '12',
            title: 'Governing Law',
            content: "This proposal shall be governed by and construed in accordance with the laws of {{jurisdiction}}, and courts of {{courtCity}} shall have exclusive jurisdiction."
        }
    ]
};

const ProposalEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [zoom, setZoom] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [documentName, setDocumentName] = useState('Untitled Proposal');

    // State for the Document Variables (Inputs)
    const [formData, setFormData] = useState({
        proposalTitle: 'Website Redesign Project', // Default
        proposalDate: new Date().toLocaleDateString(),
        referenceNo: '',

        // Client Details
        clientName: '',
        clientCompany: '',
        clientAddress: '',

        // Provider Details
        providerName: '',
        providerCompany: '',
        providerAddress: '',

        // Variables used in sections
        projectDescription: '',
        totalProjectCost: '',
        paymentDays: '15',
        validityDays: '30',
        noticeDays: '30',
        jurisdiction: '',
        courtCity: '',

        // Timeline Table Data
        timeline: [
            { phase: 'Phase 1', description: 'Requirement Analysis', duration: '5 days' },
            { phase: 'Phase 2', description: 'Execution / Development', duration: '15 days' },
            { phase: 'Phase 3', description: 'Review & Final Delivery', duration: '5 days' },
        ]
    });

    // State for the Document Structure (Template Text)
    const [docContent, setDocContent] = useState(defaultContent);

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
            const content = doc.data.content || {};
            if (content.formData) {
                setFormData(prev => ({ ...prev, ...content.formData }));
            }
            if (content.docContent) setDocContent(content.docContent);
        } catch (error) {
            console.error("Failed to load", error);
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
                            providerName: business.name || '',
                            providerCompany: business.name || '',
                            providerAddress: [business.address, business.city, business.state, business.country].filter(Boolean).join(', '),
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

    // Special handler for timeline array
    const updateTimeline = (index, field, value) => {
        const newTimeline = [...formData.timeline];
        newTimeline[index][field] = value;
        setFormData(prev => ({ ...prev, timeline: newTimeline }));
    };

    const addTimelineRow = () => {
        setFormData(prev => ({
            ...prev,
            timeline: [...prev.timeline, { phase: 'New Phase', description: '', duration: '' }]
        }));
    };

    const removeTimelineRow = (index) => {
        if (formData.timeline.length <= 1) return;
        setFormData(prev => ({
            ...prev,
            timeline: prev.timeline.filter((_, i) => i !== index)
        }));
    };

    // ----- Section Management Handlers -----

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
                type_slug: 'proposal',
                content: {
                    formData,
                    docContent
                },
                status: 'draft'
            };

            if (id) {
                await updateDocument(id, payload);
            } else {
                const newDoc = await createDocument(payload);
                navigate(`/documents/proposal/${newDoc.data.id}`, { replace: true });
            }
        } catch (error) {
            console.error("Failed to save", error);
            alert("Failed to save.");
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    };

    const [isPrinting, setIsPrinting] = useState(false);
    const lastGeneratedData = React.useRef(null);
    const [cachedPdfUrl, setCachedPdfUrl] = useState(null);

    const handlePrint = async () => {
        if (!id) {
            alert("Please save the document before printing.");
            return;
        }

        const currentDataString = JSON.stringify({ formData, docContent });
        if (cachedPdfUrl && lastGeneratedData.current === currentDataString) {
            window.open(cachedPdfUrl, '_blank');
            return;
        }

        setIsPrinting(true);
        try {
            const documentHtml = renderToStaticMarkup(
                <ProposalDocumentPreview data={formData} content={docContent} zoom={1} printing={true} />
            );

            const response = await generateDocumentPdf(
                id,
                documentHtml,
                documentName
            );

            if (response.url) {
                setCachedPdfUrl(response.url);
                lastGeneratedData.current = currentDataString;
                window.open(response.url, '_blank');
            }
        } catch (error) {
            console.error("PDF Generation failed", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsPrinting(false);
        }
    };

    const [isSending, setIsSending] = useState(false);
    const [sentAt, setSentAt] = useState(null);



    const handleSendEmail = () => {
        if (!id) {
            alert("Please save the document before sending.");
            return;
        }
        setIsSending(true);
    };

    const handleSendSuccess = (updatedDoc) => {
        if (updatedDoc && updatedDoc.sent_at) {
            setSentAt(updatedDoc.sent_at);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
            {isPrinting && (
                <PrintPortal>
                    <ProposalDocumentPreview data={formData} content={docContent} zoom={1} />
                </PrintPortal>
            )}



            {/* ... Modal ... */}
            <SendDocumentModal
                isOpen={isSending}
                onClose={() => setIsSending(false)}
                documentId={id}
                documentName={documentName}
                isReminder={!!sentAt}
                onSuccess={handleSendSuccess}
                getHtmlContent={async () => {
                    const documentHtml = renderToStaticMarkup(
                        <ProposalDocumentPreview data={formData} content={docContent} zoom={1} printing={true} />
                    );
                    return wrapHtmlForPdf(documentHtml, documentName);
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
                <div className="no-print w-full lg:w-[400px] h-auto lg:h-full bg-white border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto z-20 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.1)] lg:shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] flex-shrink-0 order-2 lg:order-1 max-h-[40vh] lg:max-h-full">
                    <ProposalFormSidebar
                        formData={formData}
                        onChange={handleChange}
                        docContent={docContent}
                        onContentChange={handleContentChange}
                        // Section Handlers
                        addSection={addSection}
                        removeSection={removeSection}
                        updateSection={updateSection}
                        reorderSections={reorderSections}
                        // Timeline Handlers
                        updateTimeline={updateTimeline}
                        addTimelineRow={addTimelineRow}
                        removeTimelineRow={removeTimelineRow}
                    />
                </div>

                {/* Right Panel: Live Preview */}
                <div className="flex-1 h-full overflow-y-auto bg-slate-100/50 p-4 md:p-8 sm:p-12 flex justify-center items-start scrollbar-thin scrollbar-thumb-slate-300 order-1 lg:order-2">
                    <ProposalDocumentPreview data={formData} content={docContent} zoom={zoom} />
                </div>
            </div>
        </div>
    );
};

export default ProposalEditor;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Download, Printer, ZoomIn, ZoomOut, Save } from 'lucide-react';
import NdaFormSidebar from './NdaFormSidebar';
import NdaDocumentPreview from './NdaDocumentPreview';


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

import { useParams } from 'react-router-dom';

import { createDocument, getDocument, updateDocument } from '../../../api/documents';
import { getBusiness } from '../../../api/business';

// ... (defaultContent remains same)

const NdaEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID from URL
    const [zoom, setZoom] = useState(1);
    const [isSaving, setIsSaving] = useState(false);

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
            let content = doc.data?.content || doc.content;

            if (typeof content === 'string') {
                try {
                    content = JSON.parse(content);
                } catch (e) {
                    console.error("Error parsing content", e);
                }
            }

            content = content || {};

            if (content.formData) setFormData(content.formData);
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

    // ... (Section Management Handlers remain same)

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
                name: docContent.title || 'Untitled NDA',
                type_slug: 'nda',
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
                // Redirect to edit mode to prevent duplicate creations
                navigate(`/documents/nda/${newDoc.data.id}`, { replace: true });
            }
        } catch (error) {
            console.error("Failed to save", error);
            alert("Failed to save document.");
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
            {/* Toolbar */}
            <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 z-30 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                        title="Back to Documents"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <input
                            type="text"
                            value={docContent.title}
                            onChange={(e) => setDocContent({ ...docContent, title: e.target.value })}
                            className="font-bold text-slate-800 text-lg bg-transparent border-none p-0 focus:ring-0 w-64 hover:bg-slate-50 px-2 -ml-2 rounded cursor-text transition-colors"
                        />
                        <p className="text-xs text-slate-400 font-medium px-2 -ml-2">Last saved: Just now</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 rounded-lg p-1 mr-4">
                        <button onClick={handleZoomOut} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 transition-all"><ZoomOut size={16} /></button>
                        <span className="text-xs font-semibold text-slate-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
                        <button onClick={handleZoomIn} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 transition-all"><ZoomIn size={16} /></button>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all">
                        <Printer size={18} />
                        <span className="hidden sm:inline">Print</span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all">
                        <Download size={18} />
                        <span className="hidden sm:inline">Export</span>
                    </button>

                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium shadow-md transition-all ${isSaving ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {isSaving ? <Check size={18} /> : <Save size={18} />}
                        <span>{isSaving ? 'Saved!' : 'Save'}</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Left Panel: Editor Sidebar */}
                <div className="w-[400px] h-full bg-white border-r border-slate-200 overflow-y-auto z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
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
                <div className="flex-1 h-full overflow-y-auto bg-slate-100/50 p-8 sm:p-12 flex justify-center items-start scrollbar-thin scrollbar-thumb-slate-300">
                    <NdaDocumentPreview data={formData} content={docContent} zoom={zoom} />
                </div>
            </div>
        </div>
    );
};

export default NdaEditor;

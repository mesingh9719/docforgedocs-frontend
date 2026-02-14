
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, Save, Wand } from 'lucide-react';
import toast from 'react-hot-toast';
import ProposalFormSidebar from '../../../Dashboard/templates/ProposalFormSidebar';
import ProposalDocumentPreview from '../../../Dashboard/templates/ProposalDocumentPreview';
import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import { useDocumentStyles } from '../../../../hooks/useDocumentStyles';

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultContent = {
    title: "Business / Project Proposal",
    sections: [
        {
            id: '1',
            title: 'Introduction',
            content: "This proposal is submitted by {{providerCompany}} to {{clientName}} to outline the scope, deliverables, timelines, and commercial terms for {{projectDescription}}. This document is intended to present a clear understanding of the proposed engagement and to serve as a basis for mutual agreement."
        },
        {
            id: '2',
            title: 'Client Objectives',
            content: "The objective of this proposal is to assist {{clientCompany}} in achieving the following goals:\n\n{{objectivesList}}"
        },
        {
            id: '3',
            title: 'Scope of Work',
            content: "The scope of work under this proposal shall include, but is not limited to, the following services:\n\n**4.1 Services Included**\n{{scopeIncludedList}}\n\n**4.2 Services Excluded**\nAny services not explicitly mentioned above shall be considered outside the scope and may be provided under a separate agreement or change request."
        },
        {
            id: '4',
            title: 'Deliverables',
            content: "The following deliverables shall be provided as part of this engagement:\n\n{{deliverablesList}}\n\nAll deliverables shall be submitted in the agreed format and within the defined timeline."
        },
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

const GuestProposalEditor = ({ onSaveRequest }) => {
    const navigate = useNavigate();
    const isDesktop = useMediaQuery('(min-width: 1024px)'); // lg breakpoint
    const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'

    const [zoom, setZoom] = useState(1);
    const [documentName, setDocumentName] = useState('Untitled Proposal');
    const [nameError, setNameError] = useState(null);

    // State for the Document Variables (Inputs)
    const [formData, setFormData] = useState({
        proposalTitle: 'Website Redesign Project',
        proposalDate: new Date().toLocaleDateString(),
        // Branding
        logoSize: 80,
        logoAlignment: 'center', // left, center, right
        brandingEnabled: true,
        referenceNo: '',
        clientName: '',
        clientCompany: '',
        clientAddress: '',
        providerName: '',
        providerCompany: '',
        providerAddress: '',
        projectDescription: '',
        totalProjectCost: '',
        paymentDays: '15',
        validityDays: '30',
        noticeDays: '30',
        jurisdiction: '',
        courtCity: '',
        timeline: [
            { phase: 'Phase 1', description: 'Requirement Analysis', duration: '5 days' },
            { phase: 'Phase 2', description: 'Execution / Development', duration: '15 days' },
            { phase: 'Phase 3', description: 'Review & Final Delivery', duration: '5 days' },
        ],
        // Structured Lists
        objectivesList: ['Increase website traffic by 30%', 'Improve conversion rates', 'Modernize brand identity'],
        scopeIncludedList: ['UX/UI Design of 5 core pages', 'Frontend Development (React)', 'Mobile Responsiveness'],
        scopeExcludedList: ['Content creation', 'Hosting setup', 'Ongoing maintenance'],
        deliverablesList: ['High-fidelity mockups (Figma)', 'Production-ready code repository', 'Admin dashboard access']
    });

    // State for the Document Structure (Template Text)
    const [docContent, setDocContent] = useState(defaultContent);

    // Style Integration
    const { styles, updateStyle, resetStyles } = useDocumentStyles();

    // Performance Optimization: Defer the preview data
    const deferredFormData = React.useDeferredValue(formData);
    const deferredDocContent = React.useDeferredValue(docContent);

    // Handlers
    const handleBack = () => navigate('/');
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

    const generateSmartName = () => {
        const clientName = formData.clientCompany || formData.clientName;
        if (clientName && clientName.trim()) {
            setDocumentName(`Proposal - ${clientName.trim()}`);
            setNameError(null);
            toast.success("Generated smart name!");
        } else {
            toast.error("Enter 'Client Company' or 'Client Name' first.");
        }
    };

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

    // ----- List Management Handlers (Objectives, Scope, etc.) -----
    const addListItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), 'New Item']
        }));
    };

    const removeListItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const updateListItem = (field, index, value) => {
        const newList = [...formData[field]];
        newList[index] = value;
        setFormData(prev => ({
            ...prev,
            [field]: newList
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

    const handleSaveClick = () => {
        // Construct payload for the parent
        const payload = {
            name: documentName,
            type_slug: 'proposal',
            content: JSON.stringify({
                formData,
                docContent,
                styles
            }),
            status: 'draft',
            suggestedBusinessName: formData.providerCompany // Pass for Signup Modal
        };
        onSaveRequest(payload);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
            {/* Toolbar / Header */}
            <header className="no-print h-14 md:h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 md:px-6 flex items-center justify-between flex-shrink-0 z-30 shadow-sm relative transition-all duration-300">
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors flex-shrink-0"
                        title="Back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="min-w-0 relative">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={documentName}
                                onChange={(e) => {
                                    setDocumentName(e.target.value);
                                    if (nameError) setNameError(null);
                                }}
                                className={`font-bold text-sm md:text-lg bg-transparent border-b-2 focus:ring-0 p-0 m-0 w-auto min-w-[150px] max-w-[300px] placeholder-slate-400 truncate transition-colors ${nameError ? 'border-red-500 text-slate-800 ring-4 ring-red-500/10' : 'border-transparent hover:border-slate-200 text-slate-800'}`}
                                placeholder="Enter Document Name"
                            />
                            <button onClick={generateSmartName} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                                <Wand size={16} />
                            </button>
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full uppercase tracking-wide">Guest Mode</span>
                        </div>
                        <p className="text-[10px] md:text-xs text-slate-400 font-medium whitespace-nowrap hidden sm:block mt-0.5">
                            Create your document and sign up to save.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <div className="hidden lg:flex items-center bg-slate-100 rounded-lg p-1 mr-4">
                        <button onClick={handleZoomOut} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 transition-all"><ZoomOut size={16} /></button>
                        <span className="text-xs font-semibold text-slate-600 w-12 text-center">{Math.round(zoom * 100)}%</span>
                        <button onClick={handleZoomIn} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md text-slate-500 transition-all"><ZoomIn size={16} /></button>
                    </div>

                    <button
                        onClick={handleSaveClick}
                        className="flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium shadow-md transition-all bg-indigo-600 hover:bg-indigo-700"
                    >
                        <Save size={18} />
                        <span>Save & Create Account</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative pb-[70px] lg:pb-0">
                <div className={`no-print w-full lg:w-[400px] h-full bg-white border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto z-20 shadow-sm flex-shrink-0 lg:order-1 ${isDesktop ? 'block' : (activeTab === 'edit' ? 'block' : 'hidden')}`}>
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
                        // List Handlers
                        addListItem={addListItem}
                        removeListItem={removeListItem}
                        updateListItem={updateListItem}
                        // Style Props
                        styles={styles}
                        onStyleUpdate={updateStyle}
                        onStyleReset={resetStyles}
                    />
                </div>

                <div className={`flex-1 h-full overflow-y-auto bg-slate-50/50 p-4 md:p-8 sm:p-12 flex justify-center items-start scrollbar-thin scrollbar-thumb-slate-300 lg:order-2 ${isDesktop ? 'flex' : (activeTab === 'preview' ? 'flex' : 'hidden')}`} style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    <ProposalDocumentPreview
                        data={deferredFormData}
                        content={deferredDocContent}
                        zoom={zoom}
                        styles={styles}
                    />
                </div>
            </div>

            {/* Mobile Tab Bar */}
            {!isDesktop && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-between items-center px-6 py-3 pb-safe z-40 safe-area-bottom">
                    <button onClick={() => setActiveTab('edit')} className={`flex flex-col items-center gap-1 ${activeTab === 'edit' ? 'text-indigo-600' : 'text-slate-400'}`}>
                        <span className="text-[10px] font-medium">Editor</span>
                    </button>
                    <button onClick={() => setActiveTab('preview')} className={`flex flex-col items-center gap-1 ${activeTab === 'preview' ? 'text-indigo-600' : 'text-slate-400'}`}>
                        <span className="text-[10px] font-medium">Preview</span>
                    </button>
                    <button onClick={handleSaveClick} className="flex flex-col items-center gap-1 text-slate-400 active:text-indigo-600">
                        <Save size={24} />
                        <span className="text-[10px] font-medium">Save</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default GuestProposalEditor;

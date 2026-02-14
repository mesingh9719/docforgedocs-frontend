import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useDocumentEngine } from '../../../hooks/useDocumentEngine';
import Canvas from '../../../components/DocumentEngine/Canvas';
import Toolbox from '../../../components/DocumentEngine/Sidebar/Toolbox';
import ConfigurationPanel from '../../../components/DocumentEngine/Sidebar/ConfigurationPanel';
import VariableManager from '../../../components/DocumentEngine/Sidebar/VariableManager';
import SignupModal from './components/SignupModal';
import axios from '../../../api/axios';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import SEO from '../../../components/SEO';

const SEO_DATA = {
    nda: {
        title: 'Create Non-Disclosure Agreement (NDA) - Free',
        description: 'Generate a professional Non-Disclosure Agreement instantly. Protect your confidential information without signup.'
    },
    proposal: {
        title: 'Create Business Proposal - Free Template',
        description: 'Build a winning business proposal with our free generator. Add objectives, timeline, and pricing.'
    },
    'consulting-agreement': {
        title: 'Create Consulting Services Agreement - Free',
        description: 'Draft a watertight consulting agreement. Define scope, payment terms, and deliverabes.'
    },
    default: {
        title: 'Create Document - DocForge',
        description: 'Free online document generator for freelancers and agencies.'
    }
};

// Robust Templates mapped to DB Schema
// Keys must match 'slug' in document_types table
const TEMPLATES = {
    nda: {
        metadata: {
            title: 'Non-Disclosure Agreement',
            version: '1.0',
            theme: 'default'
        },
        blocks: [
            { id: 'h1_nda', type: 'HEADING', data: { level: 1, text: 'Non-Disclosure Agreement', align: 'center' } },
            { id: 'p1_nda', type: 'TEXT', data: { text: 'This Non-Disclosure Agreement (the "Agreement") is entered into as of {{date}} by and between {{discloser_name}} ("Discloser") and {{recipient_name}} ("Recipient").' } },
            { id: 'h2_conf', type: 'HEADING', data: { level: 2, text: '1. Confidential Information' } },
            { id: 'p2_conf', type: 'TEXT', data: { text: 'For purposes of this Agreement, "Confidential Information" shall mean any and all non-public information, including but not limited to technical data, trade secrets, know-how, software, and business plans.' } },
            { id: 'h2_obl', type: 'HEADING', data: { level: 2, text: '2. Obligations' } },
            { id: 'p3_obl', type: 'TEXT', data: { text: 'Recipient agrees to hold and maintain Confidential Information in strictest confidence and not to disclose it to any third party without Discloser\'s prior written consent.' } },
            { id: 'sig_area', type: 'TEXT', data: { text: '\n\nSigned by: __________________________\nDate: {{date}}' } }
        ],
        variables: {
            date: { value: new Date().toLocaleDateString(), type: 'date', label: 'Agreement Date' },
            discloser_name: { value: '', type: 'text', label: 'Discloser Name' },
            recipient_name: { value: '', type: 'text', label: 'Recipient Name' }
        }
    },
    proposal: {
        metadata: {
            title: 'Business Proposal',
            version: '1.0',
            theme: 'modern'
        },
        blocks: [
            { id: 'h1_prop', type: 'HEADING', data: { level: 1, text: 'Project Proposal', align: 'left' } },
            { id: 'p_intro', type: 'TEXT', data: { text: 'Prepared for: {{client_name}}\nPrepared by: {{my_company}}' } },
            { id: 'h2_exec', type: 'HEADING', data: { level: 2, text: 'Executive Summary' } },
            { id: 'p_exec', type: 'TEXT', data: { text: 'We are pleased to present this proposal to {{client_name}}. Our goal is to provide a comprehensive solution that meets your needs for {{project_scope}}.' } },
            { id: 'h2_sol', type: 'HEADING', data: { level: 2, text: 'Proposed Solution' } },
            { id: 'p_sol', type: 'TEXT', data: { text: 'Our team will deliver the following key components:\n1. Analysis and Design\n2. Implementation Phase\n3. Testing and Deployment' } },
            { id: 'h2_cost', type: 'HEADING', data: { level: 2, text: 'Investment' } },
            { id: 'p_cost', type: 'TEXT', data: { text: 'The total estimated investment for this project is {{total_cost}}. This covers all phases outlined above.' } }
        ],
        variables: {
            client_name: { value: '', type: 'text', label: 'Client Name' },
            my_company: { value: '', type: 'text', label: 'My Company' },
            project_scope: { value: 'Web Development', type: 'text', label: 'Project Scope' },
            total_cost: { value: '$5,000', type: 'text', label: 'Total Cost' }
        }
    },
    'consulting-agreement': {
        metadata: {
            title: 'Consulting Agreement',
            version: '1.0',
            theme: 'formal'
        },
        blocks: [
            { id: 'h1_srv', type: 'HEADING', data: { level: 1, text: 'Consulting Agreement', align: 'center' } },
            { id: 'p_parties', type: 'TEXT', data: { text: 'This Consulting Agreement is made effectively as of {{start_date}} by and between {{provider_name}} ("Provider") and {{client_name}} ("Client").' } },
            { id: 'h2_scope', type: 'HEADING', data: { level: 2, text: 'Scope of Services' } },
            { id: 'p_scope', type: 'TEXT', data: { text: 'Provider agrees to provide the following services: {{service_description}}. Provider shall perform these services in a professional manner.' } },
            { id: 'h2_pay', type: 'HEADING', data: { level: 2, text: 'Payment Terms' } },
            { id: 'p_pay', type: 'TEXT', data: { text: 'Client agrees to pay Provider at the rate of {{rate}} per hour. Payment shall be due within 30 days of invoice receipt.' } },
            { id: 'h2_term', type: 'HEADING', data: { level: 2, text: 'Term and Termination' } },
            { id: 'p_term', type: 'TEXT', data: { text: 'This Agreement shall commence on {{start_date}} and continue until terminated by either party with 14 days written notice.' } }
        ],
        variables: {
            start_date: { value: new Date().toLocaleDateString(), type: 'date', label: 'Start Date' },
            provider_name: { value: '', type: 'text', label: 'Provider Name' },
            client_name: { value: '', type: 'text', label: 'Client Name' },
            service_description: { value: '', type: 'text', label: 'Description of Services' },
            rate: { value: '$100', type: 'text', label: 'Hourly Rate' }
        }
    }
};

// ... imports
import GuestNdaEditor from './components/GuestNdaEditor';
import GuestProposalEditor from './components/GuestProposalEditor';
import GuestConsultingAgreementEditor from './components/GuestConsultingAgreementEditor';

// ... (existing TEMPLATES config)

const GuestEditor = () => {
    const { template } = useParams();
    const navigate = useNavigate();
    const { documentState, actions } = useDocumentEngine();

    const seo = SEO_DATA[template] || SEO_DATA.default;

    // UI State
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [pendingPayload, setPendingPayload] = useState(null); // Store payload from legacy editors
    const [suggestedBusinessName, setSuggestedBusinessName] = useState('');

    // Initialize Template (Only for Generic / Block Editor)
    useEffect(() => {
        if (template === 'nda') return; // Skip for NDA (handled by GuestNdaEditor)

        const tplKey = template && TEMPLATES[template] ? template : 'nda';
        // Note: If tplKey falls back to 'nda' but we have a dedicated editor, we might need adjustments
        // checks if 'proposal' or 'consulting-agreement' have dedicated editors later.

        const tpl = TEMPLATES[tplKey];
        if (tpl) {
            actions.loadDocument({
                metadata: { ...tpl.metadata, title: tpl.metadata.title },
                blocks: tpl.blocks.map(b => ({ ...b, id: uuidv4() })),
                variables: tpl.variables,
                history: { past: [], future: [] }
            });
        }
    }, [template]);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    // Handler for Block Editor Save
    const handleSaveClickBlock = () => {
        // Construct payload for Block Editor
        const finalContent = {
            blocks: documentState.blocks,
            variables: documentState.variables,
            metadata: documentState.metadata
        };
        const payload = {
            name: documentState.metadata.title,
            type_slug: template || 'nda', // Should probably default to general?
            content: JSON.stringify(finalContent),
            status: 'draft'
        };
        setPendingPayload(payload);
        setIsSignupOpen(true);
    };

    // Handler for Legacy Editor Save (passed via onSaveRequest)
    const handleSaveRequestLegacy = (payload) => {
        if (payload.suggestedBusinessName) {
            setSuggestedBusinessName(payload.suggestedBusinessName);
            delete payload.suggestedBusinessName; // Clean up for backend
        }
        setPendingPayload(payload);
        setIsSignupOpen(true);
    };

    const handleSignupSuccess = async (token) => {
        setIsSignupOpen(false);
        setIsSaving(true);
        const savingToast = toast.loading("Saving document and creating account...");

        try {
            // Use pendingPayload
            if (!pendingPayload) throw new Error("No document data to save.");

            const response = await axios.post('/documents', pendingPayload);
            const newDoc = response.data.data;

            toast.dismiss(savingToast);
            toast.success("Document saved! Redirecting to your dashboard...");

            // Redirect to the dashboard viewer
            navigate(`/documents/${newDoc.type?.slug || 'general'}/${newDoc.id}`);

        } catch (error) {
            console.error("Save failed", error);
            toast.dismiss(savingToast);
            const msg = error.response?.data?.message || "Failed to save document.";
            toast.error(msg);
        } finally {
            setIsSaving(false);
            setPendingPayload(null);
        }
    };

    // Render Logic
    // If template is 'nda', use the Form-Based Editor
    if (template === 'nda') {
        return (
            <>
                <SEO title={seo.title} description={seo.description} />
                <GuestNdaEditor onSaveRequest={handleSaveRequestLegacy} />
                <SignupModal
                    isOpen={isSignupOpen}
                    onClose={() => setIsSignupOpen(false)}
                    onSignupSuccess={handleSignupSuccess}
                    suggestedBusinessName={suggestedBusinessName}
                />
            </>
        );
    }

    // If template is 'proposal', use the Proposal Editor
    if (template === 'proposal') {
        return (
            <>
                <SEO title={seo.title} description={seo.description} />
                <GuestProposalEditor onSaveRequest={handleSaveRequestLegacy} />
                <SignupModal
                    isOpen={isSignupOpen}
                    onClose={() => setIsSignupOpen(false)}
                    onSignupSuccess={handleSignupSuccess}
                    suggestedBusinessName={suggestedBusinessName}
                />
            </>
        );
    }

    // If template is 'consulting-agreement', use the Consulting Agreement Editor
    if (template === 'consulting-agreement') {
        return (
            <>
                <SEO title={seo.title} description={seo.description} />
                <GuestConsultingAgreementEditor onSaveRequest={handleSaveRequestLegacy} />
                <SignupModal
                    isOpen={isSignupOpen}
                    onClose={() => setIsSignupOpen(false)}
                    onSignupSuccess={handleSignupSuccess}
                    suggestedBusinessName={suggestedBusinessName}
                />
            </>
        );
    }

    // Default: Block-Based Editor
    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter}>
            <SEO title={seo.title} description={seo.description} />
            <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-30 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            {documentState.metadata.title}
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full uppercase tracking-wide">Guest Mode</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-xs text-slate-400 font-medium hidden sm:block">
                            Changes saved locally until you export.
                        </div>
                        <button
                            onClick={handleSaveClickBlock}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {isSaving ? 'Saving...' : 'Save & Create Account'}
                        </button>
                    </div>
                </header>

                {/* Workspace */}
                <div className="flex flex-1 overflow-hidden">
                    <div className="w-[300px] bg-white border-r border-slate-200 flex flex-col z-20">
                        <Toolbox />
                        <div className="h-px bg-slate-200 my-2" />
                        <VariableManager variables={documentState.variables} onAdd={actions.addVariable} />
                    </div>

                    <div className="flex-1 bg-slate-100 overflow-y-auto p-8 flex justify-center">
                        <Canvas
                            blocks={documentState.blocks}
                            actions={actions}
                            readOnly={false}
                            businessData={{}} // Empty for guest
                            selectedBlockId={documentState.selectedBlockId}
                            onSelectBlock={actions.selectBlock}
                        />
                    </div>

                    <div className="w-[280px] bg-white border-l border-slate-200 z-20">
                        <ConfigurationPanel
                            selectedBlock={documentState.blocks.find(b => b.id === documentState.selectedBlockId)}
                            updateBlock={actions.updateBlock}
                            removeBlock={actions.removeBlock}
                        />
                    </div>
                </div>

                <SignupModal
                    isOpen={isSignupOpen}
                    onClose={() => setIsSignupOpen(false)}
                    onSignupSuccess={handleSignupSuccess}
                    suggestedBusinessName={suggestedBusinessName}
                />
            </div>
        </DndContext>
    );
};

export default GuestEditor;



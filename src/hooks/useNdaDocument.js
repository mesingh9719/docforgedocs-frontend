import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { createDocument, getDocument, updateDocument } from '../api/documents';
import { getBusiness } from '../api/business';
import { defaultContent, defaultFormData } from '../data/ndaDefaults';
import { generateId } from '../utils/ndaUtils';
import { useDocumentStyles } from './useDocumentStyles';

export const useNdaDocument = (id) => {
    const [formData, setFormData] = useState(defaultFormData);
    const [docContent, setDocContent] = useState(defaultContent);
    const [documentName, setDocumentName] = useState('Untitled NDA');
    const [sentAt, setSentAt] = useState(null);
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);
    const [isNewEngine, setIsNewEngine] = useState(false);

    // Style Integration
    const { styles, updateStyle, resetStyles } = useDocumentStyles();

    // Track original state for preview mode to restore later
    const originalState = useRef(null);

    // Initial Load
    useEffect(() => {
        const loadInitialData = async () => {
            if (id) {
                try {
                    setIsLoading(true);
                    const doc = await getDocument(id);
                    if (doc.data.name) setDocumentName(doc.data.name);
                    if (doc.data.sent_at) setSentAt(doc.data.sent_at);

                    let content = doc.data?.content || doc.content;
                    if (typeof content === 'string') {
                        try { content = JSON.parse(content); } catch (e) { console.error(e); }
                    }
                    content = content || {};

                    if (content.blocks) {
                        setIsNewEngine(true);
                    }

                    if (content.formData) setFormData(prev => ({ ...prev, ...content.formData }));
                    if (content.docContent) setDocContent(content.docContent);
                    if (content.signatures) setSignatures(content.signatures);
                    if (content.styles) {
                        // Batch update styles
                        Object.entries(content.styles).forEach(([k, v]) => updateStyle(k, v));
                    }
                } catch (error) {
                    console.error("Failed to load document", error);
                    toast.error("Failed to load document");
                } finally {
                    setIsLoading(false);
                }
            } else {
                // New Document - Fetch Business Defaults
                try {
                    const business = await getBusiness();
                    if (business) {
                        setFormData(prev => ({
                            ...prev,
                            disclosingPartyName: business.name || '',
                            disclosingPartyAddress: [business.address, business.city, business.state, business.country].filter(Boolean).join(', '),
                        }));
                    }
                } catch (error) {
                    console.error("Failed to load business details", error);
                }
            }
        };

        loadInitialData();
    }, [id]);

    // Field Handlers
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (e) => {
        const { name, value } = e.target;
        setDocContent(prev => ({ ...prev, [name]: value }));
    };

    // Section Handlers
    const addSection = () => {
        setDocContent(prev => ({
            ...prev,
            sections: [...prev.sections, {
                id: generateId(),
                title: "New Section",
                content: "Enter the details of this new clause here..."
            }]
        }));
    };

    const removeSection = (sectionId) => {
        setDocContent(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s.id !== sectionId)
        }));
    };

    const updateSection = (sectionId, field, value) => {
        setDocContent(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId ? { ...s, [field]: value } : s
            )
        }));
    };

    const reorderSections = (newSections) => {
        setDocContent(prev => ({ ...prev, sections: newSections }));
    };

    // Actions
    const saveDocument = async (navigate) => {
        setIsSaving(true);
        try {
            const payload = {
                name: documentName,
                type_slug: 'nda',
                content: {
                    formData,
                    docContent,
                    signatures,
                    styles // Save styles
                },
                status: 'draft'
            };

            if (id) {
                await updateDocument(id, payload);
                toast.success("Document updated successfully");
                return id;
            } else {
                const newDoc = await createDocument(payload);
                toast.success("Document created successfully");
                if (navigate) navigate(`/documents/nda/${newDoc.data.id}`, { replace: true });
                return newDoc.data.id;
            }
        } catch (error) {
            console.error("Failed to save", error);
            // If it's not a validation error (which we want to handle in UI), show generic toast
            if (!error.response || error.response.status !== 422) {
                toast.error("Failed to save document");
            }
            throw error; // Propagate error to component for specific handling (e.g. 422 duplicate name)
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    };

    // Preview Logic
    const enterPreviewMode = (version) => {
        if (!originalState.current) {
            originalState.current = { formData, docContent };
        }

        let content = version.content;
        if (typeof content === 'string') {
            try { content = JSON.parse(content); } catch (e) { }
        }

        if (content.formData) setFormData(content.formData);
        if (content.docContent) setDocContent(content.docContent);

        return content;
    };

    const exitPreviewMode = () => {
        if (originalState.current) {
            setFormData(originalState.current.formData);
            setDocContent(originalState.current.docContent);
            originalState.current = null;
        }
    };

    // Restore logic (similar to preview but permanent)
    const restoreVersion = (docData) => {
        if (docData && docData.content) {
            let content = docData.content;
            if (typeof content === 'string') {
                try { content = JSON.parse(content); } catch (e) { }
            }
            if (content.formData) setFormData(content.formData);
            if (content.docContent) setDocContent(content.docContent);
            if (content.styles) {
                Object.entries(content.styles).forEach(([k, v]) => updateStyle(k, v));
            }
        }
        originalState.current = null;
    };

    // Signature Handlers
    const [signatures, setSignatures] = useState([]);

    const addSignature = (signature) => {
        setSignatures(prev => [...prev, signature]);
    };

    const updateSignature = (id, updates) => {
        setSignatures(prev => prev.map(s =>
            s.id === id ? { ...s, ...updates } : s
        ));
    };

    const removeSignature = (id) => {
        setSignatures(prev => prev.filter(s => s.id !== id));
    };

    return {
        // State
        formData,
        docContent,
        signatures,
        documentName,
        setDocumentName,
        sentAt,
        setSentAt,
        isLoading,
        isSaving,

        // Handlers
        handleFormChange,
        handleContentChange,
        addSection,
        removeSection,
        updateSection,
        reorderSections,

        // Signature Handlers
        addSignature,
        updateSignature,
        removeSignature,

        // Actions
        saveDocument,
        enterPreviewMode,
        exitPreviewMode,
        restoreVersion,

        // Style Exports
        styles,
        updateStyle,
        resetStyles,
        isNewEngine // Expose flag
    };
};

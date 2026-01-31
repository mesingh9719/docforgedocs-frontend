import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { createDocument, getDocument, updateDocument } from '../api/documents';
import { getBusiness } from '../api/business';
import { defaultContent, defaultFormData } from '../data/offerLetterDefaults';
import { generateId } from '../utils/ndaUtils'; // Reusing ID generator

export const useOfferLetterDocument = (id) => {
    const [formData, setFormData] = useState(defaultFormData);
    const [docContent, setDocContent] = useState(defaultContent);
    const [documentName, setDocumentName] = useState('Untitled Offer Letter');
    const [sentAt, setSentAt] = useState(null);
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSaving, setIsSaving] = useState(false);

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

                    if (content.formData) setFormData(prev => ({ ...prev, ...content.formData }));
                    if (content.docContent) setDocContent(content.docContent);
                    if (content.signatures) setSignatures(content.signatures);
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
                            employerName: business.name || '',
                            employerAddress: [business.address, business.city, business.state, business.country].filter(Boolean).join(', '),
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
                type_slug: 'offer-letter',
                content: { formData, docContent, signatures },
                status: 'draft'
            };

            if (id) {
                await updateDocument(id, payload);
                toast.success("Document updated successfully");
                return id;
            } else {
                const newDoc = await createDocument(payload);
                toast.success("Document created successfully");
                if (navigate) navigate(`/documents/offer-letter/${newDoc.data.id}`, { replace: true });
                return newDoc.data.id;
            }
        } catch (error) {
            console.error("Failed to save", error);
            if (!error.response || error.response.status !== 422) {
                toast.error("Failed to save document");
            }
            throw error;
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

    const restoreVersion = (docData) => {
        if (docData && docData.content) {
            let content = docData.content;
            if (typeof content === 'string') {
                try { content = JSON.parse(content); } catch (e) { }
            }
            if (content.formData) setFormData(content.formData);
            if (content.docContent) setDocContent(content.docContent);
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
        formData,
        docContent,
        signatures,
        documentName,
        setDocumentName,
        sentAt,
        setSentAt,
        isLoading,
        isSaving,
        handleFormChange,
        handleContentChange,
        addSection,
        removeSection,
        updateSection,
        reorderSections,
        addSignature,
        updateSignature,
        removeSignature,
        saveDocument,
        enterPreviewMode,
        exitPreviewMode,
        restoreVersion
    };
};

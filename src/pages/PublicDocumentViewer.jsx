import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

import NdaDocumentPreview from './Dashboard/templates/NdaDocumentPreview';
import InvoiceDocumentPreview from './Dashboard/templates/InvoiceDocumentPreview';
import ProposalDocumentPreview from './Dashboard/templates/ProposalDocumentPreview';
import { Loader2, AlertCircle, Download } from 'lucide-react';

const PublicDocumentViewer = () => {
    const { token } = useParams();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                // We need to bypass the standard /documents endpoints that require auth
                // and use our new public endpoint.
                // We'll assume the axios instance base URL is correct.
                const response = await axios.get(`/public/documents/${token}`);
                setDocument(response.data.data);
            } catch (err) {
                console.error("Failed to load public document", err);
                setError("Document not found or access denied.");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchDocument();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 size={40} className="text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (error || !document) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Unavailable</h2>
                    <p className="text-slate-500">{error || "This document could not be found."}</p>
                </div>
            </div>
        );
    }

    // Parse content if needed (API resource likely returns it as object already if cast, checking...)
    let content = document.content;
    if (typeof content === 'string') {
        try {
            content = JSON.parse(content);
        } catch (e) { /* ignore */ }
    }

    // Determine which preview to render
    const type = document.type || document.type_slug || document.document_type?.slug; // Handle different resource shapes

    const renderPreview = () => {
        switch (type) {
            case 'nda':
                return <NdaDocumentPreview data={content.formData} content={content.docContent} zoom={1} />;
            case 'invoice':
                // Invoice might need totals calculation if not stored. 
                // Usually calculator logic is in Editor.
                // Ideally document content should have everything needed for display.
                // For now passing data as is.
                return <InvoiceDocumentPreview data={content.formData} totals={content.totals || {}} zoom={1} />;
            case 'proposal':
                return <ProposalDocumentPreview data={content.formData} content={content.docContent} zoom={1} />;
            default:
                return <div className="p-8 text-center">Unknown Document Type</div>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            <header className="bg-white h-16 border-b border-slate-200 px-6 flex items-center justify-between shadow-sm flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        DF
                    </div>
                    <span className="font-bold text-slate-700">DocForge</span>
                </div>
                <div className="flex items-center gap-3">
                    {/* Try to show download button if PDF path exists? Or trigger print? */}
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Download / Print
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center">
                <div className="bg-white shadow-2xl overflow-hidden print:shadow-none max-w-4xl w-full">
                    {renderPreview()}
                </div>
            </div>
        </div>
    );
};

export default PublicDocumentViewer;

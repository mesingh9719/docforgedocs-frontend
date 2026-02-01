import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, PenTool } from 'lucide-react';
import PDFViewer from './Dashboard/signature-module/components/PDFViewer';
import SignatureCanvas from './Dashboard/signature-module/components/SignatureCanvas';
// We might need a specific Signing Modal or Canvas usage here

const PublicSignatureViewer = () => {
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [documentData, setDocumentData] = useState(null);
    const [currentSigner, setCurrentSigner] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);

    // Fields state for the current session representation
    const [fields, setFields] = useState([]);

    const [signingField, setSigningField] = useState(null); // The field currently being signed
    const [signatureData, setSignatureData] = useState(null); // The signature image/text being applied

    useEffect(() => {
        fetchDocument();
    }, [token]);

    const fetchDocument = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/signatures/${token}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Document not found or link expired');

            const data = await response.json();
            setDocumentData(data.document);
            setCurrentSigner(data.current_signer);

            // If the document has a public URL or we need to fetch the blob
            // The backend returns `pdf_url` which might be a public link or preview link.
            // Let's assume pdf_url works.
            setPdfUrl(data.pdf_url);

            // Map document fields to our frontend "signatures" format
            // We need to filter fields to show ALL, but identify WHICH ONE is ours.
            // Backend `show` returns all fields? 
            // We need to transform backend fields to `signatures` state format.
            const mappedFields = data.document.fields.map(field => ({
                id: field.id, // Database ID
                type: field.type,
                pageNumber: field.page_number,
                position: { x: field.x_position, y: field.y_position },
                metadata: {
                    ...field.metadata,
                    // Add flags for UI
                    isMine: field.signer_id === data.current_signer.id,
                    value: field.value // If already signed
                }
            }));

            setFields(mappedFields);

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFieldClick = (field) => {
        if (!field.metadata.isMine) return; // Cannot sign others
        if (field.metadata.value) return; // Already signed

        setSigningField(field);
    };

    const handleSignatureComplete = async (signatureBlob) => {
        // Convert blob/data to base64 to send
        const reader = new FileReader();
        reader.readAsDataURL(signatureBlob);
        reader.onloadend = async () => {
            const base64data = reader.result;

            // Optimistic update
            const updatedFields = fields.map(f =>
                f.id === signingField.id ? { ...f, metadata: { ...f.metadata, value: base64data } } : f
            );
            setFields(updatedFields);
            setSigningField(null);

            // API Call
            try {
                await fetch(`${import.meta.env.VITE_API_URL}/api/v1/signatures/${token}/sign`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        fields: [{ id: signingField.id, value: base64data }]
                    })
                });
            } catch (err) {
                alert("Failed to save signature");
                // Revert optimistic update?
            }
        };
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
                <p className="text-slate-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-slate-100">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                        DF
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-800">{documentData?.title || 'Document'}</h1>
                        <p className="text-xs text-slate-500">Requested by <span className="font-medium text-indigo-600">{documentData?.user?.name || 'Sender'}</span></p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {currentSigner?.status === 'signed' ? (
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-sm font-medium">
                            <CheckCircle size={16} />
                            <span>Signed</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full text-sm font-medium">
                            <PenTool size={16} />
                            <span>Please Sign {fields.filter(f => f.metadata.isMine && !f.metadata.value).length} field(s)</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Viewer */}
            <div className="flex-1 overflow-hidden relative flex justify-center p-4 md:p-8">
                <div className="w-full max-w-5xl h-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative">
                    <PDFViewer
                        pdfUrl={pdfUrl}
                        signatures={fields}
                        readOnly={true} // Disable drag/drop
                        // We need a way to INTERCEPT clicks on fields in ReadOnly mode?
                        // Currently PDFViewer just renders SignatureFieldVisual.
                        // SignatureFieldVisual doesn't have onClick unless we pass it.
                        // But PDFViewer doesn't pass onClick to it in readOnly mode usually.
                        // We might need to modify PDFViewer to accept `onFieldClick`.
                        onFieldClick={handleFieldClick}
                    />
                </div>
            </div>

            {/* Signing Modal/Overlay */}
            {signingField && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                    >
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Sign Document</h3>
                            <button onClick={() => setSigningField(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
                        </div>
                        <div className="p-4">
                            <SignatureCanvas
                                onSave={handleSignatureComplete}
                                onCancel={() => setSigningField(null)}
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default PublicSignatureViewer;

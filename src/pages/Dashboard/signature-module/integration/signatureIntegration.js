/**
 * Example Backend Integration
 * This file demonstrates how to integrate the signature module with your backend API
 */

import SignatureModule from './components/signature/SignatureModule';
import { exportSignaturesData, validatePDFFile } from './utils/signatureUtils';

// ===================================
// API Configuration
// ===================================

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const apiClient = {
    async uploadPDF(file) {
        const formData = new FormData();
        formData.append('pdf', file);
        
        const response = await fetch(`${API_BASE_URL}/documents/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        
        if (!response.ok) throw new Error('Upload failed');
        return response.json();
    },
    
    async saveSignatureFields(documentId, signatures) {
        const response = await fetch(`${API_BASE_URL}/documents/${documentId}/fields`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ signatures })
        });
        
        if (!response.ok) throw new Error('Failed to save signature fields');
        return response.json();
    },
    
    async submitSignature(documentId, signatureData) {
        const response = await fetch(`${API_BASE_URL}/documents/${documentId}/sign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(signatureData)
        });
        
        if (!response.ok) throw new Error('Failed to submit signature');
        return response.json();
    },
    
    async finalizeDocument(documentId, allSignatures) {
        const response = await fetch(`${API_BASE_URL}/documents/${documentId}/finalize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ signatures: allSignatures })
        });
        
        if (!response.ok) throw new Error('Failed to finalize document');
        return response.json();
    },
    
    async getDocument(documentId) {
        const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch document');
        return response.json();
    },
    
    async sendSignatureRequest(documentId, signers) {
        const response = await fetch(`${API_BASE_URL}/documents/${documentId}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ signers })
        });
        
        if (!response.ok) throw new Error('Failed to send signature requests');
        return response.json();
    }
};

// ===================================
// Enhanced Signature Module with Backend
// ===================================

import React, { useState } from 'react';

export const EnhancedSignatureModule = () => {
    const [documentId, setDocumentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileUpload = async (file) => {
        try {
            setLoading(true);
            setError(null);
            
            // Validate file
            const validation = validatePDFFile(file);
            if (!validation.valid) {
                setError(validation.error);
                return;
            }
            
            // Upload to backend
            const result = await apiClient.uploadPDF(file);
            setDocumentId(result.documentId);
            
            return result;
        } catch (err) {
            setError(err.message);
            console.error('Upload error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSignatureFields = async (signatures) => {
        try {
            setLoading(true);
            await apiClient.saveSignatureFields(documentId, signatures);
        } catch (err) {
            setError(err.message);
            console.error('Save fields error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSignatureSubmit = async (signatureData) => {
        try {
            setLoading(true);
            await apiClient.submitSignature(documentId, signatureData);
        } catch (err) {
            setError(err.message);
            console.error('Submit signature error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalizeDocument = async (allSignatures) => {
        try {
            setLoading(true);
            const result = await apiClient.finalizeDocument(documentId, allSignatures);
            
            // Download the signed PDF
            if (result.signedPdfUrl) {
                window.open(result.signedPdfUrl, '_blank');
            }
            
            return result;
        } catch (err) {
            setError(err.message);
            console.error('Finalize error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl">
                        <div className="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4" />
                        <p className="text-slate-700 font-medium">Processing...</p>
                    </div>
                </div>
            )}
            
            {error && (
                <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-lg z-50">
                    <p className="font-medium">{error}</p>
                    <button 
                        onClick={() => setError(null)}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                        Dismiss
                    </button>
                </div>
            )}
            
            <SignatureModule
                onFileUpload={handleFileUpload}
                onSaveFields={handleSaveSignatureFields}
                onSubmitSignature={handleSignatureSubmit}
                onFinalize={handleFinalizeDocument}
            />
        </div>
    );
};

// ===================================
// Backend API Endpoints Example
// ===================================

/**
 * Express.js Backend Example
 * 
 * Required packages:
 * - express
 * - multer (for file uploads)
 * - pdf-lib (for PDF manipulation)
 * - nodemailer (for email notifications)
 */

/*
const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const nodemailer = require('nodemailer');

const router = express.Router();
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }
});

// Upload PDF
router.post('/documents/upload', upload.single('pdf'), async (req, res) => {
    try {
        const { file } = req;
        const { user } = req; // From auth middleware
        
        // Create document record
        const document = await Document.create({
            userId: user.id,
            filename: file.originalname,
            filepath: file.path,
            size: file.size,
            status: 'draft'
        });
        
        res.json({
            documentId: document.id,
            url: `/documents/${document.id}/preview`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Save signature fields
router.post('/documents/:id/fields', async (req, res) => {
    try {
        const { id } = req.params;
        const { signatures } = req.body;
        
        await SignatureField.bulkCreate(
            signatures.map(sig => ({
                documentId: id,
                position: sig.position,
                metadata: sig.metadata,
                type: sig.type
            }))
        );
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit signature
router.post('/documents/:id/sign', async (req, res) => {
    try {
        const { id } = req.params;
        const { fieldId, signature, timestamp } = req.body;
        const { user } = req;
        
        // Save signature
        const sig = await Signature.create({
            documentId: id,
            fieldId,
            userId: user.id,
            type: signature.type,
            data: signature.data,
            timestamp,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        
        // Create audit trail
        await AuditLog.create({
            documentId: id,
            action: 'signature_added',
            userId: user.id,
            metadata: { fieldId, signatureId: sig.id }
        });
        
        res.json({ success: true, signatureId: sig.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Finalize document
router.post('/documents/:id/finalize', async (req, res) => {
    try {
        const { id } = req.params;
        const { signatures } = req.body;
        
        // Load original PDF
        const doc = await Document.findByPk(id);
        const pdfBytes = await fs.readFile(doc.filepath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        // Add signatures to PDF
        for (const sig of signatures) {
            const page = pdfDoc.getPage(0);
            const image = await pdfDoc.embedPng(sig.signature.data);
            
            page.drawImage(image, {
                x: sig.position.x,
                y: page.getHeight() - sig.position.y - 50,
                width: 200,
                height: 50
            });
        }
        
        // Save signed PDF
        const signedPdfBytes = await pdfDoc.save();
        const signedPath = `uploads/signed_${Date.now()}_${doc.filename}`;
        await fs.writeFile(signedPath, signedPdfBytes);
        
        // Update document status
        await doc.update({
            status: 'completed',
            signedFilepath: signedPath,
            completedAt: new Date()
        });
        
        res.json({
            success: true,
            signedPdfUrl: `/documents/${id}/download`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send signature requests via email
router.post('/documents/:id/send', async (req, res) => {
    try {
        const { id } = req.params;
        const { signers } = req.body;
        const doc = await Document.findByPk(id);
        
        const transporter = nodemailer.createTransport({
            // Configure your email service
        });
        
        for (const signer of signers) {
            const signLink = `${process.env.APP_URL}/sign/${id}/${signer.token}`;
            
            await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: signer.email,
                subject: 'Document Signature Request',
                html: `
                    <h2>Signature Request</h2>
                    <p>You have been requested to sign: ${doc.filename}</p>
                    <a href="${signLink}">Click here to sign</a>
                `
            });
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
*/


export const setupWebhooks = (documentId) => {
    const eventSource = new EventSource(`${API_BASE_URL}/documents/${documentId}/events`);
    
    eventSource.addEventListener('signature_added', (event) => {
        const data = JSON.parse(event.data);
        console.log('New signature added:', data);
        // Update UI accordingly
    });
    
    eventSource.addEventListener('document_completed', (event) => {
        const data = JSON.parse(event.data);
        console.log('Document completed:', data);
        // Show completion notification
    });
    
    return () => eventSource.close();
};

// ===================================
// Usage in your app
// ===================================

/*
import { EnhancedSignatureModule } from './integrations/signatureIntegration';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signature" element={<EnhancedSignatureModule />} />
            </Routes>
        </BrowserRouter>
    );
}
*/
/**
 * Signature Module Utilities
 * Helper functions for signature validation, conversion, and processing
 */

/**
 * Validate file before upload
 * @param {File} file - The file to validate
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export const validatePDFFile = (file) => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    
    if (!file) {
        return { valid: false, error: 'No file selected' };
    }
    
    if (file.type !== 'application/pdf') {
        return { valid: false, error: 'Only PDF files are allowed' };
    }
    
    if (file.size > MAX_SIZE) {
        return { valid: false, error: 'File size must be less than 10MB' };
    }
    
    return { valid: true, error: null };
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size string
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Convert canvas to base64 image
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} format - Image format (default: 'image/png')
 * @returns {string} - Base64 encoded image
 */
export const canvasToBase64 = (canvas, format = 'image/png') => {
    return canvas.toDataURL(format);
};

/**
 * Resize image to fit signature field
 * @param {string} imageData - Base64 image data
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @returns {Promise<string>} - Resized base64 image
 */
export const resizeImage = (imageData, maxWidth = 200, maxHeight = 50) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Calculate new dimensions
            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            resolve(canvas.toDataURL('image/png'));
        };
        img.src = imageData;
    });
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Generate signature metadata
 * @param {Object} signatureData - Signature information
 * @returns {Object} - Complete metadata object
 */
export const generateSignatureMetadata = (signatureData) => {
    return {
        id: `sig-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ipAddress: null, // Should be set by backend
        userAgent: navigator.userAgent,
        ...signatureData
    };
};

/**
 * Calculate signature field position relative to page
 * @param {Object} event - Mouse/touch event
 * @param {DOMRect} containerRect - Container bounding rectangle
 * @returns {Object} - { x, y } position
 */
export const calculateFieldPosition = (event, containerRect) => {
    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;
    
    return {
        x: Math.max(0, Math.min(x, containerRect.width - 200)), // Constrain within bounds
        y: Math.max(0, Math.min(y, containerRect.height - 60))
    };
};

/**
 * Sort signers by order
 * @param {Array} signers - Array of signer objects
 * @returns {Array} - Sorted array
 */
export const sortSignersByOrder = (signers) => {
    return [...signers].sort((a, b) => a.order - b.order);
};

/**
 * Check if all signatures are complete
 * @param {Array} signatures - Required signatures
 * @param {Array} completedSignatures - Completed signatures
 * @returns {boolean} - True if all complete
 */
export const areAllSignaturesComplete = (signatures, completedSignatures) => {
    return signatures.every(sig => 
        completedSignatures.some(cs => cs.fieldId === sig.id)
    );
};

/**
 * Generate audit trail entry
 * @param {string} action - Action performed
 * @param {Object} data - Additional data
 * @returns {Object} - Audit entry
 */
export const createAuditEntry = (action, data = {}) => {
    return {
        action,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ...data
    };
};

/**
 * Export signatures data for backend
 * @param {Array} signatures - Signature fields
 * @param {Array} completedSignatures - Completed signatures
 * @returns {Object} - Formatted export data
 */
export const exportSignaturesData = (signatures, completedSignatures) => {
    return {
        fields: signatures.map(sig => ({
            id: sig.id,
            position: sig.position,
            metadata: sig.metadata,
            type: sig.type
        })),
        signatures: completedSignatures.map(cs => ({
            fieldId: cs.fieldId,
            type: cs.signature.type,
            data: cs.signature.data,
            timestamp: cs.timestamp,
            font: cs.signature.font || null
        })),
        exportedAt: new Date().toISOString()
    };
};

/**
 * Validate signature data before submission
 * @param {Object} signatureData - Signature to validate
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export const validateSignature = (signatureData) => {
    if (!signatureData) {
        return { valid: false, error: 'No signature data provided' };
    }
    
    if (!signatureData.type || !['drawn', 'typed', 'uploaded'].includes(signatureData.type)) {
        return { valid: false, error: 'Invalid signature type' };
    }
    
    if (!signatureData.data) {
        return { valid: false, error: 'Signature data is empty' };
    }
    
    if (signatureData.type === 'typed' && !signatureData.font) {
        return { valid: false, error: 'Font not specified for typed signature' };
    }
    
    return { valid: true, error: null };
};

/**
 * Format timestamp for display
 * @param {string} isoString - ISO timestamp string
 * @returns {string} - Formatted date string
 */
export const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Generate unique document ID
 * @returns {string} - Unique ID
 */
export const generateDocumentId = () => {
    return `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if signature field overlaps with existing fields
 * @param {Object} newField - New field to check
 * @param {Array} existingFields - Existing signature fields
 * @returns {boolean} - True if overlaps
 */
export const checkFieldOverlap = (newField, existingFields) => {
    const FIELD_WIDTH = 200;
    const FIELD_HEIGHT = 60;
    const PADDING = 10;
    
    return existingFields.some(field => {
        const horizontalOverlap = 
            newField.position.x < field.position.x + FIELD_WIDTH + PADDING &&
            newField.position.x + FIELD_WIDTH + PADDING > field.position.x;
            
        const verticalOverlap =
            newField.position.y < field.position.y + FIELD_HEIGHT + PADDING &&
            newField.position.y + FIELD_HEIGHT + PADDING > field.position.y;
            
        return horizontalOverlap && verticalOverlap;
    });
};

// Export all utilities
export default {
    validatePDFFile,
    formatFileSize,
    canvasToBase64,
    resizeImage,
    validateEmail,
    generateSignatureMetadata,
    calculateFieldPosition,
    sortSignersByOrder,
    areAllSignaturesComplete,
    createAuditEntry,
    exportSignaturesData,
    validateSignature,
    formatTimestamp,
    generateDocumentId,
    checkFieldOverlap
};
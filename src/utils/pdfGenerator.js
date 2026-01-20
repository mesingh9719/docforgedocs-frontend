import { generatePdf as apiGeneratePdf } from '../api/documents';

/**
 * Returns the premium CSS styles for PDF generation.
 */
export const getPremiumPdfStyles = () => `
    /* Reset and Page Setup */
    * { box-sizing: border-box; }
    @page { margin: 40px 40px; }
    body { 
        font-family: 'Helvetica', 'Arial', sans-serif; 
        line-height: 1.5; 
        color: #1e293b; /* slate-800 */
        font-size: 10pt; 
        margin: 0; 
        padding: 0; 
    }

    /* Utilities */
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .text-justify { text-align: justify; }
    .uppercase { text-transform: uppercase; }
    .font-bold { font-weight: bold; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .italic { font-style: italic; }
    .tracking-wider { letter-spacing: 0.05em; }
    .tracking-widest { letter-spacing: 0.1em; }

    /* Text Sizes */
    .text-2xl { font-size: 24pt; line-height: 1.2; }
    .text-lg { font-size: 14pt; line-height: 1.3; }
    .text-base { font-size: 11pt; }
    .text-sm { font-size: 9pt; }
    .text-xs { font-size: 8pt; }

    /* Colors (Slate/Indigo/Emerald) */
    .text-slate-900 { color: #0f172a; }
    .text-slate-800 { color: #1e293b; }
    .text-slate-700 { color: #334155; }
    .text-slate-600 { color: #475569; }
    .text-slate-500 { color: #64748b; }
    .text-slate-400 { color: #94a3b8; }
    .text-slate-300 { color: #cbd5e1; }
    
    .text-white { color: #ffffff; }
    .text-indigo-700 { color: #4338ca; }
    .text-indigo-900 { color: #312e81; }
    .text-emerald-900 { color: #064e3b; }

    /* Backgrounds */
    .bg-white { background-color: #ffffff; }
    .bg-slate-50 { background-color: #f8fafc; }
    .bg-slate-100 { background-color: #f1f5f9; }
    .bg-slate-800 { background-color: #1e293b; }
    .bg-indigo-50 { background-color: #eef2ff; }
    .bg-emerald-50 { background-color: #ecfdf5; }

    /* Spacing Utilities */
    .p-1 { padding: 4px; }
    .p-2 { padding: 8px; }
    .p-3 { padding: 12px; }
    .p-4 { padding: 16px; }
    
    .px-1 { padding-left: 4px; padding-right: 4px; }
    .px-2 { padding-left: 8px; padding-right: 8px; }
    .px-3 { padding-left: 12px; padding-right: 12px; }
    
    .py-1 { padding-top: 4px; padding-bottom: 4px; }
    .py-2 { padding-top: 8px; padding-bottom: 8px; }

    .mt-1 { margin-top: 4px; }
    .mt-2 { margin-top: 8px; }
    .mt-4 { margin-top: 16px; }
    .mt-8 { margin-top: 32px; }
    .mt-auto { margin-top: auto; }

    .mb-1 { margin-bottom: 4px; }
    .mb-2 { margin-bottom: 8px; }
    .mb-4 { margin-bottom: 16px; }
    .mb-8 { margin-bottom: 32px; }
    .mb-12 { margin-bottom: 48px; }
    .mb-20 { margin-bottom: 80px; }

    /* Borders & Rounded */
    .rounded { border-radius: 4px; }
    .rounded-lg { border-radius: 8px; }
    .rounded-sm { border-radius: 2px; }
    
    .border { border: 1px solid #e2e8f0; }
    .border-b { border-bottom: 1px solid #e2e8f0; }
    .border-t { border-top: 1px solid #e2e8f0; }
    .border-b-2 { border-bottom: 2px solid #1e293b; } /* Thicker dark border for headers */
    .border-slate-100 { border-color: #f1f5f9; }
    .border-slate-200 { border-color: #e2e8f0; }
    .divide-y > tr > td { border-bottom: 1px solid #e2e8f0; }
    .divide-slate-200 > tr > td { border-color: #e2e8f0; }

    /* Layout Specifics */
    .w-full { width: 100%; }
    .w-12 { width: 3rem; }
    .w-20 { width: 5rem; }
    .w-24 { width: 6rem; }
    .w-32 { width: 8rem; }
    .max-w-250px { max-width: 250px; }

    /* Tables */
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; font-weight: bold; }
    td { vertical-align: top; }
    
    /* Footer */
    .footer {
        position: fixed;
        bottom: 0px;
        left: 0px;
        right: 0px;
        text-align: center;
        width: 100%;
        font-size: 9px;
        color: #cbd5e1;
        text-transform: uppercase;
        letter-spacing: 2px;
        padding-top: 10px;
    }
`;

/**
 * Wraps the document HTML with the full page structure and styles.
 * @param {string} contentHtml - The inner HTML of the document.
 * @param {string} title - Document title.
 */
export const wrapHtmlForPdf = (contentHtml, title, watermarkText = null) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>${title}</title>
            <style>
                ${getPremiumPdfStyles()}
            </style>
        </head>
        <body>
            ${watermarkText ? `<div class="watermark">${watermarkText}</div>` : ''}
            
            ${contentHtml}
            
            <div class="footer">
                <p>Powered by DocForge &bull; Confidential Document</p>
            </div>
        </body>
        </html>
    `;
};

/**
 * Orchestrates the PDF generation process.
 * @param {string|number} documentId 
 * @param {string} contentHtml 
 * @param {string} title 
 */
export const generateDocumentPdf = async (documentId, contentHtml, title, watermark = null) => {
    const fullHtml = wrapHtmlForPdf(contentHtml, title, watermark);
    return await apiGeneratePdf(documentId, fullHtml);
};

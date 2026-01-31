import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ConsultingAgreementDocumentPreview from '../pages/Dashboard/templates/ConsultingAgreementDocumentPreview';

/**
 * Generates the full HTML string for Consulting Agreement PDF generation.
 */
export const generateConsultingAgreementHtml = (formData, docContent, documentName = 'Document', signatures = [], businessLogo = null) => {
    // Render the React component to static HTML string
    const documentHtml = renderToStaticMarkup(
        <ConsultingAgreementDocumentPreview
            data={formData}
            content={docContent}
            zoom={1}
            printing={true}
            signatures={signatures}
            businessLogo={businessLogo}
        />
    );

    // Reuse print styles
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>${documentName}</title>
            <style>
                * { box-sizing: border-box; }
                body { 
                    font-family: 'Times New Roman', serif; 
                    line-height: 1.5; 
                    color: #333; 
                    font-size: 11pt; 
                    margin: 0; 
                    padding: 40px; 
                }
                .text-center { text-align: center; }
                .uppercase { text-transform: uppercase; }
                .font-bold { font-weight: bold; }
                .text-sm { font-size: 10pt; }
                .text-xs { font-size: 9pt; }
                .text-justify { text-align: justify; }
                .mb-2 { margin-bottom: 0.5rem; }
                .mb-4 { margin-bottom: 1rem; }
                .mb-6 { margin-bottom: 1.5rem; }
                .mb-8 { margin-bottom: 2rem; }
                .mb-10 { margin-bottom: 2.5rem; }
                .pb-2 { padding-bottom: 0.5rem; }
                .mt-12 { margin-top: 3rem; }
                .border-b { border-bottom: 1px solid #000; }
                .border-b-2 { border-bottom: 2px solid #000; }
                
                @page { margin: 40px; }
                
                h1 { 
                    font-size: 16pt; 
                    text-transform: uppercase; 
                    border-bottom: 2px solid #000; 
                    padding-bottom: 10px; 
                    margin-bottom: 30px; 
                    text-align: center; 
                    font-weight: bold; 
                    letter-spacing: 2px; 
                }
                p { margin-bottom: 12px; }
                
                table { width: 100%; border-collapse: collapse; }
                td { vertical-align: top; }
                
                .font-cursive { font-family: cursive; font-style: italic; }
            </style>
        </head>
        <body>
            ${documentHtml}
        </body>
    </html>
    `;
};

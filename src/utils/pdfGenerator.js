import { generatePdf as apiGeneratePdf } from '../api/documents';

/**
 * Returns PDF-safe CSS styles
 */
export const getPremiumPdfStyles = () => `
    /* ===============================
       RESET + PRINT SAFETY
    ================================ */
    * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    /* ===============================
       PAGE SETUP (CRITICAL)
    ================================ */
    @page {
        size: A4;
        margin: 15mm 12mm 22mm 12mm; /* bottom space reserved for footer */
    }

    body {
        font-family: Helvetica, Arial, sans-serif;
        font-size: 10pt;
        line-height: 1.5;
        color: #1e293b;
        margin: 0;
        padding: 0;
        min-height: 100%;
    }

    /* ===============================
       UTILITIES
    ================================ */
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .text-justify { text-align: justify; }

    .uppercase { text-transform: uppercase; }
    .italic { font-style: italic; }

    .font-bold { font-weight: bold; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }

    /* ===============================
       TEXT SIZES
    ================================ */
    .text-2xl { font-size: 24pt; line-height: 1.2; }
    .text-lg  { font-size: 14pt; }
    .text-base { font-size: 11pt; }
    .text-sm { font-size: 9pt; }
    .text-xs { font-size: 8pt; }

    /* ===============================
       COLORS
    ================================ */
    .text-slate-900 { color: #0f172a; }
    .text-slate-800 { color: #1e293b; }
    .text-slate-600 { color: #475569; }
    .text-slate-400 { color: #94a3b8; }

    .bg-slate-50 { background-color: #f8fafc; }
    .bg-slate-100 { background-color: #f1f5f9; }
    .bg-slate-800 { background-color: #1e293b; }

    /* ===============================
       SPACING
    ================================ */
    .p-1 { padding: 4px; }
    .p-2 { padding: 8px; }
    .p-3 { padding: 12px; }
    .p-4 { padding: 16px; }

    .mt-2 { margin-top: 8px; }
    .mt-4 { margin-top: 16px; }
    .mb-1 { margin-bottom: 4px; }
    .mb-2 { margin-bottom: 8px; }
    .mb-4 { margin-bottom: 16px; }
    .mb-6 { margin-bottom: 24px; }
    .mb-8 { margin-bottom: 32px; }
    .mb-10 { margin-bottom: 40px; }
    .mb-12 { margin-bottom: 48px; }
    .mb-20 { margin-bottom: 80px; }

    /* ===============================
       BORDERS
    ================================ */
    .rounded { border-radius: 4px; }
    .border { border: 1px solid #e2e8f0; }
    .border-b { border-bottom: 1px solid #e2e8f0; }
    .border-b-2 { border-bottom: 2px solid #1e293b; }

    /* ===============================
       TABLES (PDF SAFE)
    ================================ */
    table {
        width: 100%;
        border-collapse: collapse;
        page-break-inside: auto;
    }

    thead {
        display: table-header-group;
    }

    tr {
        page-break-inside: avoid;
    }

    th {
        text-align: left;
        font-weight: bold;
    }

    td {
        vertical-align: top;
    }

    /* ===============================
       PAGE BREAK HELPERS
    ================================ */
    .page-break {
        page-break-before: always;
    }

    .avoid-break {
        page-break-inside: avoid;
    }

    /* ===============================
       WATERMARK
    ================================ */
    .watermark {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-30deg);
        font-size: 60pt;
        color: rgba(15, 23, 42, 0.08);
        z-index: -1;
        pointer-events: none;
        user-select: none;
        white-space: nowrap;
    }

    /* ===============================
       FOOTER
    ================================ */
    .footer {
        position: fixed;
        bottom: 8mm;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 9pt;
        color: #94a3b8;
        letter-spacing: 2px;
        text-transform: uppercase;
    }
`;

/**
 * Wrap HTML for PDF
 */
export const wrapHtmlForPdf = (contentHtml, title, watermarkText = null) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
        ${getPremiumPdfStyles()}
    </style>
</head>
<body>
    ${watermarkText ? `<div class="watermark">${watermarkText}</div>` : ''}

    ${contentHtml}

    <div class="footer">POWERED BY DOCFORGE</div>
</body>
</html>
`;
};

/**
 * Generate PDF
 */
export const generateDocumentPdf = async (
    documentId,
    contentHtml,
    title,
    watermark = null
) => {
    const fullHtml = wrapHtmlForPdf(contentHtml, title, watermark);
    return apiGeneratePdf(documentId, fullHtml);
};

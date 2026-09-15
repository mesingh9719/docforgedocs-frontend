import { resolveVariables, resolveBlocks } from './variableResolver';
import { getSampleContext } from './variableRegistry';
import { wrapHtmlForPdf } from './pdfGenerator';

/**
 * Compiles an individual block into PDF-safe HTML with inline CSS.
 */
export const compileBlockToHtml = (block, context = {}, businessData = null) => {
    if (!block) return '';

    const type = (block.type || '').toUpperCase().replace(/-/g, '_');
    const data = block.data || block.content || {};

    const resolve = (str) => {
        if (!str || typeof str !== 'string') return str || '';
        return resolveVariables(str, context);
    };

    switch (type) {
        case 'HEADING': {
            const text = resolve(data.text || 'Heading');
            const level = data.level || 1;
            const align = data.align || 'left';
            const sizeMap = { 1: '20pt', 2: '16pt', 3: '14pt', 4: '12pt' };
            const fontSize = sizeMap[level] || '18pt';
            const color = data.color || '#0f172a';

            return `
                <h${level} style="margin: 18px 0 10px 0; font-size: ${fontSize}; font-weight: 700; color: ${color}; text-align: ${align}; line-height: 1.25; font-family: inherit;">
                    ${text}
                </h${level}>
            `;
        }

        case 'TEXT':
        case 'PARAGRAPH':
        case 'RICH_TEXT': {
            const rawText = data.text || '';
            const text = resolve(rawText);
            const align = data.align || 'left';
            const color = data.color || '#334155';
            const fontSize = data.fontSize ? `${data.fontSize}pt` : '10pt';
            const formatted = text.replace(/\n/g, '<br/>');

            return `
                <div style="margin: 10px 0; font-size: ${fontSize}; line-height: 1.6; color: ${color}; text-align: ${align}; font-family: inherit;">
                    ${formatted}
                </div>
            `;
        }

        case 'IMAGE': {
            const src = data.url || data.src || '';
            if (!src) return '';
            const width = data.width || 200;
            const align = data.align || 'left';
            const alignStyle = align === 'center' ? 'text-align: center;' : align === 'right' ? 'text-align: right;' : 'text-align: left;';

            return `
                <div style="margin: 14px 0; ${alignStyle}">
                    <img src="${src}" alt="${data.alt || 'Document Image'}" style="max-width: 100%; width: ${width}px; height: auto; border-radius: 4px;" />
                </div>
            `;
        }

        case 'LOGO': {
            const logoUrl = data.url || (businessData && businessData.logo_url) || '';
            const width = data.width || 120;
            const align = data.align || 'left';
            const alignStyle = align === 'center' ? 'text-align: center;' : align === 'right' ? 'text-align: right;' : 'text-align: left;';

            if (!logoUrl) {
                const companyName = resolve(data.companyName || (businessData && businessData.name) || 'COMPANY LOGO');
                return `
                    <div style="margin: 14px 0; ${alignStyle}">
                        <div style="display: inline-block; padding: 8px 16px; background-color: #f1f5f9; border: 1px dashed #cbd5e1; border-radius: 6px; font-weight: 700; color: #475569; font-size: 11pt;">
                            ${companyName}
                        </div>
                    </div>
                `;
            }

            return `
                <div style="margin: 14px 0; ${alignStyle}">
                    <img src="${logoUrl}" alt="Company Logo" style="width: ${width}px; height: auto; max-height: 80px; object-fit: contain;" />
                </div>
            `;
        }

        case 'BUSINESS_INFO':
        case 'COMPANY_INFORMATION': {
            const companyName = resolve(data.name || (businessData && businessData.name) || '{{company.name}}');
            const address = resolve(data.address || (businessData && businessData.address) || '{{company.address}}');
            const email = resolve(data.email || (businessData && businessData.email) || '{{company.email}}');
            const phone = resolve(data.phone || (businessData && businessData.phone) || '{{company.phone}}');
            const taxId = resolve(data.taxId || (businessData && businessData.tax_id) || '');
            const align = data.align || 'left';

            return `
                <div style="margin: 14px 0; text-align: ${align}; font-size: 9.5pt; color: #475569; line-height: 1.5;">
                    <div style="font-weight: 700; font-size: 11.5pt; color: #0f172a; margin-bottom: 2px;">${companyName}</div>
                    ${address ? `<div>${address}</div>` : ''}
                    ${email || phone ? `<div>${[email, phone].filter(Boolean).join(' • ')}</div>` : ''}
                    ${taxId ? `<div style="font-size: 8.5pt; color: #64748b;">Tax ID / GSTIN: ${taxId}</div>` : ''}
                </div>
            `;
        }

        case 'CLIENT_INFO':
        case 'CUSTOMER_INFORMATION': {
            const label = resolve(data.label || 'PREPARED FOR:');
            const clientName = resolve(data.clientName || '{{client.name}}');
            const companyName = resolve(data.companyName || '{{client.company}}');
            const email = resolve(data.clientEmail || '{{client.email}}');
            const phone = resolve(data.clientPhone || '{{client.phone}}');
            const address = resolve(data.clientAddress || '{{client.address}}');

            return `
                <div style="margin: 16px 0; padding: 14px 18px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="font-size: 8pt; font-weight: 700; letter-spacing: 1px; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">
                        ${label}
                    </div>
                    <div style="font-size: 12pt; font-weight: 700; color: #0f172a;">${clientName}</div>
                    ${companyName ? `<div style="font-size: 10pt; font-weight: 600; color: #334155; margin-top: 1px;">${companyName}</div>` : ''}
                    ${address ? `<div style="font-size: 9.5pt; color: #475569; margin-top: 4px;">${address}</div>` : ''}
                    ${email || phone ? `<div style="font-size: 9pt; color: #64748b; margin-top: 2px;">${[email, phone].filter(Boolean).join(' • ')}</div>` : ''}
                </div>
            `;
        }

        case 'DYNAMIC_TABLE':
        case 'TABLE':
        case 'LINE_ITEMS': {
            const title = resolve(data.title || '');
            const currency = data.currency || '$';
            const taxRate = parseFloat(data.taxRate || 0);
            const discountRate = parseFloat(data.discountRate || 0);
            const showTotals = data.showTotals !== false;

            const columns = data.columns && data.columns.length > 0 ? data.columns : [
                { key: 'description', label: 'Item & Description', type: 'text', width: '50%' },
                { key: 'quantity', label: 'Qty', type: 'number', width: '15%' },
                { key: 'rate', label: 'Rate', type: 'currency', width: '15%' },
                { key: 'total', label: 'Amount', type: 'calculated', width: '20%' },
            ];

            const rows = data.rows && data.rows.length > 0 ? data.rows : [
                { description: 'Service Item', quantity: 1, rate: 100 },
            ];

            const calculateRowTotal = (row) => {
                const qty = parseFloat(row.quantity) || 0;
                const rate = parseFloat(row.rate) || 0;
                return qty * rate;
            };

            const subtotal = rows.reduce((acc, row) => acc + calculateRowTotal(row), 0);
            const discountAmount = (subtotal * discountRate) / 100;
            const taxableAmount = subtotal - discountAmount;
            const taxAmount = (taxableAmount * taxRate) / 100;
            const grandTotal = taxableAmount + taxAmount;

            const theadHtml = columns.map(col => {
                const isNum = col.type === 'number' || col.type === 'currency' || col.type === 'calculated';
                return `<th style="padding: 10px 14px; background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; text-align: ${isNum ? 'right' : 'left'}; width: ${col.width || 'auto'};">${col.label}</th>`;
            }).join('');

            const tbodyHtml = rows.map((row, idx) => {
                const rowTotal = calculateRowTotal(row);
                const bg = idx % 2 === 1 ? 'background-color: #fafafa;' : '';
                const tds = columns.map(col => {
                    if (col.type === 'calculated') {
                        return `<td style="padding: 10px 14px; text-align: right; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${currency}${rowTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>`;
                    }
                    if (col.type === 'number') {
                        const val = parseFloat(row[col.key]) || 0;
                        return `<td style="padding: 10px 14px; text-align: right; color: #334155; border-bottom: 1px solid #f1f5f9;">${val}</td>`;
                    }
                    if (col.type === 'currency') {
                        const val = parseFloat(row[col.key]) || 0;
                        return `<td style="padding: 10px 14px; text-align: right; color: #334155; border-bottom: 1px solid #f1f5f9;">${currency}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>`;
                    }
                    const textVal = resolve(String(row[col.key] || ''));
                    return `<td style="padding: 10px 14px; text-align: left; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${textVal}</td>`;
                }).join('');

                return `<tr style="${bg}">${tds}</tr>`;
            }).join('');

            let totalsHtml = '';
            if (showTotals) {
                totalsHtml = `
                    <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
                        <table style="width: 260px; margin-left: auto; border-collapse: collapse; font-size: 9.5pt;">
                            <tr>
                                <td style="padding: 4px 8px; color: #64748b;">Subtotal:</td>
                                <td style="padding: 4px 8px; text-align: right; font-weight: 600; color: #0f172a;">${currency}${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                            ${discountRate > 0 ? `
                            <tr>
                                <td style="padding: 4px 8px; color: #64748b;">Discount (${discountRate}%):</td>
                                <td style="padding: 4px 8px; text-align: right; font-weight: 600; color: #e11d48;">-${currency}${discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>` : ''}
                            ${taxRate > 0 ? `
                            <tr>
                                <td style="padding: 4px 8px; color: #64748b;">Tax (${taxRate}%):</td>
                                <td style="padding: 4px 8px; text-align: right; font-weight: 600; color: #0f172a;">${currency}${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>` : ''}
                            <tr style="border-top: 2px solid #0f172a;">
                                <td style="padding: 8px 8px 4px 8px; font-size: 11pt; font-weight: 700; color: #0f172a;">Total:</td>
                                <td style="padding: 8px 8px 4px 8px; text-align: right; font-size: 12pt; font-weight: 800; color: #4338ca;">${currency}${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                        </table>
                    </div>
                `;
            }

            return `
                <div style="margin: 18px 0;">
                    ${title ? `<div style="font-size: 9pt; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: #475569; margin-bottom: 8px;">${title}</div>` : ''}
                    <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
                        <thead><tr>${theadHtml}</tr></thead>
                        <tbody>${tbodyHtml}</tbody>
                    </table>
                    ${totalsHtml}
                </div>
            `;
        }

        case 'TOTALS':
        case 'TAX_SUMMARY': {
            const currency = data.currency || '$';
            const subtotal = parseFloat(data.subtotal || 0);
            const taxRate = parseFloat(data.taxRate || 0);
            const discount = parseFloat(data.discount || 0);
            const shipping = parseFloat(data.shipping || 0);
            const notes = resolve(data.notes || '');

            const taxAmount = (subtotal * taxRate) / 100;
            const grandTotal = Math.max(0, subtotal - discount + taxAmount + shipping);

            return `
                <div style="margin: 18px 0; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="vertical-align: top; width: 55%; padding-right: 20px;">
                                ${notes ? `
                                    <div style="font-size: 8pt; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Terms & Notes</div>
                                    <div style="font-size: 9pt; color: #475569; line-height: 1.5;">${notes}</div>
                                ` : ''}
                            </td>
                            <td style="vertical-align: top; width: 45%;">
                                <table style="width: 100%; border-collapse: collapse; font-size: 9.5pt;">
                                    <tr>
                                        <td style="padding: 3px 0; color: #64748b;">Subtotal:</td>
                                        <td style="padding: 3px 0; text-align: right; font-weight: 600; color: #0f172a;">${currency}${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>
                                    ${discount > 0 ? `
                                    <tr>
                                        <td style="padding: 3px 0; color: #64748b;">Discount:</td>
                                        <td style="padding: 3px 0; text-align: right; font-weight: 600; color: #e11d48;">-${currency}${discount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>` : ''}
                                    ${taxAmount > 0 ? `
                                    <tr>
                                        <td style="padding: 3px 0; color: #64748b;">Tax (${taxRate}%):</td>
                                        <td style="padding: 3px 0; text-align: right; font-weight: 600; color: #0f172a;">${currency}${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>` : ''}
                                    ${shipping > 0 ? `
                                    <tr>
                                        <td style="padding: 3px 0; color: #64748b;">Shipping:</td>
                                        <td style="padding: 3px 0; text-align: right; font-weight: 600; color: #0f172a;">${currency}${shipping.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>` : ''}
                                    <tr style="border-top: 2px solid #0f172a;">
                                        <td style="padding: 8px 0 2px 0; font-size: 11pt; font-weight: 700; color: #0f172a;">Amount Due:</td>
                                        <td style="padding: 8px 0 2px 0; text-align: right; font-size: 13pt; font-weight: 800; color: #4338ca;">${currency}${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            `;
        }

        case 'CALLOUT': {
            const title = resolve(data.title || 'Note');
            const text = resolve(data.text || '');
            const theme = data.theme || 'info';

            const themes = {
                info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', title: '#1e3a8a' },
                warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', title: '#78350f' },
                success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', title: '#14532d' },
                neutral: { bg: '#f8fafc', border: '#e2e8f0', text: '#334155', title: '#0f172a' },
            };

            const t = themes[theme] || themes.info;

            return `
                <div style="margin: 14px 0; padding: 14px 18px; background-color: ${t.bg}; border-left: 4px solid ${t.border}; border-top: 1px solid ${t.border}; border-right: 1px solid ${t.border}; border-bottom: 1px solid ${t.border}; border-radius: 6px;">
                    ${title ? `<div style="font-weight: 700; font-size: 10pt; color: ${t.title}; margin-bottom: 4px;">${title}</div>` : ''}
                    <div style="font-size: 9.5pt; color: ${t.text}; line-height: 1.5;">${text.replace(/\n/g, '<br/>')}</div>
                </div>
            `;
        }

        case 'DIVIDER': {
            const thickness = data.thickness || 1;
            const color = data.color || '#e2e8f0';
            const marginY = data.marginY || 16;
            const style = data.style || 'solid';

            return `
                <hr style="border: 0; border-top: ${thickness}px ${style} ${color}; margin: ${marginY}px 0;" />
            `;
        }

        case 'SPACER': {
            const height = data.height || 24;
            return `<div style="height: ${height}px; font-size: 0; line-height: 0;">&nbsp;</div>`;
        }

        case 'COLUMNS':
        case 'GRID': {
            const leftTitle = resolve(data.leftTitle || 'Provider');
            const leftText = resolve(data.leftText || '');
            const rightTitle = resolve(data.rightTitle || 'Recipient');
            const rightText = resolve(data.rightText || '');

            return `
                <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                    <tr>
                        <td style="width: 48%; vertical-align: top; padding: 12px 14px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
                            <div style="font-size: 8pt; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">${leftTitle}</div>
                            <div style="font-size: 9.5pt; color: #1e293b; line-height: 1.5;">${leftText.replace(/\n/g, '<br/>')}</div>
                        </td>
                        <td style="width: 4%;"></td>
                        <td style="width: 48%; vertical-align: top; padding: 12px 14px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
                            <div style="font-size: 8pt; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">${rightTitle}</div>
                            <div style="font-size: 9.5pt; color: #1e293b; line-height: 1.5;">${rightText.replace(/\n/g, '<br/>')}</div>
                        </td>
                    </tr>
                </table>
            `;
        }

        case 'SECTION': {
            const title = resolve(data.title || 'Section');
            const subtitle = resolve(data.subtitle || '');

            return `
                <div style="margin: 20px 0 10px 0; padding-bottom: 8px; border-bottom: 2px solid #0f172a;">
                    <div style="font-size: 14pt; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">${title}</div>
                    ${subtitle ? `<div style="font-size: 9pt; color: #64748b; margin-top: 2px;">${subtitle}</div>` : ''}
                </div>
            `;
        }

        case 'SIGNATURE': {
            const signee = resolve(data.signee || 'Authorized Signatory');
            const showDate = data.showDate !== false;

            return `
                <div style="margin: 30px 0 10px 0; page-break-inside: avoid;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="width: 45%; vertical-align: bottom;">
                                <div style="border-bottom: 1.5px solid #0f172a; height: 45px; margin-bottom: 6px;"></div>
                                <div style="font-size: 9pt; font-weight: 700; color: #0f172a;">${signee}</div>
                                <div style="font-size: 8pt; color: #64748b;">Signature & Date</div>
                            </td>
                            <td style="width: 10%;"></td>
                            <td style="width: 45%; vertical-align: bottom;">
                                ${showDate ? `
                                    <div style="border-bottom: 1.5px solid #0f172a; height: 45px; margin-bottom: 6px;"></div>
                                    <div style="font-size: 9pt; font-weight: 700; color: #0f172a;">Date Signed</div>
                                    <div style="font-size: 8pt; color: #64748b;">DD / MM / YYYY</div>
                                ` : ''}
                            </td>
                        </tr>
                    </table>
                </div>
            `;
        }

        default:
            return '';
    }
};

/**
 * Compiles a full document definition (blocks + pageSettings + variables + metadata) into print-ready HTML for PDF rendering.
 */
export const compileDocumentToPdfHtml = (documentState, businessData = null, watermark = null) => {
    const blocks = documentState.blocks || [];
    const variables = documentState.variables || {};
    const metadata = documentState.metadata || {};
    const pageSettings = documentState.pageSettings || {};

    const context = getSampleContext(businessData, variables);
    const resolvedBlocks = resolveBlocks(blocks, context);

    const title = metadata.title || 'Document';
    const fontFamily = pageSettings.fontFamily || 'Helvetica, Arial, sans-serif';

    const blocksHtml = resolvedBlocks
        .map((block) => compileBlockToHtml(block, context, businessData))
        .join('\n');

    const contentHtml = `
        <div style="font-family: ${fontFamily}; color: #1e293b; max-width: 100%;">
            ${blocksHtml}
        </div>
    `;

    return wrapHtmlForPdf(contentHtml, title, watermark);
};

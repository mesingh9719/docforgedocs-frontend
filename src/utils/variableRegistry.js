/**
 * Extensible Variable Registry for Document Templates
 * Standardizes namespaces across Company, Customer/Client, Document, Invoicing, Proposals, Legal, and Custom categories.
 */

// Internal registry storage
const registry = {
    namespaces: {},
    variables: {},
};

/**
 * Register a namespace with metadata.
 */
export const registerNamespace = (id, metadata) => {
    registry.namespaces[id] = {
        id,
        label: metadata.label || id,
        description: metadata.description || '',
        icon: metadata.icon || null,
        order: metadata.order || 100,
    };
};

/**
 * Register a variable in the registry.
 */
export const registerVariable = (key, metadata) => {
    const parts = key.split('.');
    const namespace = parts.length > 1 ? parts[0] : 'general';

    registry.variables[key] = {
        key,
        namespace,
        label: metadata.label || key,
        description: metadata.description || '',
        type: metadata.type || 'string', // 'string' | 'number' | 'currency' | 'date' | 'boolean' | 'array' | 'object'
        sampleValue: metadata.sampleValue ?? '',
        fallback: metadata.fallback ?? '',
        category: metadata.category || namespace,
        format: metadata.format || null,
    };
};

/**
 * Initialize standard built-in namespaces and variables.
 */
const initStandardRegistry = () => {
    // 1. Company / Provider Namespace
    registerNamespace('company', {
        label: 'Company & Sender',
        description: 'Information about your business, sender profile, and branding',
        order: 1,
    });

    registerVariable('company.name', { label: 'Company Name', category: 'company', sampleValue: 'TechSynchronic Solutions Inc.' });
    registerVariable('company.legal_name', { label: 'Legal Entity Name', category: 'company', sampleValue: 'TechSynchronic Solutions Corporation' });
    registerVariable('company.logo', { label: 'Company Logo URL', category: 'company', sampleValue: '/images/logo.png', type: 'string' });
    registerVariable('company.email', { label: 'Company Email', category: 'company', sampleValue: 'billing@techsynchronic.com' });
    registerVariable('company.phone', { label: 'Company Phone', category: 'company', sampleValue: '+1 (555) 234-5678' });
    registerVariable('company.website', { label: 'Company Website', category: 'company', sampleValue: 'https://techsynchronic.com' });
    registerVariable('company.address', { label: 'Company Street Address', category: 'company', sampleValue: '100 Innovation Blvd, Suite 400' });
    registerVariable('company.city', { label: 'Company City', category: 'company', sampleValue: 'San Francisco' });
    registerVariable('company.state', { label: 'Company State', category: 'company', sampleValue: 'CA' });
    registerVariable('company.zip', { label: 'Company ZIP / Postal Code', category: 'company', sampleValue: '94105' });
    registerVariable('company.country', { label: 'Company Country', category: 'company', sampleValue: 'United States' });
    registerVariable('company.tax_id', { label: 'Tax ID / VAT / GST Number', category: 'company', sampleValue: 'US-987654321' });

    // 2. Client / Customer / Recipient Namespace
    registerNamespace('client', {
        label: 'Client & Recipient',
        description: 'Customer, client, or recipient profile and contact information',
        order: 2,
    });

    registerVariable('client.name', { label: 'Client Full Name', category: 'client', sampleValue: 'Alex Morgan' });
    registerVariable('client.company', { label: 'Client Company Name', category: 'client', sampleValue: 'Global Innovations Corp.' });
    registerVariable('client.title', { label: 'Client Job Title', category: 'client', sampleValue: 'VP of Operations' });
    registerVariable('client.email', { label: 'Client Email', category: 'client', sampleValue: 'alex.morgan@globalinnovations.com' });
    registerVariable('client.phone', { label: 'Client Phone', category: 'client', sampleValue: '+1 (555) 876-5432' });
    registerVariable('client.address', { label: 'Client Street Address', category: 'client', sampleValue: '450 Market Street, Floor 12' });
    registerVariable('client.city', { label: 'Client City', category: 'client', sampleValue: 'New York' });
    registerVariable('client.state', { label: 'Client State', category: 'client', sampleValue: 'NY' });
    registerVariable('client.zip', { label: 'Client ZIP / Postal Code', category: 'client', sampleValue: '10001' });
    registerVariable('client.country', { label: 'Client Country', category: 'client', sampleValue: 'United States' });
    registerVariable('client.tax_id', { label: 'Client Tax ID / VAT Number', category: 'client', sampleValue: 'NY-123456789' });

    // 3. Document Metadata Namespace
    registerNamespace('document', {
        label: 'Document Details',
        description: 'Document identifiers, issue dates, and status codes',
        order: 3,
    });

    registerVariable('document.number', { label: 'Document Number', category: 'document', sampleValue: 'DOC-2026-0841' });
    registerVariable('document.title', { label: 'Document Title', category: 'document', sampleValue: 'Service Level & Implementation Contract' });
    registerVariable('document.date', { label: 'Issue Date', category: 'document', type: 'date', sampleValue: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) });
    registerVariable('document.due_date', { label: 'Due / Expiry Date', category: 'document', type: 'date', sampleValue: new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) });
    registerVariable('document.status', { label: 'Document Status', category: 'document', sampleValue: 'Active' });

    // 4. Invoicing & Billing Namespace
    registerNamespace('invoice', {
        label: 'Invoicing & Billing',
        description: 'Line items, rates, taxes, discounts, and payable amounts',
        order: 4,
    });

    registerVariable('invoice.number', { label: 'Invoice Number', category: 'invoice', sampleValue: 'INV-2026-1049' });
    registerVariable('invoice.currency', { label: 'Currency Symbol', category: 'invoice', sampleValue: '$' });
    registerVariable('invoice.subtotal', { label: 'Subtotal Amount', category: 'invoice', type: 'currency', sampleValue: '$4,000.00' });
    registerVariable('invoice.tax_rate', { label: 'Tax Rate (%)', category: 'invoice', type: 'number', sampleValue: '10%' });
    registerVariable('invoice.tax_amount', { label: 'Tax Total Amount', category: 'invoice', type: 'currency', sampleValue: '$400.00' });
    registerVariable('invoice.discount', { label: 'Discount Amount', category: 'invoice', type: 'currency', sampleValue: '$0.00' });
    registerVariable('invoice.total', { label: 'Grand Total Amount', category: 'invoice', type: 'currency', sampleValue: '$4,400.00' });
    registerVariable('invoice.payment_terms', { label: 'Payment Terms', category: 'invoice', sampleValue: 'Net 30 Days' });
    registerVariable('invoice.notes', { label: 'Invoice Notes', category: 'invoice', sampleValue: 'Thank you for your business! Direct bank transfer details on reverse.' });

    // 5. Proposal & Contracts Namespace
    registerNamespace('proposal', {
        label: 'Proposal & Scope',
        description: 'Proposal scope, timeline, and validities',
        order: 5,
    });

    registerVariable('proposal.title', { label: 'Proposal Subject', category: 'proposal', sampleValue: 'Enterprise Cloud Architecture Transformation' });
    registerVariable('proposal.valid_until', { label: 'Proposal Valid Until', category: 'proposal', type: 'date', sampleValue: new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) });
    registerVariable('proposal.total_value', { label: 'Total Proposal Value', category: 'proposal', type: 'currency', sampleValue: '$18,500.00' });

    // 6. HR & Employment Namespace
    registerNamespace('offer', {
        label: 'HR & Hiring',
        description: 'Candidate offer letters, job titles, salary, and start dates',
        order: 6,
    });

    registerVariable('offer.candidate_name', { label: 'Candidate Name', category: 'offer', sampleValue: 'Jordan Lee' });
    registerVariable('offer.position', { label: 'Job Title / Position', category: 'offer', sampleValue: 'Senior Full-Stack Engineer' });
    registerVariable('offer.department', { label: 'Department', category: 'offer', sampleValue: 'Engineering & Product' });
    registerVariable('offer.start_date', { label: 'Start Date', category: 'offer', type: 'date', sampleValue: 'October 1, 2026' });
    registerVariable('offer.salary', { label: 'Annual Salary', category: 'offer', type: 'currency', sampleValue: '$145,000 / year' });
    registerVariable('offer.manager_name', { label: 'Reporting Manager', category: 'offer', sampleValue: 'David Miller' });

    // 7. Legal & NDA Namespace
    registerNamespace('nda', {
        label: 'Legal & NDAs',
        description: 'Parties, jurisdiction, confidentiality terms, and dates',
        order: 7,
    });

    registerVariable('nda.disclosing_party', { label: 'Disclosing Party', category: 'nda', sampleValue: 'TechSynchronic Solutions Inc.' });
    registerVariable('nda.receiving_party', { label: 'Receiving Party', category: 'nda', sampleValue: 'Global Innovations Corp.' });
    registerVariable('nda.effective_date', { label: 'Effective Date', category: 'nda', type: 'date', sampleValue: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) });
    registerVariable('nda.jurisdiction', { label: 'Governing Jurisdiction', category: 'nda', sampleValue: 'State of Delaware, United States' });
    registerVariable('nda.term_duration', { label: 'Confidentiality Term', category: 'nda', sampleValue: '2 Years' });
};

// Initialize default registry
initStandardRegistry();

/**
 * Get all registered namespaces.
 */
export const getNamespaces = () => {
    return Object.values(registry.namespaces).sort((a, b) => a.order - b.order);
};

/**
 * Get all registered variables, optionally merged with template-specific custom variables.
 */
export const getAllVariables = (customVariables = {}) => {
    const all = { ...registry.variables };

    if (customVariables && typeof customVariables === 'object') {
        Object.entries(customVariables).forEach(([key, config]) => {
            const safeKey = key.startsWith('custom.') ? key : `custom.${key}`;
            all[safeKey] = {
                key: safeKey,
                namespace: 'custom',
                label: config.label || key,
                description: config.description || 'Custom template variable',
                type: config.type || 'string',
                sampleValue: config.value ?? config.sampleValue ?? '',
                category: 'custom',
            };
        });
    }

    return all;
};

/**
 * Get variables grouped by namespace/category.
 */
export const getVariablesByCategory = (customVariables = {}) => {
    const vars = getAllVariables(customVariables);
    const groups = {};

    Object.values(vars).forEach((v) => {
        const cat = v.category || v.namespace || 'general';
        if (!groups[cat]) {
            groups[cat] = [];
        }
        groups[cat].push(v);
    });

    return groups;
};

/**
 * Generate a comprehensive sample context dictionary from current business data + realistic mock data.
 */
export const getSampleContext = (businessData = null, customVariables = {}) => {
    const companyName = businessData?.name || 'TechSynchronic Solutions Inc.';
    const companyEmail = businessData?.email || 'billing@techsynchronic.com';
    const companyPhone = businessData?.phone || '+1 (555) 234-5678';
    const companyAddress = businessData?.address || '100 Innovation Blvd, Suite 400';
    const companyCity = businessData?.city || 'San Francisco';
    const companyState = businessData?.state || 'CA';
    const companyZip = businessData?.zip || '94105';
    const companyCountry = businessData?.country || 'United States';
    const companyTaxId = businessData?.tax_id || (businessData?.tax_percentage ? `${businessData.tax_label || 'TAX'}-${businessData.tax_percentage}%` : 'US-987654321');

    const context = {
        company: {
            name: companyName,
            legal_name: `${companyName} LLC`,
            logo: businessData?.logo ? `${import.meta.env.VITE_API_URL}/storage/${businessData.logo}` : '',
            email: companyEmail,
            phone: companyPhone,
            website: businessData?.website || 'https://techsynchronic.com',
            address: companyAddress,
            city: companyCity,
            state: companyState,
            zip: companyZip,
            country: companyCountry,
            tax_id: companyTaxId,
        },
        client: {
            name: 'Alex Morgan',
            company: 'Global Innovations Corp.',
            title: 'VP of Operations',
            email: 'alex.morgan@globalinnovations.com',
            phone: '+1 (555) 876-5432',
            address: '450 Market Street, Floor 12',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'United States',
            tax_id: 'NY-123456789',
        },
        customer: {
            name: 'Alex Morgan',
            company: 'Global Innovations Corp.',
            email: 'alex.morgan@globalinnovations.com',
            phone: '+1 (555) 876-5432',
            address: '450 Market Street, Floor 12',
        },
        document: {
            number: 'DOC-2026-0841',
            title: 'Service Agreement',
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            due_date: new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            status: 'Active',
        },
        invoice: {
            number: 'INV-2026-1049',
            currency: '$',
            subtotal: 4000,
            tax_rate: 10,
            tax_amount: 400,
            discount: 0,
            total: 4400,
            payment_terms: 'Net 30 Days',
            notes: 'Payment is due within 30 days of invoice date.',
        },
        proposal: {
            title: 'Enterprise Transformation Strategy',
            client_name: 'Alex Morgan',
            valid_until: new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            total_value: '$18,500.00',
        },
        offer: {
            candidate_name: 'Jordan Lee',
            position: 'Senior Full-Stack Engineer',
            department: 'Engineering & Product',
            start_date: 'October 1, 2026',
            salary: '$145,000 / year',
            manager_name: 'David Miller',
        },
        nda: {
            disclosing_party: companyName,
            receiving_party: 'Global Innovations Corp.',
            effective_date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            jurisdiction: 'State of Delaware, United States',
            term_duration: '2 Years',
        },
        custom: {},
    };

    // Populate flat aliases for compatibility (e.g. {{client_name}}, {{company_name}})
    context.client_name = context.client.name;
    context.client_company = context.client.company;
    context.client_email = context.client.email;
    context.client_phone = context.client.phone;
    context.client_address = context.client.address;

    context.company_name = context.company.name;
    context.company_email = context.company.email;
    context.company_phone = context.company.phone;
    context.company_address = context.company.address;

    context.invoice_number = context.invoice.number;
    context.invoice_total = context.invoice.total;
    context.invoice_subtotal = context.invoice.subtotal;

    // Merge custom variables
    if (customVariables && typeof customVariables === 'object') {
        Object.entries(customVariables).forEach(([k, v]) => {
            const rawVal = v.value !== undefined ? v.value : v;
            context.custom[k] = rawVal;
            context[k] = rawVal;
        });
    }

    return context;
};

export const defaultContent = {
    title: "Employment Offer Letter",
    preamble: "{{effectiveDateDay}} {{effectiveDateMonth}}, 20{{effectiveDateYear}}",
    partiesDisclosing: "To,\n{{candidateName}}\n{{candidateAddress}}",
    partiesReceiving: "", // Not used in standard letter format
    partiesFooter: "Dear {{candidateName}},",

    // Dynamic Sections Array
    sections: [
        {
            id: '1',
            title: 'Welcome',
            content: "We are pleased to offer you the position of {{position}} at {{employerName}} (\"Company\"). We believe your skills and experience are an excellent match for our company."
        },
        {
            id: '2',
            title: 'Position and Duties',
            content: "You will be working as {{position}}, reporting to {{managerName}}. Your start date will be {{startDate}}. Your primary duties will be those consistent with this position and as assigned by your manager."
        },
        {
            id: '3',
            title: 'Compensation',
            content: "Your starting salary will be {{salary}} per year, payable in accordance with the Company's standard payroll schedule. This salary is subject to adjustment pursuant to the Company's employee compensation policies."
        },
        {
            id: '4',
            title: 'Benefits',
            content: "You will be eligible to participate in the Company's standard employee benefit plans, including health insurance, vacation, and 401(k), provided to employees at your level."
        },
        {
            id: '5',
            title: 'At-Will Employment',
            content: "Your employment with the Company is for no specified period and constitutes \"at-will\" employment. This means that either you or the Company may terminate the employment relationship at any time, with or without cause or notice."
        },
        {
            id: '6',
            title: 'Acceptance',
            content: "To accept this offer, please sign and date this letter below and return it to us by {{expirationDate}}."
        }
    ]
};

export const defaultFormData = {
    effectiveDateDay: '',
    effectiveDateMonth: '',
    effectiveDateYear: '',

    // Branding
    logoSize: 80,
    logoAlignment: 'left', // Letters usually have logo top-left
    brandingEnabled: true,

    employerName: '',
    employerAddress: '',
    candidateName: '',
    candidateAddress: '',

    position: '',
    managerName: '',
    startDate: '',
    salary: '',
    expirationDate: '',

    employerSignatoryName: '',
    employerSignatoryTitle: '',

    // For letter format, candidate usually just signs
    candidateSignatoryName: ''
};

export const defaultContent = {
    title: "Non-Disclosure Agreement",
    preamble: "This Non-Disclosure Agreement (“Agreement”) is made and entered into on this {{effectiveDateDay}} day of {{effectiveDateMonth}}, 20{{effectiveDateYear}} (“Effective Date”),",
    partiesDisclosing: "{{disclosingPartyName}}, a company/individual having its registered office/address at {{disclosingPartyAddress}} (hereinafter referred to as the \"Disclosing Party\"),",
    partiesReceiving: "{{receivingPartyName}}, a company/individual having its registered office/address at {{receivingPartyAddress}} (hereinafter referred to as the \"Receiving Party\").",
    partiesFooter: "The Disclosing Party and the Receiving Party may hereinafter be collectively referred to as the \"Parties\" and individually as a \"Party\".",

    // Dynamic Sections Array
    sections: [
        {
            id: '1',
            title: 'Purpose',
            content: "The Disclosing Party intends to disclose certain confidential and proprietary information to the Receiving Party for the purpose of {{purpose}} (“Purpose”)."
        },
        {
            id: '2',
            title: 'Definition of Confidential Information',
            content: "For the purposes of this Agreement, \"Confidential Information\" shall mean any information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, electronically, visually, or in any other form, including but not limited to business plans, strategies, financial information, and technical data."
        },
        {
            id: '3',
            title: 'Exclusions from Confidential Information',
            content: "Confidential Information shall not include information that is publicly available, lawfully known to the Receiving Party prior to disclosure, or independently developed by the Receiving Party."
        },
        {
            id: '4',
            title: 'Obligations of the Receiving Party',
            content: "The Receiving Party agrees to keep all Confidential Information strictly confidential, use it solely for the Purpose, and not disclose it to any third party without prior written consent."
        },
        {
            id: '5',
            title: 'Disclosure',
            content: "The Receiving Party may disclose Confidential Information only to its employees, agents, or representatives who have a legitimate need to know for the Purpose and are bound by confidentiality obligations."
        },
        {
            id: '6',
            title: 'No License',
            content: "Nothing in this Agreement shall be construed as granting any rights, licenses, or ownership in the Confidential Information, except for the limited right to use it for the Purpose."
        },
        {
            id: '7',
            title: 'Term and Survival',
            content: "This Agreement shall commence on the Effective Date and remain in effect for a period of {{termYears}} years. The confidentiality obligations shall survive the termination for a period of {{survivalYears}} years thereafter."
        },
        {
            id: '8',
            title: 'Return of Information',
            content: "Upon termination of this Agreement or upon written request by the Disclosing Party, the Receiving Party shall promptly return or destroy all Confidential Information."
        },
        {
            id: '9',
            title: 'Remedies',
            content: "The Receiving Party acknowledges that unauthorized disclosure or misuse of Confidential Information may cause irreparable harm. The Disclosing Party shall be entitled to seek injunctive relief."
        },
        {
            id: '10',
            title: 'Governing Law',
            content: "This Agreement shall be governed by and construed in accordance with the laws of {{jurisdiction}}, and the courts of {{courtCity}} shall have exclusive jurisdiction."
        },
        {
            id: '11',
            title: 'Miscellaneous',
            content: "This Agreement constitutes the entire understanding between the Parties. Any amendment must be in writing. Failure to enforce any provision shall not constitute a waiver."
        }
    ]
};

export const defaultFormData = {
    effectiveDateDay: '',
    effectiveDateMonth: '',
    effectiveDateYear: '',

    // Branding
    logoSize: 70,
    logoAlignment: 'center', // center default for NDA
    brandingEnabled: true,

    disclosingPartyName: '',
    disclosingPartyAddress: '',
    receivingPartyName: '',
    receivingPartyAddress: '',
    purpose: '',
    termYears: '',
    survivalYears: '',
    jurisdiction: '',
    courtCity: '',
    disclosingSignatoryName: '',
    disclosingSignatoryDesignation: '',
    receivingSignatoryName: '',
    receivingSignatoryDesignation: ''
};

export const defaultContent = {
    title: "Consulting Services Agreement",
    preamble: "This Consulting Services Agreement (“Agreement”) is made and entered into on this {{effectiveDateDay}} day of {{effectiveDateMonth}}, 20{{effectiveDateYear}} (“Effective Date”),",
    partiesDisclosing: "{{clientName}}, having its principal place of business at {{clientAddress}} (hereinafter referred to as the \"Client\"),",
    partiesReceiving: "{{consultantName}}, having its principal place of business at {{consultantAddress}} (hereinafter referred to as the \"Consultant\").",
    partiesFooter: "The Client and the Consultant may hereinafter be collectively referred to as the \"Parties\" and individually as a \"Party\".",

    // Dynamic Sections Array
    sections: [
        {
            id: '1',
            title: 'Services',
            content: "The Consultant agrees to perform the following services for the Client: {{servicesDescription}} (“Services”). The Consultant shall perform the Services in a professional and workmanlike manner."
        },
        {
            id: '2',
            title: 'Term',
            content: "The term of this Agreement shall commence on {{startDate}} and shall continue until {{endDate}}, unless earlier terminated in accordance with this Agreement."
        },
        {
            id: '3',
            title: 'Compensation',
            content: "In consideration for the Services, the Client shall pay the Consultant a fee of {{feeAmount}}. Payment shall be made according to the following terms: {{paymentTerms}}."
        },
        {
            id: '4',
            title: 'Independent Contractor',
            content: "The Consultant is an independent contractor and not an employee of the Client. The Consultant shall be solely responsible for all taxes, withholdings, and other statutory obligations."
        },
        {
            id: '5',
            title: 'Confidentiality',
            content: "The Consultant agrees to keep confidential all non-public information obtained from the Client during the course of providing Services and shall not disclose it to any third party without prior written consent."
        },
        {
            id: '6',
            title: 'Intellectual Property',
            content: "Any work product created by the Consultant specifically for the Client under this Agreement shall be considered \"work made for hire\" and shall be the sole property of the Client."
        },
        {
            id: '7',
            title: 'Termination',
            content: "Either party may terminate this Agreement upon {{noticePeriod}} days' written notice to the other party."
        }
    ]
};

export const defaultFormData = {
    effectiveDateDay: '',
    effectiveDateMonth: '',
    effectiveDateYear: '',

    // Branding
    logoSize: 70,
    logoAlignment: 'center',
    brandingEnabled: true,

    clientName: '',
    clientAddress: '',
    consultantName: '',
    consultantAddress: '',

    servicesDescription: '',
    startDate: '',
    endDate: '',
    feeAmount: '',
    paymentTerms: '',
    noticePeriod: '30',

    clientSignatoryName: '',
    clientSignatoryTitle: '',
    consultantSignatoryName: '',
    consultantSignatoryTitle: ''
};

import React from 'react';
import { Building2 } from 'lucide-react';

const BusinessInfoBlock = ({ data, onChange, businessData }) => {
    // Defaults
    const align = data.align || 'left';

    const alignmentClass = {
        'left': 'text-left',
        'center': 'text-center',
        'right': 'text-right'
    }[align];

    if (!businessData) {
        return (
            <div className="w-full p-2 border border-dashed border-amber-200 bg-amber-50 text-amber-600 text-xs rounded flex items-center gap-2">
                <Building2 size={14} />
                <span>Business Info (Loading...)</span>
            </div>
        );
    }

    return (
        <div className={`w-full text-slate-600 text-sm leading-relaxed ${alignmentClass} mb-4`}>
            <p className="font-bold text-slate-900">{businessData.name}</p>
            {businessData.address && <p>{businessData.address}</p>}
            <p>
                {[businessData.city, businessData.state, businessData.zip, businessData.country].filter(Boolean).join(', ')}
            </p>
            {businessData.phone && <p>Tel: {businessData.phone}</p>}
            {businessData.email && <p>Email: {businessData.email}</p>}

            {(businessData.tax_label && businessData.tax_percentage) && (
                <p className="mt-1 text-xs text-slate-500 font-medium">
                    {businessData.tax_label}: {businessData.tax_percentage}%
                </p>
            )}
        </div>
    );
};

export default BusinessInfoBlock;

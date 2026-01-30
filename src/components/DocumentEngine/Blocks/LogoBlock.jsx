import React from 'react';
import { Image } from 'lucide-react';

const LogoBlock = ({ data, onChange, businessData }) => {
    // Defaults
    const align = data.align || 'left'; // left, center, right
    const width = data.width || 150;    // px

    // Use business logo if available and no override provided
    const logoSrc = data.src || (businessData?.logo ? `${import.meta.env.VITE_API_URL}/storage/${businessData.logo}` : null);

    const alignmentClass = {
        'left': 'justify-start',
        'center': 'justify-center',
        'right': 'justify-end'
    }[align];

    return (
        <div className={`flex w-full ${alignmentClass} mb-6 mt-4 group`}>
            {logoSrc ? (
                <img
                    src={logoSrc}
                    alt="Business Logo"
                    style={{ width: `${width}px` }}
                    className="object-contain"
                />
            ) : (
                <div className="w-40 h-16 bg-slate-100 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400">
                    <span className="text-xs font-semibold">Business Logo</span>
                </div>
            )}
        </div>
    );
};

export default LogoBlock;

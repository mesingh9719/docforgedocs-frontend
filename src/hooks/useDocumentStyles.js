import { useState, useCallback } from 'react';

const defaultStyles = {
    fontFamily: 'font-sans', // Inter (Tailwind default)
    fontSize: 'text-[11pt]',
    lineHeight: 'leading-relaxed',
    textColor: '#1e293b', // slate-800
    headingColor: '#0f172a', // slate-900
    accentColor: '#4f46e5', // indigo-600
    pageMargin: 'p-[10mm]',
    paragraphSpacing: 'mb-6',
};

export const useDocumentStyles = (initialStyles = {}) => {
    const [styles, setStyles] = useState({ ...defaultStyles, ...initialStyles });

    const updateStyle = useCallback((key, value) => {
        setStyles(prev => ({ ...prev, [key]: value }));
    }, []);

    const resetStyles = useCallback(() => {
        setStyles(defaultStyles);
    }, []);

    return {
        styles,
        updateStyle,
        resetStyles
    };
};

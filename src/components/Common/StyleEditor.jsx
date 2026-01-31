import React from 'react';
import { Type, Palette, Layout, RotateCcw } from 'lucide-react';

const StyleEditor = ({ styles, onUpdate, onReset }) => {

    // Tailwind classes map to readable names
    const fonts = [
        { label: 'Modern Sans', value: 'font-sans' },
        { label: 'Classic Serif', value: 'font-serif' },
        { label: 'Monospace', value: 'font-mono' },
    ];

    const sizes = [
        { label: 'Small (10pt)', value: 'text-[10pt]' },
        { label: 'Standard (11pt)', value: 'text-[11pt]' },
        { label: 'Large (12pt)', value: 'text-[12pt]' },
    ];

    const spacings = [
        { label: 'Compact', value: 'leading-normal' },
        { label: 'Standard', value: 'leading-relaxed' },
        { label: 'Loose', value: 'leading-loose' },
    ];

    const margins = [
        { label: 'Narrow', value: 'p-[15mm]' }, // Actually wider padding visually
        { label: 'Standard', value: 'p-[25.4mm]' }, // 1 inch
        { label: 'Wide', value: 'p-[35mm]' },
    ];

    return (
        <div className="space-y-6 pt-2">

            {/* Typography Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    <Type size={14} /> Typography
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <div>
                        <label className="text-xs text-slate-400 mb-1 block">Font Family</label>
                        <select
                            value={styles.fontFamily}
                            onChange={(e) => onUpdate('fontFamily', e.target.value)}
                            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                        >
                            {fonts.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Size</label>
                            <select
                                value={styles.fontSize}
                                onChange={(e) => onUpdate('fontSize', e.target.value)}
                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                            >
                                {sizes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1 block">Line Height</label>
                            <select
                                value={styles.lineHeight}
                                onChange={(e) => onUpdate('lineHeight', e.target.value)}
                                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                            >
                                {spacings.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* Colors Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    <Palette size={14} /> Colors
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-slate-400 mb-1 block">Text Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={styles.textColor}
                                onChange={(e) => onUpdate('textColor', e.target.value)}
                                className="h-8 w-8 rounded cursor-pointer border-0 p-0"
                            />
                            <span className="text-xs font-mono text-slate-500">{styles.textColor}</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 mb-1 block">Accent Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={styles.accentColor}
                                onChange={(e) => onUpdate('accentColor', e.target.value)}
                                className="h-8 w-8 rounded cursor-pointer border-0 p-0"
                            />
                            <span className="text-xs font-mono text-slate-500">{styles.accentColor}</span>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-slate-100" />

            {/* Layout Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    <Layout size={14} /> Layout
                </div>
                <div>
                    <label className="text-xs text-slate-400 mb-1 block">Page Margins</label>
                    <select
                        value={styles.pageMargin}
                        onChange={(e) => onUpdate('pageMargin', e.target.value)}
                        className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                    >
                        {margins.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                </div>
            </div>

            {/* Reset Button */}
            <button
                onClick={onReset}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
                <RotateCcw size={14} /> Reset to Defaults
            </button>
        </div>
    );
};

export default StyleEditor;

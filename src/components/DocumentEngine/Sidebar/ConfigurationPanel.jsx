import React from 'react';
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    Trash2,
    Sliders,
    Palette,
    FileText,
    Copy,
    Layout,
} from 'lucide-react';

const AlignmentControl = ({ value, onChange }) => (
    <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
        {['left', 'center', 'right'].map((align) => (
            <button
                key={align}
                type="button"
                onClick={() => onChange(align)}
                className={`flex-1 p-1.5 rounded-md flex justify-center transition-all ${
                    value === align
                        ? 'bg-white shadow-xs text-indigo-600 font-bold'
                        : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                {align === 'left' && <AlignLeft size={16} />}
                {align === 'center' && <AlignCenter size={16} />}
                {align === 'right' && <AlignRight size={16} />}
            </button>
        ))}
    </div>
);

const PageSettingsPanel = ({ pageSettings = {}, setPageSettings }) => {
    const size = pageSettings.size || 'A4';
    const orientation = pageSettings.orientation || 'portrait';
    const fontFamily = pageSettings.fontFamily || 'Inter, sans-serif';
    const backgroundColor = pageSettings.backgroundColor || '#ffffff';

    const handleChange = (key, val) => {
        if (setPageSettings) {
            setPageSettings({ [key]: val });
        }
    };

    return (
        <div className="p-5 space-y-6">
            <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block flex items-center gap-1.5">
                    <FileText size={14} className="text-indigo-600" />
                    Page Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {['A4', 'Letter', 'Legal'].map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => handleChange('size', s)}
                            className={`py-2 px-3 border rounded-lg text-xs font-semibold transition ${
                                size === s
                                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-xs'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block flex items-center gap-1.5">
                    <Layout size={14} className="text-indigo-600" />
                    Orientation
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { key: 'portrait', label: 'Portrait (Vertical)' },
                        { key: 'landscape', label: 'Landscape (Wide)' },
                    ].map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => handleChange('orientation', item.key)}
                            className={`py-2 px-3 border rounded-lg text-xs font-semibold transition ${
                                orientation === item.key
                                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-xs'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">
                    Font Family
                </label>
                <select
                    value={fontFamily}
                    onChange={(e) => handleChange('fontFamily', e.target.value)}
                    className="w-full text-xs border-slate-200 rounded-lg p-2.5 bg-slate-50/50 text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                >
                    <option value="Inter, sans-serif">Inter (Modern Clean)</option>
                    <option value="'Roboto', sans-serif">Roboto (Standard)</option>
                    <option value="Georgia, serif">Georgia (Editorial Serif)</option>
                    <option value="'Courier New', monospace">Courier (Monospace)</option>
                </select>
            </div>

            <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block flex items-center gap-1.5">
                    <Palette size={14} className="text-indigo-600" />
                    Canvas Background
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => handleChange('backgroundColor', e.target.value)}
                        className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5"
                    />
                    <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => handleChange('backgroundColor', e.target.value)}
                        className="text-xs border-slate-200 rounded-lg p-2 flex-1 bg-slate-50/50 text-slate-700 font-mono"
                    />
                </div>
            </div>
        </div>
    );
};

const ConfigurationPanel = ({
    selectedBlock,
    updateBlock,
    removeBlock,
    duplicateBlock,
    pageSettings,
    setPageSettings,
}) => {
    const [tab, setTab] = React.useState('block'); // 'block' | 'page'

    // Automatically switch to 'page' tab if no block is selected
    React.useEffect(() => {
        if (!selectedBlock) {
            setTab('page');
        } else {
            setTab('block');
        }
    }, [selectedBlock]);

    const { type, data = {}, id } = selectedBlock || {};
    const normalizedType = (type || '').toUpperCase().replace(/-/g, '_');

    const handleChange = (key, val) => {
        if (selectedBlock && updateBlock) {
            updateBlock(id, { [key]: val });
        }
    };

    return (
        <div className="h-full flex flex-col bg-white border-l border-slate-200/80 font-sans">
            {/* Header Tabs */}
            <div className="p-2 border-b border-slate-200/80 bg-slate-50/80 flex gap-1">
                <button
                    type="button"
                    onClick={() => setTab('block')}
                    disabled={!selectedBlock}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                        tab === 'block' && selectedBlock
                            ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/60'
                            : 'text-slate-500 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed'
                    }`}
                >
                    <Sliders size={13} />
                    <span>Block Inspector</span>
                </button>

                <button
                    type="button"
                    onClick={() => setTab('page')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                        tab === 'page'
                            ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/60'
                            : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <FileText size={13} />
                    <span>Page Settings</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                {tab === 'page' ? (
                    <PageSettingsPanel
                        pageSettings={pageSettings}
                        setPageSettings={setPageSettings}
                    />
                ) : !selectedBlock ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-3 text-slate-400 border border-slate-100">
                            <Sliders size={22} />
                        </div>
                        <p className="font-semibold text-slate-700 text-sm mb-1">No Block Selected</p>
                        <p className="text-xs text-slate-400 max-w-[200px]">
                            Click on any component on the document canvas to edit its properties.
                        </p>
                    </div>
                ) : (
                    <div>
                        {/* Block Header Toolbar */}
                        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                {normalizedType.replace(/_/g, ' ')}
                            </span>
                            <div className="flex items-center gap-1">
                                {duplicateBlock && (
                                    <button
                                        type="button"
                                        onClick={() => duplicateBlock(id)}
                                        title="Duplicate Block"
                                        className="text-slate-400 hover:text-indigo-600 p-1.5 hover:bg-indigo-50 rounded transition"
                                    >
                                        <Copy size={14} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeBlock(id)}
                                    title="Delete Block"
                                    className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Inspector Controls by Type */}
                        <div className="p-5 space-y-5">
                            {/* Common: Alignment */}
                            {['HEADING', 'LOGO', 'BUSINESS_INFO', 'IMAGE'].includes(normalizedType) && (
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 mb-2 block">
                                        Alignment
                                    </label>
                                    <AlignmentControl
                                        value={data.align || 'left'}
                                        onChange={(val) => handleChange('align', val)}
                                    />
                                </div>
                            )}

                            {/* Heading Specific */}
                            {normalizedType === 'HEADING' && (
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 mb-2 block">
                                        Heading Level
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[1, 2, 3].map((level) => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => handleChange('level', level)}
                                                className={`py-2 border rounded-lg text-xs font-bold transition ${
                                                    (data.level || 1) === level
                                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                                                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                            >
                                                H{level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Dynamic Table Specific */}
                            {['DYNAMIC_TABLE', 'TABLE', 'LINE_ITEMS'].includes(normalizedType) && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 mb-1 block">
                                            Table Title
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title || ''}
                                            onChange={(e) => handleChange('title', e.target.value)}
                                            placeholder="e.g. Services & Deliverables"
                                            className="w-full text-xs border border-slate-200 rounded-lg p-2 text-slate-800"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 mb-1 block">
                                                Currency Symbol
                                            </label>
                                            <input
                                                type="text"
                                                value={data.currency || '$'}
                                                onChange={(e) => handleChange('currency', e.target.value)}
                                                className="w-full text-xs border border-slate-200 rounded-lg p-2 text-slate-800 font-mono text-center"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 mb-1 block">
                                                Tax Rate (%)
                                            </label>
                                            <input
                                                type="number"
                                                value={data.taxRate ?? 0}
                                                onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 0)}
                                                className="w-full text-xs border border-slate-200 rounded-lg p-2 text-slate-800 text-right"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 mb-1 block">
                                            Discount Rate (%)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.discountRate ?? 0}
                                            onChange={(e) => handleChange('discountRate', parseFloat(e.target.value) || 0)}
                                            className="w-full text-xs border border-slate-200 rounded-lg p-2 text-slate-800 text-right"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <input
                                            type="checkbox"
                                            id="showTotalsToggle"
                                            checked={data.showTotals !== false}
                                            onChange={(e) => handleChange('showTotals', e.target.checked)}
                                            className="rounded text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="showTotalsToggle" className="text-xs text-slate-700 font-medium">
                                            Show Table Totals Summary
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Callout Specific */}
                            {normalizedType === 'CALLOUT' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 mb-2 block">
                                            Callout Theme
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { key: 'info', label: 'Info (Blue)' },
                                                { key: 'warning', label: 'Warning (Amber)' },
                                                { key: 'success', label: 'Success (Green)' },
                                                { key: 'note', label: 'Note (Indigo)' },
                                            ].map((t) => (
                                                <button
                                                    key={t.key}
                                                    type="button"
                                                    onClick={() => handleChange('theme', t.key)}
                                                    className={`py-2 px-2 border rounded-lg text-xs font-medium transition ${
                                                        (data.theme || 'info') === t.key
                                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                                                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                                    }`}
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Divider Specific */}
                            {normalizedType === 'DIVIDER' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 mb-2 block">
                                            Line Style
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['solid', 'dashed', 'dotted'].map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => handleChange('style', s)}
                                                    className={`py-2 border rounded-lg text-xs font-semibold capitalize transition ${
                                                        (data.style || 'solid') === s
                                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                                    }`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 mb-1 block">
                                            Thickness: {data.thickness || 1}px
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="8"
                                            value={data.thickness || 1}
                                            onChange={(e) => handleChange('thickness', parseInt(e.target.value))}
                                            className="w-full accent-indigo-600"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Spacer Specific */}
                            {normalizedType === 'SPACER' && (
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 mb-1 block">
                                        Height: {data.height || 32}px
                                    </label>
                                    <input
                                        type="range"
                                        min="8"
                                        max="120"
                                        step="4"
                                        value={data.height || 32}
                                        onChange={(e) => handleChange('height', parseInt(e.target.value))}
                                        className="w-full accent-indigo-600"
                                    />
                                </div>
                            )}

                            {/* Logo Specific */}
                            {normalizedType === 'LOGO' && (
                                <div>
                                    <label className="text-xs font-semibold text-slate-700 mb-1 block">
                                        Logo Width: {data.width || 150}px
                                    </label>
                                    <input
                                        type="range"
                                        min="50"
                                        max="400"
                                        value={data.width || 150}
                                        onChange={(e) => handleChange('width', parseInt(e.target.value))}
                                        className="w-full accent-indigo-600"
                                    />
                                </div>
                            )}

                            {/* Signature Specific */}
                            {normalizedType === 'SIGNATURE' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-700 mb-1 block">
                                            Signee Role
                                        </label>
                                        <select
                                            value={data.signee || 'client'}
                                            onChange={(e) => handleChange('signee', e.target.value)}
                                            className="w-full text-xs border-slate-200 rounded-lg p-2.5 bg-slate-50/50"
                                        >
                                            <option value="client">Client / Recipient</option>
                                            <option value="provider">Provider / Company</option>
                                            <option value="witness">Witness / Third Party</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="sigRequired"
                                            checked={data.required !== false}
                                            onChange={(e) => handleChange('required', e.target.checked)}
                                            className="rounded text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="sigRequired" className="text-xs text-slate-700 font-medium">
                                            Required Signature
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfigurationPanel;

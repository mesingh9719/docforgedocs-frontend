import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, Trash2, Type } from 'lucide-react';

const AlignmentControl = ({ value, onChange }) => (
    <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
        {['left', 'center', 'right'].map((align) => (
            <button
                key={align}
                onClick={() => onChange(align)}
                className={`flex-1 p-1 rounded-md flex justify-center transition-all ${value === align ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
                {align === 'left' && <AlignLeft size={16} />}
                {align === 'center' && <AlignCenter size={16} />}
                {align === 'right' && <AlignRight size={16} />}
            </button>
        ))}
    </div>
);

const ConfigurationPanel = ({ selectedBlock, updateBlock, removeBlock }) => {
    if (!selectedBlock) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <SettingsIcon size={24} />
                </div>
                <p className="font-semibold text-slate-600 mb-1">No Block Selected</p>
                <p className="text-xs">Click on any element in the document canvas to customize its properties.</p>
            </div>
        );
    }

    const { type, data, id } = selectedBlock;

    const handleChange = (key, val) => {
        updateBlock(id, { [key]: val });
    };

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{type.replace('_', ' ')}</span>
                <button
                    onClick={() => removeBlock(id)}
                    className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto form-control-group">
                {/* Common: Alignment */}
                {['HEADING', 'LOGO', 'BUSINESS_INFO', 'IMAGE'].includes(type) && (
                    <div className="mb-6">
                        <label className="text-xs font-semibold text-slate-600 mb-2 block">Alignment</label>
                        <AlignmentControl
                            value={data.align || 'left'}
                            onChange={(val) => handleChange('align', val)}
                        />
                    </div>
                )}

                {/* Heading Specific */}
                {type === 'HEADING' && (
                    <div className="mb-6">
                        <label className="text-xs font-semibold text-slate-600 mb-2 block">Heading Level</label>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(level => (
                                <button
                                    key={level}
                                    onClick={() => handleChange('level', level)}
                                    className={`flex-1 py-2 border rounded text-sm font-bold ${data.level === level ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                                >
                                    H{level}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Logo Specific */}
                {type === 'LOGO' && (
                    <div className="mb-6">
                        <label className="text-xs font-semibold text-slate-600 mb-2 block">Size (Width)</label>
                        <input
                            type="range"
                            min="50"
                            max="500"
                            value={data.width || 150}
                            onChange={(e) => handleChange('width', parseInt(e.target.value))}
                            className="w-full accent-indigo-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>Small</span>
                            <span>{data.width || 150}px</span>
                            <span>Large</span>
                        </div>
                    </div>
                )}

                {/* Signature Specific */}
                {type === 'SIGNATURE' && (
                    <div className="mb-6">
                        <label className="text-xs font-semibold text-slate-600 mb-2 block">Signee</label>
                        <select
                            value={data.signee || 'client'}
                            onChange={(e) => handleChange('signee', e.target.value)}
                            className="w-full text-sm border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="client">Client</option>
                            <option value="me">Me (Provider)</option>
                        </select>

                        <div className="mt-4 flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.required !== false}
                                onChange={(e) => handleChange('required', e.target.checked)}
                                className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-700">Required Field</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper Icon for Default State
const SettingsIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export default ConfigurationPanel;

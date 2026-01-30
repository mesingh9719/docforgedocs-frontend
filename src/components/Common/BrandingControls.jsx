import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, Smartphone } from 'lucide-react';

export const BrandingControls = ({ formData, onChange }) => {
    // Defaults if not present
    const logoSize = formData.logoSize || 70; // Default height in px
    const logoAlignment = formData.logoAlignment || 'left'; // Default alignment
    // Handle boolean and string 'false' from potential serialization issues
    const brandingEnabled = formData.brandingEnabled !== false && formData.brandingEnabled !== 'false';

    const handleToggle = () => {
        onChange({
            target: {
                name: 'brandingEnabled',
                value: !brandingEnabled
            }
        });
    };

    const handleSizeChange = (e) => {
        onChange({
            target: {
                name: 'logoSize',
                value: parseInt(e.target.value)
            }
        });
    };

    const handleAlignmentChange = (alignment) => {
        onChange({
            target: {
                name: 'logoAlignment',
                value: alignment
            }
        });
    };

    return (
        <div className="space-y-4 pt-1">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Show Logo</label>
                <button
                    onClick={handleToggle}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${brandingEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                    <span
                        className={`${brandingEnabled ? 'translate-x-5' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                    />
                </button>
            </div>

            {brandingEnabled && (
                <>
                    {/* Logo Size */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Logo Size</label>
                            <span className="text-xs font-mono text-slate-400">{logoSize}px</span>
                        </div>
                        <input
                            type="range"
                            min="30"
                            max="200"
                            step="5"
                            value={logoSize}
                            onChange={handleSizeChange}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        />
                    </div>

                    {/* Logo Alignment */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Position</label>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            {[
                                { id: 'left', icon: AlignLeft, label: 'Left' },
                                { id: 'center', icon: AlignCenter, label: 'Center' },
                                { id: 'right', icon: AlignRight, label: 'Right' }
                            ].map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleAlignmentChange(option.id)}
                                    className={`flex-1 flex items-center justify-center py-1.5 rounded-md transition-all ${logoAlignment === option.id
                                        ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200'
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                                        }`}
                                    title={`Align ${option.label}`}
                                >
                                    <option.icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-400 italic mt-2">
                        * Adjust position based on header layout compatibility.
                    </p>
                </>
            )}
        </div>
    );
};

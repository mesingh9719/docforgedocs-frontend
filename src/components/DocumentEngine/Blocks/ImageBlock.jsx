import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

const ImageBlock = ({ data, onChange }) => {
    const src = data.src;

    if (!src) {
        return (
            <div className="w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-colors">
                <ImageIcon size={24} className="mb-2" />
                <span className="text-sm">Click to upload image</span>
                {/* File handling to be implemented in configuration panel or click handler */}
            </div>
        );
    }

    return (
        <div className="relative group">
            <img
                src={src}
                alt="Document Asset"
                className="max-w-full rounded-lg"
            />
        </div>
    );
};

export default ImageBlock;

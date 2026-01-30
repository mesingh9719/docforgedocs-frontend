import React from 'react';
import { PenTool } from 'lucide-react';

const SignatureBlock = ({ data, onChange }) => {
    const signee = data.signee || 'Client';
    const required = data.required !== false;

    return (
        <div className="my-4 p-4 border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-md">
                    <PenTool size={20} />
                </div>
                <div>
                    <p className="text-sm font-semibold text-indigo-900">Signature Required</p>
                    <p className="text-xs text-indigo-600">Assignee: {signee}</p>
                </div>
            </div>

            {required && (
                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">REQUIRED</span>
            )}
        </div>
    );
};

export default SignatureBlock;

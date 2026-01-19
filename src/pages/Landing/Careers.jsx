import React from 'react';
import { Briefcase } from 'lucide-react';

const Careers = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-32 text-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <Briefcase size={40} />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-6">Join the Team</h1>
            <p className="text-xl text-slate-600 mb-12">
                We're always looking for talented individuals to help us build the future of document management.
            </p>

            <div className="p-12 border border-slate-200 rounded-2xl bg-slate-50">
                <p className="text-slate-500 font-medium">There are currently no open positions.</p>
                <p className="text-slate-400 text-sm mt-2">Check back later or follow us on social media for updates.</p>
            </div>
        </div>
    );
};

export default Careers;

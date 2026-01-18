import React, { useState } from 'react';

function NdaDocTemplate() {
    // State for placeholders to make it "pre-filled" or "editable" in a simple way
    // or just static text if that's what "pre-filled" implies in this context.
    // Given "make this edited template", I'll make it a clean static document 
    // that looks like a paper, with placeholders visible.

    return (
        <div className="max-w-[210mm] mx-auto bg-white shadow-xl p-[20mm] text-slate-800 text-[11pt] leading-relaxed font-serif my-8">
            <h1 className="text-xl font-bold text-center mb-8 uppercase tracking-wide border-b-2 border-slate-800 pb-2">
                Non-Disclosure Agreement (NDA)
            </h1>

            <p className="mb-6 text-justify">
                This Non-Disclosure Agreement (“Agreement”) is made and entered into on this <span className="bg-yellow-50 px-2 border-b border-slate-300 min-w-[30px] inline-block">___</span> day of <span className="bg-yellow-50 px-2 border-b border-slate-300 min-w-[80px] inline-block">________</span>, 20<span className="bg-yellow-50 px-2 border-b border-slate-300 min-w-[30px] inline-block">__</span> (“Effective Date”),
            </p>

            <div className="mb-6">
                <p className="font-bold mb-2">BY AND BETWEEN</p>
                <p className="mb-4 pl-4 text-justify">
                    <span className="font-bold">[Disclosing Party Name]</span>, a company/individual having its registered office/address at <span className="italic">[Full Address]</span> (hereinafter referred to as the "Disclosing Party"),
                </p>

                <p className="font-bold mb-2">AND</p>
                <p className="mb-4 pl-4 text-justify">
                    <span className="font-bold">[Receiving Party Name]</span>, a company/individual having its registered office/address at <span className="italic">[Full Address]</span> (hereinafter referred to as the "Receiving Party").
                </p>

                <p className="text-justify">
                    The Disclosing Party and the Receiving Party may hereinafter be collectively referred to as the "Parties" and individually as a "Party".
                </p>
            </div>

            {/* Sections */}
            <div className="space-y-6">
                <section>
                    <h2 className="font-bold text-sm uppercase mb-2">1. Purpose</h2>
                    <p className="text-justify">
                        The Disclosing Party intends to disclose certain confidential and proprietary information to the Receiving Party for the purpose of <span className="bg-yellow-50 px-2 border-b border-slate-300 italic">[clearly define purpose – e.g., business discussions, project evaluation, partnership, services, etc.]</span> (“Purpose”).
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-sm uppercase mb-2">2. Definition of Confidential Information</h2>
                    <p className="text-justify mb-2">
                        For the purposes of this Agreement, "Confidential Information" shall mean any information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, electronically, visually, or in any other form, including but not limited to:
                    </p>
                    <ul className="list-disc pl-8 space-y-1">
                        <li>Business plans, strategies, and proposals</li>
                        <li>Financial information, pricing, and forecasts</li>
                        <li>Technical data, software, source code, designs, and documentation</li>
                        <li>Trade secrets, know-how, and intellectual property</li>
                        <li>Client, vendor, or customer information</li>
                        <li>Any other information marked or reasonably understood to be confidential</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-bold text-sm uppercase mb-2">3. Exclusions from Confidential Information</h2>
                    <p className="text-justify mb-2">Confidential Information shall not include information that:</p>
                    <ul className="list-[lower-alpha] pl-8 space-y-1">
                        <li>Is or becomes publicly available without breach of this Agreement</li>
                        <li>Was lawfully known to the Receiving Party prior to disclosure</li>
                        <li>Is independently developed by the Receiving Party without reference to Confidential Information</li>
                        <li>Is lawfully obtained from a third party without restriction</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-bold text-sm uppercase mb-2">4. Obligations of the Receiving Party</h2>
                    <p className="text-justify mb-2">The Receiving Party agrees to:</p>
                    <ul className="list-[lower-alpha] pl-8 space-y-1">
                        <li>Keep all Confidential Information strictly confidential</li>
                        <li>Use the Confidential Information solely for the stated Purpose</li>
                        <li>Not disclose Confidential Information to any third party without prior written consent of the Disclosing Party</li>
                        <li>Take reasonable measures to protect the Confidential Information from unauthorized access</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-bold text-sm uppercase mb-2">5. Disclosure to Employees or Representatives</h2>
                    <p className="text-justify">
                        The Receiving Party may disclose Confidential Information only to its employees, agents, or representatives who have a legitimate need to know for the Purpose and are bound by confidentiality obligations no less restrictive than those contained herein.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-sm uppercase mb-2">6. No License or Ownership</h2>
                    <p className="text-justify">
                        Nothing in this Agreement shall be construed as granting any rights, licenses, or ownership in the Confidential Information, except for the limited right to use it for the Purpose.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-sm uppercase mb-2">7. Term and Survival</h2>
                    <p className="text-justify">
                        This Agreement shall commence on the Effective Date and remain in effect for a period of <span className="bg-yellow-50 px-2 border-b border-slate-300 inline-block min-w-[30px]">___</span> years.
                        The confidentiality obligations shall survive the termination or expiration of this Agreement for a period of <span className="bg-yellow-50 px-2 border-b border-slate-300 inline-block min-w-[30px]">___</span> years thereafter.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-sm uppercase mb-2">8. Return or Destruction of Confidential Information</h2>
                    <p className="text-justify">
                        Upon termination of this Agreement or upon written request by the Disclosing Party, the Receiving Party shall promptly return or destroy all Confidential Information, including copies, in any form.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-sm uppercase mb-2">9. Breach and Remedies</h2>
                    <p className="text-justify">
                        The Receiving Party acknowledges that unauthorized disclosure or misuse of Confidential Information may cause irreparable harm.
                        The Disclosing Party shall be entitled to seek injunctive relief, in addition to any other remedies available under law.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-sm uppercase mb-2">10. Governing Law and Jurisdiction</h2>
                    <p className="text-justify">
                        This Agreement shall be governed by and construed in accordance with the laws of <span className="bg-yellow-50 px-2 border-b border-slate-300 italic">[Jurisdiction/Country/State]</span>, and the courts of <span className="bg-yellow-50 px-2 border-b border-slate-300 italic">[City/State]</span> shall have exclusive jurisdiction.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-sm uppercase mb-2">11. Miscellaneous</h2>
                    <ul className="list-[lower-alpha] pl-8 space-y-1 text-justify">
                        <li>This Agreement constitutes the entire understanding between the Parties</li>
                        <li>Any amendment must be in writing and signed by both Parties</li>
                        <li>Failure to enforce any provision shall not constitute a waiver</li>
                        <li>If any provision is held invalid, the remaining provisions shall remain in full force</li>
                    </ul>
                </section>

                <section className="mt-12 break-inside-avoid">
                    <h2 className="font-bold text-sm uppercase mb-6">12. Signatures</h2>
                    <p className="mb-6">IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.</p>

                    <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <p className="font-bold uppercase border-b border-slate-200 pb-2 mb-4">For Disclosing Party</p>
                            <div className="grid grid-cols-[100px_1fr] gap-2 items-end">
                                <span className="text-sm font-medium">Name:</span>
                                <div className="border-b border-slate-400 h-6"></div>

                                <span className="text-sm font-medium">Designation:</span>
                                <div className="border-b border-slate-400 h-6"></div>

                                <span className="text-sm font-medium">Signature:</span>
                                <div className="border-b border-slate-400 h-6"></div>

                                <span className="text-sm font-medium">Date:</span>
                                <div className="border-b border-slate-400 h-6"></div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="font-bold uppercase border-b border-slate-200 pb-2 mb-4">For Receiving Party</p>
                            <div className="grid grid-cols-[100px_1fr] gap-2 items-end">
                                <span className="text-sm font-medium">Name:</span>
                                <div className="border-b border-slate-400 h-6"></div>

                                <span className="text-sm font-medium">Designation:</span>
                                <div className="border-b border-slate-400 h-6"></div>

                                <span className="text-sm font-medium">Signature:</span>
                                <div className="border-b border-slate-400 h-6"></div>

                                <span className="text-sm font-medium">Date:</span>
                                <div className="border-b border-slate-400 h-6"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default NdaDocTemplate;
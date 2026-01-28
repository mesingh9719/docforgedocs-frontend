import React, { useState } from 'react';
import { Reorder } from 'framer-motion';
import { PenTool, Edit3, Layers, Plus, Trash2, GripVertical, FileSignature, Calendar, User, FileText, Globe } from 'lucide-react';
import { SidebarSection, SidebarInput } from '../../../components/Nda/SidebarComponents';
import ConfirmationModal from '../../../components/ConfirmationModal';
import SignatureToolbar from '../../../components/Nda/Signatures/SignatureToolbar';

const NdaFormSidebar = ({
    formData,
    onChange,
    docContent,
    onContentChange,
    // Section Props
    addSection,
    removeSection,
    updateSection,
    reorderSections
}) => {
    const [openSection, setOpenSection] = useState('parties');
    const [mode, setMode] = useState('fill'); // 'fill', 'edit', 'sign'

    // Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        sectionId: null
    });

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    // Completeness Logic
    const isDateComplete = formData.effectiveDateDay && formData.effectiveDateMonth && formData.effectiveDateYear;
    const isPartiesComplete = formData.disclosingPartyName && formData.receivingPartyName && formData.disclosingPartyAddress && formData.receivingPartyAddress;
    const isPurposeComplete = !!formData.purpose;
    const isTermsComplete = formData.termYears && formData.survivalYears && formData.jurisdiction && formData.courtCity;
    const isSignatoriesComplete = formData.disclosingSignatoryName && formData.disclosingSignatoryDesignation && formData.receivingSignatoryName && formData.receivingSignatoryDesignation;

    const handleRemoveRequest = (id) => {
        setConfirmModal({
            isOpen: true,
            sectionId: id
        });
    };

    const handleConfirmRemove = () => {
        if (confirmModal.sectionId) {
            removeSection(confirmModal.sectionId);
            setConfirmModal({ isOpen: false, sectionId: null });
        }
    };

    return (
        <div className="bg-white min-h-full pb-20 relative">
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, sectionId: null })}
                onConfirm={handleConfirmRemove}
                title="Delete Section"
                message="Are you sure you want to remove this section? This action cannot be undone and will remove the clause from the generated document."
                confirmText="Delete Section"
                isDestructive={true}
            />

            {/* Header with Switcher */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
                <div className="flex gap-1 bg-slate-200/50 p-1 rounded-lg mb-4">
                    <button
                        onClick={() => setMode('fill')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === 'fill' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        title="Fill Details"
                    >
                        <Layers size={16} />
                    </button>
                    <button
                        onClick={() => setMode('edit')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === 'edit' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        title="Structure Builder"
                    >
                        <Edit3 size={16} />
                    </button>
                    <button
                        onClick={() => setMode('sign')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === 'sign' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        title="E-Signature Fields"
                    >
                        <FileSignature size={16} />
                    </button>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        {mode === 'fill' ? 'Document Details' : (mode === 'edit' ? 'Structure Builder' : 'E-Sign Fields')}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        {mode === 'fill' ? 'Review and specify the agreement terms' : (mode === 'edit' ? 'Drag to reorder, add, or remove sections' : 'Drag signature fields onto the document')}
                    </p>
                </div>
            </div>

            {mode === 'fill' && (
                // FILL MODE: STANDARD ACCORDION
                <>
                    {/* General Info */}
                    <SidebarSection
                        title="Effective Date"
                        icon={Calendar}
                        isOpen={openSection === 'date'}
                        isComplete={isDateComplete}
                        onClick={() => toggleSection('date')}
                    >
                        <div className="grid grid-cols-3 gap-3">
                            <SidebarInput label="Day" name="effectiveDateDay" value={formData.effectiveDateDay} onChange={onChange} placeholder="DD" />
                            <SidebarInput label="Month" name="effectiveDateMonth" value={formData.effectiveDateMonth} onChange={onChange} placeholder="Month" />
                            <SidebarInput label="Year" name="effectiveDateYear" value={formData.effectiveDateYear} onChange={onChange} placeholder="YY" />
                        </div>
                    </SidebarSection>

                    {/* Parties */}
                    <SidebarSection
                        title="Parties Involved"
                        icon={User}
                        isOpen={openSection === 'parties'}
                        isComplete={isPartiesComplete}
                        onClick={() => toggleSection('parties')}
                    >
                        <div className="space-y-4">
                            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                <h4 className="text-xs font-bold text-indigo-900 uppercase mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Disclosing Party
                                </h4>
                                <div className="space-y-3">
                                    <SidebarInput label="Name / Company" name="disclosingPartyName" value={formData.disclosingPartyName} onChange={onChange} placeholder="Ex: Acme Corp" />
                                    <SidebarInput label="Full Address" name="disclosingPartyAddress" value={formData.disclosingPartyAddress} onChange={onChange} placeholder="Address" rows={2} />
                                </div>
                            </div>

                            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                <h4 className="text-xs font-bold text-emerald-900 uppercase mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Receiving Party
                                </h4>
                                <div className="space-y-3">
                                    <SidebarInput label="Name / Company" name="receivingPartyName" value={formData.receivingPartyName} onChange={onChange} placeholder="Ex: John Doe" />
                                    <SidebarInput label="Full Address" name="receivingPartyAddress" value={formData.receivingPartyAddress} onChange={onChange} placeholder="Address" rows={2} />
                                </div>
                            </div>
                        </div>
                    </SidebarSection>

                    {/* Purpose */}
                    <SidebarSection
                        title="Purpose Scope"
                        icon={FileText}
                        isOpen={openSection === 'purpose'}
                        isComplete={isPurposeComplete}
                        onClick={() => toggleSection('purpose')}
                    >
                        <SidebarInput
                            label="Description of Purpose"
                            name="purpose"
                            value={formData.purpose}
                            onChange={onChange}
                            placeholder="Describe why information is being shared (e.g., potential partnership, investment evaluation)..."
                            rows={6}
                        />
                    </SidebarSection>

                    {/* Terms */}
                    <SidebarSection
                        title="Terms & Jurisdiction"
                        icon={Globe}
                        isOpen={openSection === 'terms'}
                        isComplete={isTermsComplete}
                        onClick={() => toggleSection('terms')}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <SidebarInput label="Term (Years)" name="termYears" value={formData.termYears} onChange={onChange} placeholder="2" />
                            <SidebarInput label="Survival (Years)" name="survivalYears" value={formData.survivalYears} onChange={onChange} placeholder="5" />
                        </div>
                        <div className="h-px bg-slate-100 my-2"></div>
                        <SidebarInput label="Jurisdiction" name="jurisdiction" value={formData.jurisdiction} onChange={onChange} placeholder="State/Country (e.g. California)" />
                        <SidebarInput label="Court Location" name="courtCity" value={formData.courtCity} onChange={onChange} placeholder="City (e.g. San Francisco)" />
                    </SidebarSection>

                    {/* Signatures */}
                    <SidebarSection
                        title="Signatories"
                        icon={PenTool}
                        isOpen={openSection === 'signatures'}
                        isComplete={isSignatoriesComplete}
                        onClick={() => toggleSection('signatures')}
                    >
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-bold text-slate-400 mb-2 uppercase">For Disclosing Party</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <SidebarInput label="Name" name="disclosingSignatoryName" value={formData.disclosingSignatoryName} onChange={onChange} placeholder="Name" />
                                    <SidebarInput label="Title" name="disclosingSignatoryDesignation" value={formData.disclosingSignatoryDesignation} onChange={onChange} placeholder="Title" />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 mb-2 uppercase">For Receiving Party</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <SidebarInput label="Name" name="receivingSignatoryName" value={formData.receivingSignatoryName} onChange={onChange} placeholder="Name" />
                                    <SidebarInput label="Title" name="receivingSignatoryDesignation" value={formData.receivingSignatoryDesignation} onChange={onChange} placeholder="Title" />
                                </div>
                            </div>
                        </div>
                    </SidebarSection>
                </>
            )}

            {mode === 'edit' && (
                // EDIT/BUILDER MODE: REORDER LIST
                <div className="p-4 space-y-4">
                    {/* Fixed Preamble Section */}
                    <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                        <div className="flex items-center gap-2 mb-2 font-semibold text-xs uppercase text-slate-500">
                            <Layers size={14} /> Preamble & Parties (Fixed)
                        </div>
                        <textarea
                            name="preamble"
                            value={docContent.preamble || ''}
                            onChange={onContentChange}
                            rows={3}
                            className="w-full text-xs p-2 rounded border border-slate-200 bg-white mb-2 focus:ring-1 focus:ring-indigo-500 outline-none"
                            placeholder="Preamble..."
                        />
                        <textarea
                            name="partiesDisclosing"
                            value={docContent.partiesDisclosing || ''}
                            onChange={onContentChange}
                            rows={2}
                            className="w-full text-xs p-2 rounded border border-slate-200 bg-white mb-2 focus:ring-1 focus:ring-indigo-500 outline-none"
                            placeholder="Disclosing Party Clause..."
                        />
                        <textarea
                            name="partiesReceiving"
                            value={docContent.partiesReceiving || ''}
                            onChange={onContentChange}
                            rows={2}
                            className="w-full text-xs p-2 rounded border border-slate-200 bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                            placeholder="Receiving Party Clause..."
                        />
                    </div>

                    {/* Draggable Sections */}
                    <div className="space-y-2">
                        <p className="font-semibold text-xs uppercase text-slate-500 pl-1">Agreement Clauses (Draggable)</p>
                        {docContent.sections.length === 0 && (
                            <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                                <p className="text-slate-400 text-sm">No custom sections added.</p>
                                <p className="text-slate-400 text-xs">Click below to add one.</p>
                            </div>
                        )}
                        <Reorder.Group axis="y" values={docContent.sections} onReorder={reorderSections} className="space-y-3">
                            {docContent.sections.map((section, index) => (
                                <Reorder.Item key={section.id} value={section} className="relative">
                                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm hover:border-indigo-300 transition-colors group">
                                        <div className="flex items-center justify-between p-2 border-b border-slate-100 bg-slate-50/30 rounded-t-lg">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-indigo-400 p-1">
                                                    <GripVertical size={16} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={section.title || ''}
                                                    onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                                                    className="bg-transparent font-bold text-sm text-slate-700 outline-none w-full"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleRemoveRequest(section.id)}
                                                className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                                                title="Delete Section"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="p-3">
                                            <textarea
                                                value={section.content || ''}
                                                onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                                                rows={4}
                                                className="w-full text-sm text-slate-600 outline-none resize-y bg-transparent placeholder-slate-300"
                                                placeholder="Enter clause content here..."
                                            />
                                        </div>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    </div>

                    <button
                        onClick={addSection}
                        className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-medium flex items-center justify-center gap-2 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 transition-all group"
                    >
                        <div className="bg-slate-100 group-hover:bg-indigo-100 rounded-full p-1 transition-colors">
                            <Plus size={18} />
                        </div>
                        Add New Section
                    </button>
                </div>
            )}

            {mode === 'sign' && (
                <div className="p-4">
                    <SignatureToolbar />
                </div>
            )}
        </div>
    );
};

export default NdaFormSidebar;

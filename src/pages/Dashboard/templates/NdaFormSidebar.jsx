import React, { useState } from 'react';
import { Reorder } from 'framer-motion';
import { PenTool, Edit3, Layers, Plus, Trash2, GripVertical, Calendar, User, FileText, Globe, Palette, Type } from 'lucide-react';
import { SidebarSection, SidebarInput } from '../../../components/Nda/SidebarComponents';
import { BuilderSectionCard, BuilderAddButton } from '../../../components/Common/BuilderComponents';
import { BrandingControls } from '../../../components/Common/BrandingControls';
import StyleEditor from '../../../components/Common/StyleEditor';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { getBusiness } from '../../../api/business';
import toast from 'react-hot-toast';
import { Building2 } from 'lucide-react';

const NdaFormSidebar = ({
    formData,
    onChange,
    docContent,
    onContentChange,
    // Section Props
    addSection,
    removeSection,
    updateSection,
    reorderSections,
    // Style Props
    styles,
    onStyleUpdate,
    onStyleReset
}) => {
    const [openSection, setOpenSection] = useState('parties');
    const [mode, setMode] = useState('fill'); // 'fill', 'edit', 'style'

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

    const handleFillBusinessInfo = async () => {
        try {
            const business = await getBusiness();
            if (business) {
                onChange({
                    target: { name: 'disclosingPartyName', value: business.name || '' }
                });
                const address = [business.address, business.city, business.state, business.country].filter(Boolean).join(', ');
                onChange({
                    target: { name: 'disclosingPartyAddress', value: address || '' }
                });
                toast.success("Business details populated");
            } else {
                toast.error("No business profile found");
            }
        } catch (error) {
            console.error("Failed to fetch business info", error);
            toast.error("Failed to load business info");
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
                        onClick={() => setMode('style')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === 'style' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        title="Appearance"
                    >
                        <Type size={16} />
                    </button>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        {mode === 'fill' ? 'Document Details' : mode === 'edit' ? 'Structure Builder' : 'Styling & Appearance'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        {mode === 'fill' ? 'Review and specify the agreement terms' : mode === 'edit' ? 'Customize layout and clauses' : 'Fonts, colors and spacing'}
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
                                <h4 className="text-xs font-bold text-indigo-900 uppercase mb-3 flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Disclosing Party
                                    </span>
                                    <button
                                        onClick={handleFillBusinessInfo}
                                        className="text-[10px] bg-white border border-indigo-200 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50 transition-colors flex items-center gap-1"
                                        title="Auto-fill with your business profile"
                                    >
                                        <Building2 size={10} /> Use Profile
                                    </button>
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

                    {/* Branding */}
                    <SidebarSection
                        title="Document Branding"
                        icon={Palette}
                        isOpen={openSection === 'branding'}
                        isComplete={true}
                        onClick={() => toggleSection('branding')}
                    >
                        <BrandingControls formData={formData} onChange={onChange} />
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
            )
            }


            {
                mode === 'edit' && (
                    // EDIT/BUILDER MODE: REORDER LIST
                    <div className="p-4 space-y-6 pb-20">
                        {/* Fixed Preamble Section */}
                        <BuilderSectionCard
                            isFixed={true}
                            section={{ title: "Preamble & Parties" }}
                            onUpdate={() => { }}
                        >
                            <div className="space-y-3 mt-3">
                                <textarea
                                    name="preamble"
                                    value={docContent.preamble || ''}
                                    onChange={onContentChange}
                                    rows={3}
                                    className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-y placeholder-slate-400"
                                    placeholder="Preamble..."
                                />
                                <div className="grid gap-3">
                                    <textarea
                                        name="partiesDisclosing"
                                        value={docContent.partiesDisclosing || ''}
                                        onChange={onContentChange}
                                        rows={2}
                                        className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-y placeholder-slate-400"
                                        placeholder="Disclosing Party Clause..."
                                    />
                                    <textarea
                                        name="partiesReceiving"
                                        value={docContent.partiesReceiving || ''}
                                        onChange={onContentChange}
                                        rows={2}
                                        className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-y placeholder-slate-400"
                                        placeholder="Receiving Party Clause..."
                                    />
                                </div>
                            </div>
                        </BuilderSectionCard>

                        <div className="relative">
                            <div className="absolute left-[7px] top-[-24px] bottom-0 w-[2px] bg-slate-100" />
                            <p className="font-bold text-[10px] uppercase tracking-widest text-slate-400 pl-8 mb-4">Structure</p>

                            <Reorder.Group axis="y" values={docContent.sections} onReorder={reorderSections} className="space-y-0">
                                {docContent.sections.map((section) => (
                                    <Reorder.Item key={section.id} value={section} className="relative mb-2">
                                        <BuilderSectionCard
                                            section={section}
                                            onUpdate={(field, value) => updateSection(section.id, field, value)}
                                            onRemove={() => handleRemoveRequest(section.id)}
                                            placeholderTitle="Section Title"
                                            placeholderContent="Section clauses..."
                                        />
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>

                            <BuilderAddButton onClick={addSection} />
                        </div>
                    </div>
                )
            }

            {
                mode === 'style' && (
                    <div className="p-4 pb-20">
                        <StyleEditor
                            styles={styles}
                            onUpdate={onStyleUpdate}
                            onReset={onStyleReset}
                        />
                    </div>
                )
            }
        </div >
    );
};

export default NdaFormSidebar;

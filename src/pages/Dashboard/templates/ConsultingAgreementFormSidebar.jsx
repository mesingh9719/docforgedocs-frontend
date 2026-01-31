import React, { useState } from 'react';
import { Reorder } from 'framer-motion';
import { PenTool, Edit3, Layers, User, Calendar, DollarSign, Palette, Type } from 'lucide-react';
import { SidebarSection, SidebarInput } from '../../../components/Nda/SidebarComponents';
import { BuilderSectionCard, BuilderAddButton } from '../../../components/Common/BuilderComponents';
import { BrandingControls } from '../../../components/Common/BrandingControls';
import StyleEditor from '../../../components/Common/StyleEditor';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { getBusiness } from '../../../api/business';
import toast from 'react-hot-toast';
import { Building2 } from 'lucide-react';

const ConsultingAgreementFormSidebar = ({
    formData,
    onChange,
    docContent,
    onContentChange,
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
    const [mode, setMode] = useState('fill');
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, sectionId: null });

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    // Completeness Checks
    const isDateComplete = formData.effectiveDateDay && formData.effectiveDateMonth && formData.effectiveDateYear;
    const isPartiesComplete = formData.clientName && formData.consultantName;
    const isTermsComplete = formData.startDate && formData.endDate && formData.feeAmount;
    const isSignatoriesComplete = formData.clientSignatoryName && formData.consultantSignatoryName;

    const handleRemoveRequest = (id) => {
        setConfirmModal({ isOpen: true, sectionId: id });
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
                onChange({ target: { name: 'clientName', value: business.name || '' } });
                const address = [business.address, business.city, business.state, business.country].filter(Boolean).join(', ');
                onChange({ target: { name: 'clientAddress', value: address || '' } });
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
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, sectionId: null })}
                onConfirm={handleConfirmRemove}
                title="Delete Section"
                message="Are you sure you want to remove this section? This action cannot be undone."
                confirmText="Delete Section"
                isDestructive={true}
            />

            <div className="p-6 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
                <div className="flex gap-1 bg-slate-200/50 p-1 rounded-lg mb-4">
                    <button
                        onClick={() => setMode('fill')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === 'fill' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Layers size={16} />
                    </button>
                    <button
                        onClick={() => setMode('edit')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === 'edit' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        title="Structure"
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
                        {mode === 'fill' ? 'Contract Details' : mode === 'edit' ? 'Structure Builder' : 'Styling & Appearance'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        {mode === 'fill' ? 'Enter contract terms' : mode === 'edit' ? 'Customize layout' : 'Fonts, colors and spacing'}
                    </p>
                </div>
            </div>

            {mode === 'fill' && (
                <>
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
                                    <span className="flex items-center gap-2">Client</span>
                                    <button
                                        onClick={handleFillBusinessInfo}
                                        className="text-[10px] bg-white border border-indigo-200 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-50 transition-colors flex items-center gap-1"
                                    >
                                        <Building2 size={10} /> Use Profile
                                    </button>
                                </h4>
                                <div className="space-y-3">
                                    <SidebarInput label="Client" name="clientName" value={formData.clientName} onChange={onChange} placeholder="Company A" />
                                    <SidebarInput label="Full Address" name="clientAddress" value={formData.clientAddress} onChange={onChange} placeholder="Address" rows={2} />
                                </div>
                            </div>

                            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                <h4 className="text-xs font-bold text-emerald-900 uppercase mb-3">Consultant</h4>
                                <div className="space-y-3">
                                    <SidebarInput label="Consultant" name="consultantName" value={formData.consultantName} onChange={onChange} placeholder="Jane Doe" />
                                    <SidebarInput label="Full Address" name="consultantAddress" value={formData.consultantAddress} onChange={onChange} placeholder="Address" rows={2} />
                                </div>
                            </div>
                        </div>
                    </SidebarSection>

                    <SidebarSection
                        title="Terms & Payment"
                        icon={DollarSign}
                        isOpen={openSection === 'terms'}
                        isComplete={isTermsComplete}
                        onClick={() => toggleSection('terms')}
                    >
                        <div className="space-y-3">
                            <SidebarInput label="Services Description" name="servicesDescription" value={formData.servicesDescription} onChange={onChange} placeholder="Describe services..." rows={3} />

                            <div className="grid grid-cols-2 gap-3">
                                <SidebarInput label="Start Date" name="startDate" value={formData.startDate} onChange={onChange} placeholder="Date" />
                                <SidebarInput label="End Date" name="endDate" value={formData.endDate} onChange={onChange} placeholder="Date" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <SidebarInput label="Fee Amount" name="feeAmount" value={formData.feeAmount} onChange={onChange} placeholder="$5,000" />
                                <SidebarInput label="Notice (Days)" name="noticePeriod" value={formData.noticePeriod} onChange={onChange} placeholder="30" />
                            </div>

                            <SidebarInput label="Payment Terms" name="paymentTerms" value={formData.paymentTerms} onChange={onChange} placeholder="Net 30, Upon Completion, etc." />
                        </div>
                    </SidebarSection>

                    <SidebarSection
                        title="Document Branding"
                        icon={Palette}
                        isOpen={openSection === 'branding'}
                        isComplete={true}
                        onClick={() => toggleSection('branding')}
                    >
                        <BrandingControls formData={formData} onChange={onChange} />
                    </SidebarSection>

                    <SidebarSection
                        title="Signatories"
                        icon={PenTool}
                        isOpen={openSection === 'signatures'}
                        isComplete={isSignatoriesComplete}
                        onClick={() => toggleSection('signatures')}
                    >
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-bold text-slate-400 mb-2 uppercase">For Client</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <SidebarInput label="Name" name="clientSignatoryName" value={formData.clientSignatoryName} onChange={onChange} placeholder="Client Rep" />
                                    <SidebarInput label="Title" name="clientSignatoryTitle" value={formData.clientSignatoryTitle} onChange={onChange} placeholder="Director" />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 mb-2 uppercase">For Consultant</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <SidebarInput label="Name" name="consultantSignatoryName" value={formData.consultantSignatoryName} onChange={onChange} placeholder="Consultant Name" />
                                    <SidebarInput label="Title" name="consultantSignatoryTitle" value={formData.consultantSignatoryTitle} onChange={onChange} placeholder="Title" />
                                </div>
                            </div>
                        </div>
                    </SidebarSection>
                </>
            )}

            {mode === 'edit' && (
                <div className="p-4 space-y-6 pb-20">
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
                                className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-slate-50 resize-y"
                                placeholder="Preamble..."
                            />
                            <div className="grid gap-3">
                                <textarea name="partiesDisclosing" value={docContent.partiesDisclosing || ''} onChange={onContentChange} rows={2} className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-slate-50 resize-y" placeholder="Client Clause..." />
                                <textarea name="partiesReceiving" value={docContent.partiesReceiving || ''} onChange={onContentChange} rows={2} className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-slate-50 resize-y" placeholder="Consultant Clause..." />
                            </div>
                        </div>
                    </BuilderSectionCard>

                    <div className="relative">
                        <div className="absolute left-[7px] top-[-24px] bottom-0 w-[2px] bg-slate-100" />
                        <p className="font-bold text-[10px] uppercase tracking-widest text-slate-400 pl-8 mb-4">Contract Sections</p>

                        <Reorder.Group axis="y" values={docContent.sections} onReorder={reorderSections} className="space-y-0">
                            {docContent.sections.map((section) => (
                                <Reorder.Item key={section.id} value={section} className="relative mb-2">
                                    <BuilderSectionCard
                                        section={section}
                                        onUpdate={(field, value) => updateSection(section.id, field, value)}
                                        onRemove={() => handleRemoveRequest(section.id)}
                                        placeholderTitle="Section Title"
                                        placeholderContent="Body text..."
                                    />
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>

                        <BuilderAddButton onClick={addSection} />
                    </div>
                </div>
            )}

            {mode === 'style' && (
                <div className="p-4 pb-20">
                    <StyleEditor
                        styles={styles}
                        onUpdate={onStyleUpdate}
                        onReset={onStyleReset}
                    />
                </div>
            )}
        </div>
    );
};

export default ConsultingAgreementFormSidebar;

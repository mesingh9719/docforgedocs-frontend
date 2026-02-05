import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { ChevronDown, Layers, Edit3, Plus, Trash2, GripVertical, FileText, User, List, DollarSign, Palette, Type, Shield, Briefcase, Target } from 'lucide-react';
import { BrandingControls } from '../../../components/Common/BrandingControls';
import { BuilderSectionCard, BuilderAddButton } from '../../../components/Common/BuilderComponents';
import StyleEditor from '../../../components/Common/StyleEditor';

const AccordionItem = ({ title, icon: Icon, isOpen, onClick, children }) => (
    <div className="border-b border-slate-100 last:border-none">
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 transition-colors ${isOpen ? 'bg-slate-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'}`}
        >
            <div className="flex items-center gap-3 font-semibold text-sm">
                {Icon && <Icon size={18} className={isOpen ? 'text-indigo-500' : 'text-slate-400'} />}
                <span>{title}</span>
            </div>
            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
            >
                <ChevronDown size={16} />
            </motion.div>
        </button>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <div className="p-4 pt-0 space-y-4">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const InputGroup = ({ label, name, value, onChange, placeholder, type = "text", rows }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
        {rows ? (
            <textarea
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400 resize-y"
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400"
            />
        )}
    </div>
);

const ProposalFormSidebar = ({
    formData,
    onChange,
    docContent,
    onContentChange,
    // Section Props
    addSection,
    removeSection,
    updateSection,
    reorderSections,
    // Timeline Props
    updateTimeline,
    addTimelineRow,
    removeTimelineRow,
    // Style Props
    styles,
    onStyleUpdate,
    onStyleReset,
    // List Handlers
    addListItem,
    removeListItem,
    updateListItem
}) => {
    const [openSection, setOpenSection] = useState('cover');
    const [mode, setMode] = useState('fill'); // 'fill', 'edit', 'style'

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    // Helper for List Sections
    const ListBuilder = ({ title, items, onAdd, onRemove, onUpdate, placeholder }) => (
        <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">{title}</label>
            <div className="space-y-2">
                {items && items.map((item, index) => (
                    <div key={index} className="flex gap-2 group relative">
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => onUpdate(index, e.target.value)}
                            placeholder={placeholder}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                        <button
                            onClick={() => onRemove(index)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove item"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
            <button
                onClick={onAdd}
                className="w-full py-2 border border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={14} /> Add Item
            </button>
        </div>
    );

    // Helper to edit section content directly
    const SectionInput = ({ title, label, placeholder, rows = 6 }) => {
        const section = docContent.sections.find(s => s.title === title) || docContent.sections.find(s => s.title.includes(title));
        if (!section) return null;

        return (
            <InputGroup
                label={label || title}
                name={`section_${section.id}`}
                value={section.content}
                onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                placeholder={placeholder}
                rows={rows}
            />
        );
    };

    return (
        <div className="bg-white min-h-full pb-20">
            {/* Header with Switcher */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
                <div className="flex gap-1 bg-slate-200/50 p-1 rounded-lg mb-4">
                    <button
                        onClick={() => setMode('fill')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === 'fill' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Layers size={16} />
                        Fill Details
                    </button>
                    <button
                        onClick={() => setMode('edit')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === 'edit' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Edit3 size={16} />
                        Builder
                    </button>
                    <button
                        onClick={() => setMode('style')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${mode === 'style' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Type size={16} />
                        Style
                    </button>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        {mode === 'fill' ? 'Proposal Details' : mode === 'edit' ? 'Structure Builder' : 'Styling & Appearance'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        {mode === 'fill' ? 'Enter project specifics and pricing' : mode === 'edit' ? 'Customize layout and clauses' : 'Fonts, colors and spacing'}
                    </p>
                </div>
            </div>

            {mode === 'fill' && (
                // FILL MODE
                <>
                    {/* Cover Page */}
                    <AccordionItem
                        title="Cover Page"
                        icon={FileText}
                        isOpen={openSection === 'cover'}
                        onClick={() => toggleSection('cover')}
                    >
                        <InputGroup label="Proposal Title" name="proposalTitle" value={formData.proposalTitle} onChange={onChange} placeholder="e.g. Mobile App Development" />
                        <InputGroup label="Project Description (Short)" name="projectDescription" value={formData.projectDescription} onChange={onChange} placeholder="Brief summary..." rows={2} />
                        <div className="grid grid-cols-2 gap-3">
                            <InputGroup label="Date" name="proposalDate" value={formData.proposalDate} onChange={onChange} placeholder="DD/MM/YYYY" />
                            <InputGroup label="Ref No." name="referenceNo" value={formData.referenceNo} onChange={onChange} placeholder="Optional" />
                        </div>
                    </AccordionItem>

                    {/* Branding */}
                    <AccordionItem
                        title="Document Branding"
                        icon={Palette}
                        isOpen={openSection === 'branding'}
                        onClick={() => toggleSection('branding')}
                    >
                        <BrandingControls formData={formData} onChange={onChange} />
                    </AccordionItem>

                    {/* Introduction & Objectives */}
                    <AccordionItem
                        title="Introduction & Goals"
                        icon={Target}
                        isOpen={openSection === 'intro'}
                        onClick={() => toggleSection('intro')}
                    >
                        <div className="space-y-6">
                            <SectionInput title="Introduction" placeholder="Executive summary and intro..." rows={4} />

                            <ListBuilder
                                title="Client Objectives"
                                items={formData.objectivesList}
                                onAdd={() => addListItem('objectivesList')}
                                onRemove={(idx) => removeListItem('objectivesList', idx)}
                                onUpdate={(idx, val) => updateListItem('objectivesList', idx, val)}
                                placeholder="E.g. Increase revenue by 20%"
                            />
                        </div>
                    </AccordionItem>

                    {/* Scope & Deliverables */}
                    <AccordionItem
                        title="Scope & Deliverables"
                        icon={Briefcase}
                        isOpen={openSection === 'scope'}
                        onClick={() => toggleSection('scope')}
                    >
                        <div className="space-y-8">
                            <ListBuilder
                                title="Services Included"
                                items={formData.scopeIncludedList}
                                onAdd={() => addListItem('scopeIncludedList')}
                                onRemove={(idx) => removeListItem('scopeIncludedList', idx)}
                                onUpdate={(idx, val) => updateListItem('scopeIncludedList', idx, val)}
                                placeholder="Service description..."
                            />

                            <ListBuilder
                                title="Services Excluded"
                                items={formData.scopeExcludedList}
                                onAdd={() => addListItem('scopeExcludedList')}
                                onRemove={(idx) => removeListItem('scopeExcludedList', idx)}
                                onUpdate={(idx, val) => updateListItem('scopeExcludedList', idx, val)}
                                placeholder="Excluded service..."
                            />

                            <div className="h-px bg-slate-100"></div>

                            <ListBuilder
                                title="Deliverables"
                                items={formData.deliverablesList}
                                onAdd={() => addListItem('deliverablesList')}
                                onRemove={(idx) => removeListItem('deliverablesList', idx)}
                                onUpdate={(idx, val) => updateListItem('deliverablesList', idx, val)}
                                placeholder="E.g. Final Report PDF"
                            />
                        </div>
                    </AccordionItem>

                    {/* Parties */}
                    <AccordionItem
                        title="Parties Involved"
                        icon={User}
                        isOpen={openSection === 'parties'}
                        onClick={() => toggleSection('parties')}
                    >
                        <div className="space-y-4">
                            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                <h4 className="text-xs font-bold text-indigo-900 uppercase mb-3">Prepared For (Client)</h4>
                                <div className="space-y-3">
                                    <InputGroup label="Client Name" name="clientName" value={formData.clientName} onChange={onChange} placeholder="Contact Person" />
                                    <InputGroup label="Company" name="clientCompany" value={formData.clientCompany} onChange={onChange} placeholder="Client Company" />
                                    <InputGroup label="Address" name="clientAddress" value={formData.clientAddress} onChange={onChange} placeholder="Full Address" rows={2} />
                                </div>
                            </div>

                            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                <h4 className="text-xs font-bold text-emerald-900 uppercase mb-3">Prepared By (Provider)</h4>
                                <div className="space-y-3">
                                    <InputGroup label="Your Name" name="providerName" value={formData.providerName} onChange={onChange} placeholder="Your Name" />
                                    <InputGroup label="Company" name="providerCompany" value={formData.providerCompany} onChange={onChange} placeholder="Your Company" />
                                    <InputGroup label="Address" name="providerAddress" value={formData.providerAddress} onChange={onChange} placeholder="Full Address" rows={2} />
                                </div>
                            </div>
                        </div>
                    </AccordionItem>

                    {/* Timeline Builder */}
                    <AccordionItem
                        title="Project Timeline"
                        icon={List}
                        isOpen={openSection === 'timeline'}
                        onClick={() => toggleSection('timeline')}
                    >
                        <div className="space-y-4">
                            {formData.timeline.map((item, index) => (
                                <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-3 relative group">
                                    <div className="grid grid-cols-[1fr_80px] gap-2 mb-2">
                                        <input
                                            value={item.phase || ''}
                                            onChange={(e) => updateTimeline(index, 'phase', e.target.value)}
                                            className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold text-slate-700"
                                            placeholder="Phase"
                                        />
                                        <input
                                            value={item.duration || ''}
                                            onChange={(e) => updateTimeline(index, 'duration', e.target.value)}
                                            className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-500 text-right"
                                            placeholder="Duration"
                                        />
                                    </div>
                                    <textarea
                                        value={item.description || ''}
                                        onChange={(e) => updateTimeline(index, 'description', e.target.value)}
                                        rows={2}
                                        className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-600 resize-none"
                                        placeholder="Phase Description..."
                                    />
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => removeTimelineRow(index)}
                                        className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 rounded-full p-1 shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addTimelineRow}
                                className="w-full py-2 border border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={14} /> Add Phase
                            </button>
                        </div>
                    </AccordionItem>

                    {/* Commercials */}
                    <AccordionItem
                        title="Commercials"
                        icon={DollarSign}
                        isOpen={openSection === 'commercials'}
                        onClick={() => toggleSection('commercials')}
                    >
                        <InputGroup label="Total Project Cost" name="totalProjectCost" value={formData.totalProjectCost} onChange={onChange} placeholder="e.g. $5,000 USD" />
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <InputGroup label="Payment Days" name="paymentDays" value={formData.paymentDays} onChange={onChange} placeholder="15" />
                            <InputGroup label="Validity (Days)" name="validityDays" value={formData.validityDays} onChange={onChange} placeholder="30" />
                        </div>
                        <div className="h-px bg-slate-100 my-3"></div>
                        <InputGroup label="Jurisdiction" name="jurisdiction" value={formData.jurisdiction} onChange={onChange} placeholder="State/Country" />
                    </AccordionItem>

                    {/* Legal Terms */}
                    <AccordionItem
                        title="Legal Terms"
                        icon={Shield}
                        isOpen={openSection === 'legal'}
                        onClick={() => toggleSection('legal')}
                    >
                        <div className="space-y-4">
                            <SectionInput title="Client Responsibilities" rows={3} />
                            <SectionInput title="Confidentiality" rows={3} />
                            <SectionInput title="Intellectual Property Rights" rows={3} />
                            <SectionInput title="Limitation of Liability" rows={3} />
                            <SectionInput title="Term & Termination" rows={3} />
                            <SectionInput title="Governing Law" rows={2} />
                        </div>
                    </AccordionItem>
                </>
            )}

            {mode === 'edit' && (
                // BUILDER MODE
                <div className="p-4 space-y-4 pb-20">
                    <div className="relative">
                        <div className="absolute left-[7px] top-4 bottom-0 w-[2px] bg-slate-100" />
                        <p className="font-bold text-[10px] uppercase tracking-widest text-slate-400 pl-8 mb-4">Proposal Structure</p>

                        <Reorder.Group axis="y" values={docContent.sections} onReorder={reorderSections} className="space-y-0">
                            {docContent.sections.map((section, index) => (
                                <Reorder.Item key={section.id} value={section} className="relative mb-2">
                                    <BuilderSectionCard
                                        section={section}
                                        onUpdate={(field, value) => updateSection(section.id, field, value)}
                                        onRemove={() => removeSection(section.id)}
                                        placeholderTitle="Section Title"
                                        placeholderContent="Section content..."
                                    />
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>

                        <BuilderAddButton onClick={addSection} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProposalFormSidebar;

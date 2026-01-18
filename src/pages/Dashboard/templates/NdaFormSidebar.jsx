import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { ChevronDown, Calendar, User, FileText, Globe, PenTool, Edit3, Layers, Plus, Trash2, GripVertical } from 'lucide-react';

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
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400 resize-y"
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder-slate-400"
            />
        )}
    </div>
);

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
    const [mode, setMode] = useState('fill'); // 'fill' or 'edit'

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
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
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900">{mode === 'fill' ? 'Document Details' : 'Structure Builder'}</h2>
                    <p className="text-xs text-slate-500 mt-1">{mode === 'fill' ? 'Review and specify the agreement terms' : 'Drag to reorder, add, or remove sections'}</p>
                </div>
            </div>

            {mode === 'fill' ? (
                // FILL MODE: STANDARD ACCORDION
                <>
                    {/* General Info */}
                    <AccordionItem
                        title="Effective Date"
                        icon={Calendar}
                        isOpen={openSection === 'date'}
                        onClick={() => toggleSection('date')}
                    >
                        <div className="grid grid-cols-3 gap-3">
                            <InputGroup label="Day" name="effectiveDateDay" value={formData.effectiveDateDay} onChange={onChange} placeholder="DD" />
                            <InputGroup label="Month" name="effectiveDateMonth" value={formData.effectiveDateMonth} onChange={onChange} placeholder="Month" />
                            <InputGroup label="Year" name="effectiveDateYear" value={formData.effectiveDateYear} onChange={onChange} placeholder="YY" />
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
                                <h4 className="text-xs font-bold text-indigo-900 uppercase mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Disclosing Party
                                </h4>
                                <div className="space-y-3">
                                    <InputGroup label="Name / Company" name="disclosingPartyName" value={formData.disclosingPartyName} onChange={onChange} placeholder="Ex: Acme Corp" />
                                    <InputGroup label="Full Address" name="disclosingPartyAddress" value={formData.disclosingPartyAddress} onChange={onChange} placeholder="Address" rows={2} />
                                </div>
                            </div>

                            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                <h4 className="text-xs font-bold text-emerald-900 uppercase mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Receiving Party
                                </h4>
                                <div className="space-y-3">
                                    <InputGroup label="Name / Company" name="receivingPartyName" value={formData.receivingPartyName} onChange={onChange} placeholder="Ex: John Doe" />
                                    <InputGroup label="Full Address" name="receivingPartyAddress" value={formData.receivingPartyAddress} onChange={onChange} placeholder="Address" rows={2} />
                                </div>
                            </div>
                        </div>
                    </AccordionItem>

                    {/* Purpose */}
                    <AccordionItem
                        title="Purpose Scope"
                        icon={FileText}
                        isOpen={openSection === 'purpose'}
                        onClick={() => toggleSection('purpose')}
                    >
                        <InputGroup
                            label="Description of Purpose"
                            name="purpose"
                            value={formData.purpose}
                            onChange={onChange}
                            placeholder="Describe why information is being shared (e.g., potential partnership, investment evaluation)..."
                            rows={6}
                        />
                    </AccordionItem>

                    {/* Terms */}
                    <AccordionItem
                        title="Terms & Jurisdiction"
                        icon={Globe}
                        isOpen={openSection === 'terms'}
                        onClick={() => toggleSection('terms')}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Term (Years)" name="termYears" value={formData.termYears} onChange={onChange} placeholder="2" />
                            <InputGroup label="Survival (Years)" name="survivalYears" value={formData.survivalYears} onChange={onChange} placeholder="5" />
                        </div>
                        <div className="h-px bg-slate-100 my-2"></div>
                        <InputGroup label="Jurisdiction" name="jurisdiction" value={formData.jurisdiction} onChange={onChange} placeholder="State/Country (e.g. California)" />
                        <InputGroup label="Court Location" name="courtCity" value={formData.courtCity} onChange={onChange} placeholder="City (e.g. San Francisco)" />
                    </AccordionItem>

                    {/* Signatures */}
                    <AccordionItem
                        title="Signatories"
                        icon={PenTool}
                        isOpen={openSection === 'signatures'}
                        onClick={() => toggleSection('signatures')}
                    >
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-bold text-slate-400 mb-2 uppercase">For Disclosing Party</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <InputGroup label="Name" name="disclosingSignatoryName" value={formData.disclosingSignatoryName} onChange={onChange} placeholder="Name" />
                                    <InputGroup label="Title" name="disclosingSignatoryDesignation" value={formData.disclosingSignatoryDesignation} onChange={onChange} placeholder="Title" />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 mb-2 uppercase">For Receiving Party</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <InputGroup label="Name" name="receivingSignatoryName" value={formData.receivingSignatoryName} onChange={onChange} placeholder="Name" />
                                    <InputGroup label="Title" name="receivingSignatoryDesignation" value={formData.receivingSignatoryDesignation} onChange={onChange} placeholder="Title" />
                                </div>
                            </div>
                        </div>
                    </AccordionItem>
                </>
            ) : (
                // EDIT/BUILDER MODE: REORDER LIST
                <div className="p-4 space-y-4">
                    {/* Fixed Preamble Section */}
                    <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                        <div className="flex items-center gap-2 mb-2 font-semibold text-xs uppercase text-slate-500">
                            <Layers size={14} /> Preamble & Parties (Fixed)
                        </div>
                        <textarea
                            name="preamble"
                            value={docContent.preamble}
                            onChange={onContentChange}
                            rows={3}
                            className="w-full text-xs p-2 rounded border border-slate-200 bg-white mb-2 focus:ring-1 focus:ring-indigo-500 outline-none"
                            placeholder="Preamble..."
                        />
                        <textarea
                            name="partiesDisclosing"
                            value={docContent.partiesDisclosing}
                            onChange={onContentChange}
                            rows={2}
                            className="w-full text-xs p-2 rounded border border-slate-200 bg-white mb-2 focus:ring-1 focus:ring-indigo-500 outline-none"
                            placeholder="Disclosing Party Clause..."
                        />
                        <textarea
                            name="partiesReceiving"
                            value={docContent.partiesReceiving}
                            onChange={onContentChange}
                            rows={2}
                            className="w-full text-xs p-2 rounded border border-slate-200 bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                            placeholder="Receiving Party Clause..."
                        />
                    </div>

                    {/* Draggable Sections */}
                    <div className="space-y-2">
                        <p className="font-semibold text-xs uppercase text-slate-500 pl-1">Agreement Clauses (Draggable)</p>
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
                                                    value={section.title}
                                                    onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                                                    className="bg-transparent font-bold text-sm text-slate-700 outline-none w-full"
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeSection(section.id)}
                                                className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                                                title="Delete Section"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="p-3">
                                            <textarea
                                                value={section.content}
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
        </div>
    );
};

export default NdaFormSidebar;

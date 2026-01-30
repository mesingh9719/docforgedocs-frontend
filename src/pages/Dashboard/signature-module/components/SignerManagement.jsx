import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, GripVertical, Shield, Trash2, Edit2 } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';

// Sortable Signer Item
const SortableSignerItem = ({ signer, onRemove, onEdit, isEditing, onUpdate, readOnly }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: signer.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all ${isDragging ? 'shadow-lg ring-2 ring-indigo-500/20' : ''} ${readOnly ? 'opacity-70 cursor-default' : ''}`}
        >
            <div className="flex items-center gap-3">
                {/* Drag Handle */}
                {!readOnly && ( // Hide drag handle if readOnly
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-move text-slate-400 hover:text-indigo-500 transition-colors p-1"
                    >
                        <GripVertical size={18} />
                    </div>
                )}

                {/* Order Badge */}
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {signer.order}
                </div>

                {/* Signer Info */}
                <div className="flex-1 min-w-0">
                    {isEditing && !readOnly ? ( // Only allow editing if not readOnly
                        <div className="space-y-2">
                            <input
                                type="text"
                                defaultValue={signer.name}
                                onBlur={(e) => onUpdate(signer.id, { name: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:border-indigo-500 outline-none"
                                placeholder="Name"
                                autoFocus
                                disabled={readOnly} // Make input disabled if readOnly
                            />
                            <input
                                type="email"
                                defaultValue={signer.email}
                                onBlur={(e) => onUpdate(signer.id, { email: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-slate-200 rounded focus:border-indigo-500 outline-none"
                                placeholder="Email"
                                disabled={readOnly} // Make input disabled if readOnly
                            />
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm font-medium text-slate-800 truncate">
                                {signer.name || "Unnamed Signer"}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {signer.email || "No email provided"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Role Badge - Simplified */}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${signer.role === 'signer'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-700'
                    }`}>
                    {signer.role}
                </span>

                {/* Actions - Hidden in ReadOnly */}
                {!readOnly && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit(isEditing ? null : signer.id)}
                            className={`p-1.5 rounded transition-colors ${isEditing ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-blue-50 text-slate-400 hover:text-blue-600'}`}
                            title="Edit"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={() => onRemove(signer.id)}
                            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-colors"
                            title="Remove"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const SignerManagement = ({ signers, onUpdateSigners, readOnly = false }) => {
    const [editingId, setEditingId] = React.useState(null);

    // Sensors for DndKit
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = signers.findIndex((s) => s.id === active.id);
            const newIndex = signers.findIndex((s) => s.id === over.id);

            const newSigners = [...signers];
            const [movedSigner] = newSigners.splice(oldIndex, 1);
            newSigners.splice(newIndex, 0, movedSigner);

            // Re-assign order numbers
            const reorderedSigners = newSigners.map((s, index) => ({
                ...s,
                order: index + 1
            }));

            onUpdateSigners(reorderedSigners);
        }
    };

    const updateSigner = (id, updates) => {
        onUpdateSigners(signers.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const removeSigner = (id) => {
        const remainingSigners = signers
            .filter(s => s.id !== id)
            .map((s, index) => ({ ...s, order: index + 1 }));
        onUpdateSigners(remainingSigners);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Signers</h3>
                    <p className="text-sm text-slate-500">Drag to reorder signing sequence</p>
                </div>
                <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">
                    {signers.length} {signers.length === 1 ? 'Person' : 'People'}
                </div>
            </div>

            {/* Signers List */}
            <div className="space-y-4">
                {signers.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                            <User size={20} className="text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-medium text-sm">No signers yet</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">
                            Drag a signature field onto the document to add a signer automatically.
                        </p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={signers.map(s => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {signers.map((signer) => (
                                    <SortableSignerItem
                                        key={signer.id}
                                        signer={signer}
                                        onRemove={removeSigner}
                                        onEdit={setEditingId}
                                        isEditing={editingId === signer.id}
                                        onUpdate={updateSigner}
                                        readOnly={readOnly}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            {/* Info Box */}
            {signers.length > 0 && (
                <div className="mt-6 p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                    <div className="flex items-start gap-3">
                        <Shield size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-500 leading-relaxed">
                            <span className="font-semibold text-slate-700">Sequential Signing:</span> Signers will receive the document in the order shown above ({1} to {signers.length}). Drag items to change the sequence.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignerManagement;
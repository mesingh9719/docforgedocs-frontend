import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import SignatureField from './SignatureField';

const SignatureLayer = ({ signatures, onUpdateSignature, onRemoveSignature, onEditSignature }) => {
    const { setNodeRef } = useDroppable({
        id: 'document-canvas',
    });

    return (
        <div
            ref={setNodeRef}
            className="absolute inset-0 z-20 pointer-events-none" // pointer-events-none lets clicks pass through to document text if no signature is there
        >
            {/* 
               However, to catch drops anywhere, the droppable needs to be fill?
               Actually, dnd-kit uses pointer events for detection.
               We need pointer-events-auto for this layer to receive drops?
               Wait, useDroppable doesn't strictly require pointer events if the measuring strategy is correct, 
               but usually for 'over', the element needs to be under the cursor.
               
               If we set pointer-events-auto, we block text selection on the document.
               Strategy: 
               - The layer itself is pointer-events-none usually.
               - But interacting with signature fields needs pointer-events-auto.
               - Dnd-kit's DragOverlay handles the "dragging" visual.
               - Detection of 'over' canvas: The canvas container needs to be registered.
            */}

            {signatures.map((sig) => (
                <div key={sig.id} className="pointer-events-auto">
                    {/* Wrapper to re-enable pointer events for the fields */}
                    <SignatureField
                        id={sig.id}
                        data={sig.metadata}
                        left={sig.position.x}
                        top={sig.position.y}
                        onEdit={() => onEditSignature(sig)}
                        onDelete={() => onRemoveSignature(sig.id)}
                    />
                </div>
            ))}
        </div>
    );
};

export default SignatureLayer;

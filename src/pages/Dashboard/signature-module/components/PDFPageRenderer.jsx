import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Page } from 'react-pdf';
import SignatureField, { SignatureFieldVisual } from '../../../../components/Nda/Signatures/SignatureField';

const PDFPageRenderer = ({
    pageNumber,
    signatures,
    onUpdateSignature,
    onRemoveSignature,
    onEditSignature,
    readOnly,
    onFieldClick,
    scale = 1,
    rotation = 0
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `page-${pageNumber}`,
    });

    return (
        <div
            ref={setNodeRef}
            className={`relative mb-6 transition-colors ${isOver ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
            style={{ width: 'fit-content', margin: '0 auto 1.5rem auto' }}
        >
            <Page
                pageNumber={pageNumber}
                className="" // Clean look
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={800} // Fixed width for consistency
                scale={scale}
                rotate={rotation}
            />

            {/* Render Signatures for this page */}
            {signatures.map(signature => (
                readOnly ? (
                    // In ReadOnly mode, we render just the visual.
                    // If onFieldClick is provided, make it interactive.
                    <div
                        key={signature.id}
                        className="absolute"
                        style={{
                            left: `${signature.position.x}%`,
                            top: `${signature.position.y}%`,
                            // If clickable (my field), add pointer cursor
                            cursor: (onFieldClick && signature.metadata?.isMine && !signature.metadata?.value) ? 'pointer' : 'default',
                            pointerEvents: 'auto' // Ensure it captures clicks overlaying the PDF
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onFieldClick) onFieldClick(signature);
                        }}
                    >
                        <SignatureFieldVisual
                            data={signature.metadata}
                            isSelected={false}
                            isDragging={false}
                            readOnly={true}
                        />
                    </div>
                ) : (
                    <SignatureField
                        key={signature.id}
                        id={signature.id}
                        data={signature.metadata}
                        left={signature.position.x}
                        top={signature.position.y}
                        onUpdate={onUpdateSignature}
                        onRemove={onRemoveSignature}
                        onEdit={onEditSignature}
                    />
                )
            ))}
        </div>
    );
};

export default PDFPageRenderer;

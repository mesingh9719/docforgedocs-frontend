import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Page } from 'react-pdf';

const PDFPageRenderer = ({ pageNumber, scale, children }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `page-${pageNumber}`,
        data: {
            type: 'pdf-page',
            pageNumber: pageNumber
        }
    });

    return (
        <div
            ref={setNodeRef}
            className={`relative mb-6 transition-colors shadow-md ${isOver ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
            style={{ width: 'fit-content', margin: '0 auto 1.5rem auto' }}
        >
            <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-sm"
                loading={
                    <div className="w-[600px] h-[800px] bg-white animate-pulse rounded-lg flex items-center justify-center">
                        <span className="text-slate-400 font-medium">Loading Page {pageNumber}...</span>
                    </div>
                }
            />
            {children}
        </div>
    );
};

export default PDFPageRenderer;

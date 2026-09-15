import React, { useState, useCallback, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Action Types
const ACTIONS = {
    ADD_BLOCK: 'ADD_BLOCK',
    UPDATE_BLOCK: 'UPDATE_BLOCK',
    REMOVE_BLOCK: 'REMOVE_BLOCK',
    DUPLICATE_BLOCK: 'DUPLICATE_BLOCK',
    MOVE_BLOCK: 'MOVE_BLOCK',
    REORDER_BLOCKS: 'REORDER_BLOCKS',
    SET_METADATA: 'SET_METADATA',
    SET_PAGE_SETTINGS: 'SET_PAGE_SETTINGS',
    ADD_VARIABLE: 'ADD_VARIABLE',
    UPDATE_VARIABLE: 'UPDATE_VARIABLE',
    LOAD_DOCUMENT: 'LOAD_DOCUMENT',
    SELECT_BLOCK: 'SELECT_BLOCK',
};

const initialState = {
    metadata: {
        title: 'Untitled Template',
        version: 1,
        theme: 'default',
        category: 'general',
        description: '',
    },
    pageSettings: {
        size: 'A4', // 'A4', 'Letter', 'Legal'
        orientation: 'portrait', // 'portrait', 'landscape'
        margins: {
            top: '20mm',
            bottom: '20mm',
            left: '20mm',
            right: '20mm',
        },
        backgroundColor: '#ffffff',
        fontFamily: 'Inter, sans-serif',
    },
    variables: {},
    blocks: [],
    selectedBlockId: null,
    history: { past: [], future: [] },
};

function documentReducer(state, action) {
    switch (action.type) {
        case ACTIONS.LOAD_DOCUMENT: {
            const payload = action.payload || {};
            // Normalize blocks to ensure both data/content properties are accessible
            const normalizedBlocks = (payload.blocks || []).map((b) => ({
                id: b.id || uuidv4(),
                type: b.type,
                data: b.data || b.content || {},
                styles: b.styles || b.style || {},
            }));

            return {
                ...initialState,
                ...payload,
                blocks: normalizedBlocks,
                pageSettings: {
                    ...initialState.pageSettings,
                    ...(payload.pageSettings || payload.page || {}),
                },
                metadata: {
                    ...initialState.metadata,
                    ...(payload.metadata || {}),
                },
                selectedBlockId: normalizedBlocks.length > 0 ? normalizedBlocks[0].id : null,
                history: initialState.history,
            };
        }

        case ACTIONS.ADD_BLOCK: {
            const newBlock = {
                id: uuidv4(),
                type: action.payload.type,
                data: action.payload.data || action.payload.content || {},
                styles: action.payload.styles || {},
            };
            const newBlocks = [...state.blocks];
            if (typeof action.payload.index === 'number') {
                newBlocks.splice(action.payload.index, 0, newBlock);
            } else {
                newBlocks.push(newBlock);
            }
            return { ...state, blocks: newBlocks, selectedBlockId: newBlock.id };
        }

        case ACTIONS.UPDATE_BLOCK: {
            const newBlocks = state.blocks.map((block) => {
                if (block.id === action.payload.id) {
                    const updatedData = { ...block.data, ...action.payload.data };
                    return {
                        ...block,
                        data: updatedData,
                        content: updatedData, // keep backward compatibility
                        styles: action.payload.styles !== undefined ? { ...block.styles, ...action.payload.styles } : block.styles,
                    };
                }
                return block;
            });
            return { ...state, blocks: newBlocks };
        }

        case ACTIONS.REMOVE_BLOCK:
            return {
                ...state,
                blocks: state.blocks.filter((b) => b.id !== action.payload.id),
                selectedBlockId: state.selectedBlockId === action.payload.id ? null : state.selectedBlockId,
            };

        case ACTIONS.DUPLICATE_BLOCK: {
            const targetIndex = state.blocks.findIndex((b) => b.id === action.payload.id);
            if (targetIndex === -1) return state;
            const targetBlock = state.blocks[targetIndex];
            const clonedBlock = {
                ...targetBlock,
                id: uuidv4(),
                data: JSON.parse(JSON.stringify(targetBlock.data || {})),
                styles: JSON.parse(JSON.stringify(targetBlock.styles || {})),
            };
            const newBlocks = [...state.blocks];
            newBlocks.splice(targetIndex + 1, 0, clonedBlock);
            return { ...state, blocks: newBlocks, selectedBlockId: clonedBlock.id };
        }

        case ACTIONS.MOVE_BLOCK: {
            const { id, direction } = action.payload; // 'up' or 'down'
            const index = state.blocks.findIndex((b) => b.id === id);
            if (index === -1) return state;
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= state.blocks.length) return state;

            const newBlocks = [...state.blocks];
            const [movedBlock] = newBlocks.splice(index, 1);
            newBlocks.splice(newIndex, 0, movedBlock);
            return { ...state, blocks: newBlocks };
        }

        case ACTIONS.REORDER_BLOCKS:
            return { ...state, blocks: action.payload.blocks };

        case ACTIONS.SET_METADATA:
            return { ...state, metadata: { ...state.metadata, ...action.payload } };

        case ACTIONS.SET_PAGE_SETTINGS:
            return { ...state, pageSettings: { ...state.pageSettings, ...action.payload } };

        case ACTIONS.ADD_VARIABLE:
            return {
                ...state,
                variables: { ...state.variables, [action.payload.key]: action.payload.config },
            };

        case ACTIONS.UPDATE_VARIABLE:
            return {
                ...state,
                variables: {
                    ...state.variables,
                    [action.payload.key]: {
                        ...state.variables[action.payload.key],
                        ...action.payload.config,
                    },
                },
            };

        case ACTIONS.SELECT_BLOCK:
            return { ...state, selectedBlockId: action.payload.id };

        default:
            return state;
    }
}

export const useDocumentEngine = (initialData = null) => {
    const [state, dispatch] = useReducer(documentReducer, initialData || initialState);

    const loadDocument = useCallback((data) => dispatch({ type: ACTIONS.LOAD_DOCUMENT, payload: data }), []);
    const addBlock = useCallback((type, data = {}, index = null, styles = {}) => dispatch({ type: ACTIONS.ADD_BLOCK, payload: { type, data, index, styles } }), []);
    const updateBlock = useCallback((id, data, styles) => dispatch({ type: ACTIONS.UPDATE_BLOCK, payload: { id, data, styles } }), []);
    const removeBlock = useCallback((id) => dispatch({ type: ACTIONS.REMOVE_BLOCK, payload: { id } }), []);
    const duplicateBlock = useCallback((id) => dispatch({ type: ACTIONS.DUPLICATE_BLOCK, payload: { id } }), []);
    const moveBlock = useCallback((id, direction) => dispatch({ type: ACTIONS.MOVE_BLOCK, payload: { id, direction } }), []);
    const reorderBlocks = useCallback((blocks) => dispatch({ type: ACTIONS.REORDER_BLOCKS, payload: { blocks } }), []);
    const setMetadata = useCallback((data) => dispatch({ type: ACTIONS.SET_METADATA, payload: data }), []);
    const setPageSettings = useCallback((data) => dispatch({ type: ACTIONS.SET_PAGE_SETTINGS, payload: data }), []);
    const addVariable = useCallback((key, config) => dispatch({ type: ACTIONS.ADD_VARIABLE, payload: { key, config } }), []);
    const updateVariable = useCallback((key, config) => dispatch({ type: ACTIONS.UPDATE_VARIABLE, payload: { key, config } }), []);
    const selectBlock = useCallback((id) => dispatch({ type: ACTIONS.SELECT_BLOCK, payload: { id } }), []);

    return {
        documentState: state,
        actions: {
            loadDocument,
            addBlock,
            updateBlock,
            removeBlock,
            duplicateBlock,
            moveBlock,
            reorderBlocks,
            setMetadata,
            setPageSettings,
            addVariable,
            updateVariable,
            selectBlock,
        },
    };
};

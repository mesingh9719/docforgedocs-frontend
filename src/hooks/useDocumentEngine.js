import React, { useState, useCallback, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Action Types as constants
const ACTIONS = {
    ADD_BLOCK: 'ADD_BLOCK',
    UPDATE_BLOCK: 'UPDATE_BLOCK',
    REMOVE_BLOCK: 'REMOVE_BLOCK',
    REORDER_BLOCKS: 'REORDER_BLOCKS',
    SET_METADATA: 'SET_METADATA',
    ADD_VARIABLE: 'ADD_VARIABLE',
    UPDATE_VARIABLE: 'UPDATE_VARIABLE',
    LOAD_DOCUMENT: 'LOAD_DOCUMENT',
    SELECT_BLOCK: 'SELECT_BLOCK' // [NEW]
};

// ... existing initial state ...
const initialState = {
    metadata: {
        title: 'Untitled Document',
        version: '1.0',
        theme: 'default'
    },
    variables: {},
    blocks: [],
    selectedBlockId: null, // [NEW]
    history: { past: [], future: [] }
};

// ... reducer updates ...
function documentReducer(state, action) {
    switch (action.type) {
        case ACTIONS.LOAD_DOCUMENT:
            return { ...initialState, ...action.payload, history: initialState.history };

        case ACTIONS.ADD_BLOCK: {
            const newBlock = {
                id: uuidv4(),
                type: action.payload.type,
                data: action.payload.data || {}
            };
            const newBlocks = [...state.blocks];
            // If index is not provided, append to end
            if (typeof action.payload.index === 'number') {
                newBlocks.splice(action.payload.index, 0, newBlock);
            } else {
                newBlocks.push(newBlock);
            }
            // Auto-select new block
            return { ...state, blocks: newBlocks, selectedBlockId: newBlock.id };
        }

        case ACTIONS.UPDATE_BLOCK: {
            const newBlocks = state.blocks.map(block =>
                block.id === action.payload.id
                    ? { ...block, data: { ...block.data, ...action.payload.data } }
                    : block
            );
            return { ...state, blocks: newBlocks };
        }

        case ACTIONS.REMOVE_BLOCK:
            return {
                ...state,
                blocks: state.blocks.filter(b => b.id !== action.payload.id),
                selectedBlockId: state.selectedBlockId === action.payload.id ? null : state.selectedBlockId
            };

        case ACTIONS.REORDER_BLOCKS:
            return { ...state, blocks: action.payload.blocks };

        case ACTIONS.SET_METADATA:
            return { ...state, metadata: { ...state.metadata, ...action.payload } };

        case ACTIONS.ADD_VARIABLE:
            return { ...state, variables: { ...state.variables, [action.payload.key]: action.payload.config } };

        case ACTIONS.UPDATE_VARIABLE:
            return {
                ...state,
                variables: {
                    ...state.variables,
                    [action.payload.key]: {
                        ...state.variables[action.payload.key],
                        ...action.payload.config
                    }
                }
            };

        case ACTIONS.SELECT_BLOCK: // [NEW]
            return { ...state, selectedBlockId: action.payload.id };

        default:
            return state;
    }
}

// ... hook wrapper ...
export const useDocumentEngine = (initialData = null) => {
    const [state, dispatch] = useReducer(documentReducer, initialData || initialState);

    // ... existing actions ...
    const loadDocument = useCallback((data) => dispatch({ type: ACTIONS.LOAD_DOCUMENT, payload: data }), []);
    const addBlock = useCallback((type, data = {}, index = null) => dispatch({ type: ACTIONS.ADD_BLOCK, payload: { type, data, index } }), []);
    const updateBlock = useCallback((id, data) => dispatch({ type: ACTIONS.UPDATE_BLOCK, payload: { id, data } }), []);
    const removeBlock = useCallback((id) => dispatch({ type: ACTIONS.REMOVE_BLOCK, payload: { id } }), []);
    const reorderBlocks = useCallback((blocks) => dispatch({ type: ACTIONS.REORDER_BLOCKS, payload: { blocks } }), []);
    const setMetadata = useCallback((data) => dispatch({ type: ACTIONS.SET_METADATA, payload: data }), []);
    const addVariable = useCallback((key, config) => dispatch({ type: ACTIONS.ADD_VARIABLE, payload: { key, config } }), []);
    const updateVariable = useCallback((key, config) => dispatch({ type: ACTIONS.UPDATE_VARIABLE, payload: { key, config } }), []);

    // [NEW]
    const selectBlock = useCallback((id) => dispatch({ type: ACTIONS.SELECT_BLOCK, payload: { id } }), []);

    return {
        documentState: state,
        actions: {
            loadDocument,
            addBlock,
            updateBlock,
            removeBlock,
            reorderBlocks,
            setMetadata,
            addVariable,
            updateVariable,
            selectBlock
        }
    };
};

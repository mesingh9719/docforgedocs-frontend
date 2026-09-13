import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Autosave hook — debounced save with visual status tracking.
 *
 * @param {Function} saveFn - Async function that performs the save
 * @param {any} data - The data to watch for changes (triggers autosave on change)
 * @param {Object} options
 * @param {number} options.debounceMs - Debounce delay in ms (default: 4000)
 * @param {boolean} options.enabled - Whether autosave is active (default: true)
 *
 * @returns {{ saveStatus: string, lastSavedAt: Date|null, triggerSave: Function }}
 *   saveStatus: 'idle' | 'saving' | 'saved' | 'error' | 'unsaved'
 */
export const useAutosave = (saveFn, data, { debounceMs = 4000, enabled = true } = {}) => {
    const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved, error, unsaved
    const [lastSavedAt, setLastSavedAt] = useState(null);
    const timerRef = useRef(null);
    const isFirstRender = useRef(true);
    const isSavingRef = useRef(false);
    const saveFnRef = useRef(saveFn);

    // Keep saveFn ref up to date
    saveFnRef.current = saveFn;

    // Core save function
    const executeSave = useCallback(async () => {
        if (isSavingRef.current) return;
        isSavingRef.current = true;
        setSaveStatus('saving');

        try {
            await saveFnRef.current();
            setSaveStatus('saved');
            setLastSavedAt(new Date());
        } catch (error) {
            console.error('Autosave failed:', error);
            setSaveStatus('error');
        } finally {
            isSavingRef.current = false;
        }
    }, []);

    // Watch data changes and debounce save
    useEffect(() => {
        // Skip first render (initial load is not a user change)
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (!enabled) return;

        setSaveStatus('unsaved');

        // Clear existing timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Set new debounced timer
        timerRef.current = setTimeout(() => {
            executeSave();
        }, debounceMs);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [data, debounceMs, enabled, executeSave]);

    // Manual trigger (for explicit save button)
    const triggerSave = useCallback(async () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        await executeSave();
    }, [executeSave]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return { saveStatus, lastSavedAt, triggerSave };
};

/**
 * Variable Resolver Engine
 * Safely resolves dynamic variables {{path.to.variable | pipe:arg || 'fallback'}} in strings, blocks, and templates.
 */

/**
 * Get value from context using dot notation, underscore fallback, or flat key lookup.
 */
export const getNestedValue = (obj, path) => {
    if (!obj || typeof obj !== 'object' || !path) return undefined;

    // 1. Exact flat match first
    if (path in obj && obj[path] !== undefined && obj[path] !== null) {
        return obj[path];
    }

    // 2. Dot-separated path traversal (e.g. "company.name")
    const segments = path.split('.');
    let current = obj;
    for (const segment of segments) {
        if (current === undefined || current === null) break;
        current = current[segment];
    }
    if (current !== undefined && current !== null) {
        return current;
    }

    // 3. Try underscore-separated alias if dot path failed (e.g. "client.name" -> "client_name")
    const underscoreKey = path.replace(/\./g, '_');
    if (underscoreKey in obj && obj[underscoreKey] !== undefined && obj[underscoreKey] !== null) {
        return obj[underscoreKey];
    }

    // 4. Try dot alias if underscore was passed (e.g. "client_name" -> "client.name")
    const dotKey = path.replace(/_/g, '.');
    if (dotKey !== path) {
        return getNestedValue(obj, dotKey);
    }

    return undefined;
};

/**
 * Format a value using registered pipe formatters.
 */
export const applyPipe = (value, pipeExpr) => {
    if (!pipeExpr) return value;
    const [pipeName, ...argParts] = pipeExpr.split(':').map((s) => s.trim());
    const arg = argParts.join(':').replace(/^['"]|['"]$/g, ''); // strip outer quotes

    switch (pipeName.toLowerCase()) {
        case 'date': {
            if (!value) return '';
            const dateObj = new Date(value);
            if (isNaN(dateObj.getTime())) return String(value);

            if (arg === 'long') {
                return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            }
            if (arg === 'short' || arg === 'YYYY-MM-DD') {
                return dateObj.toISOString().split('T')[0];
            }
            return dateObj.toLocaleDateString('en-US');
        }

        case 'currency': {
            const num = parseFloat(value);
            if (isNaN(num)) return value !== undefined && value !== null ? String(value) : '$0.00';
            const symbol = arg || '$';
            return `${symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        case 'number': {
            const num = parseFloat(value);
            if (isNaN(num)) return String(value || 0);
            const decimals = parseInt(arg, 10);
            return !isNaN(decimals) && decimals >= 0 && decimals <= 100
                ? num.toFixed(decimals)
                : num.toLocaleString('en-US');
        }

        case 'percent': {
            const num = parseFloat(value);
            if (isNaN(num)) return `${value}%`;
            return `${num}%`;
        }

        case 'uppercase':
            return String(value || '').toUpperCase();

        case 'lowercase':
            return String(value || '').toLowerCase();

        case 'capitalize': {
            const str = String(value || '');
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        default:
            return value;
    }
};

/**
 * Resolve a single variable token expression (e.g. "client.name | uppercase || 'Valued Client'").
 */
export const resolveExpression = (expr, context = {}, options = {}) => {
    let rawExpr = expr.trim();
    let fallback = '';

    // Check for fallback: "var.name || 'Default Value'"
    if (rawExpr.includes('||')) {
        const parts = rawExpr.split('||');
        rawExpr = parts[0].trim();
        fallback = parts.slice(1).join('||').trim().replace(/^['"]|['"]$/g, '');
    }

    // Check for pipe: "var.name | currency:'USD'"
    let pipeExpr = null;
    if (rawExpr.includes('|')) {
        const parts = rawExpr.split('|');
        rawExpr = parts[0].trim();
        pipeExpr = parts.slice(1).join('|').trim();
    }

    const value = getNestedValue(context, rawExpr);

    if (value !== undefined && value !== null && value !== '') {
        const formatted = applyPipe(value, pipeExpr);
        return String(formatted);
    }

    if (fallback) {
        return fallback;
    }

    if (options.keepUnresolved) {
        return `{{${expr}}}`;
    }

    return options.fallbackPlaceholder || '';
};

/**
 * Resolve all {{...}} placeholders within a text string.
 */
export const resolveVariables = (text, context = {}, options = {}) => {
    if (typeof text !== 'string' || !text.includes('{{')) {
        return text;
    }

    return text.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, expr) => {
        return resolveExpression(expr, context, options);
    });
};

/**
 * Extract all unique variable names referenced inside a text string or block tree.
 */
export const extractVariables = (content) => {
    const found = new Set();
    const regex = /\{\{\s*([^}|]+?)(?:\s*\||\s*\|\||\s*\}\})/g;

    const scanString = (str) => {
        if (typeof str !== 'string') return;
        let match;
        while ((match = regex.exec(str)) !== null) {
            const key = match[1].trim();
            if (key) found.add(key);
        }
    };

    const scanObject = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        if (Array.isArray(obj)) {
            obj.forEach(scanObject);
        } else {
            Object.values(obj).forEach((val) => {
                if (typeof val === 'string') scanString(val);
                else if (typeof val === 'object') scanObject(val);
            });
        }
    };

    if (typeof content === 'string') {
        scanString(content);
    } else if (typeof content === 'object') {
        scanObject(content);
    }

    return Array.from(found);
};

/**
 * Recursively resolve variables across an entire block or list of blocks.
 */
export const resolveBlocks = (blocks = [], context = {}, options = {}) => {
    if (!Array.isArray(blocks)) return [];

    const resolveValue = (val) => {
        if (typeof val === 'string') {
            return resolveVariables(val, context, options);
        }
        if (Array.isArray(val)) {
            return val.map(resolveValue);
        }
        if (val && typeof val === 'object') {
            const resolvedObj = {};
            Object.entries(val).forEach(([k, v]) => {
                resolvedObj[k] = resolveValue(v);
            });
            return resolvedObj;
        }
        return val;
    };

    return blocks.map((block) => ({
        ...block,
        data: resolveValue(block.data || block.content || {}),
        content: resolveValue(block.content || block.data || {}),
    }));
};

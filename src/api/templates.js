import axios from './axios';

/**
 * List templates with optional filters (tab, category, type, status, search, pagination).
 */
export const getTemplates = async (params = {}) => {
    const response = await axios.get('/templates', { params });
    return response.data;
};

/**
 * List system predefined blueprints.
 */
export const getPredefinedTemplates = async () => {
    const response = await axios.get('/templates/predefined');
    return response.data;
};

/**
 * Get a specific template by ID with its content and version history.
 */
export const getTemplate = async (id) => {
    const response = await axios.get(`/templates/${id}`);
    return response.data;
};

/**
 * Create a new custom template.
 */
export const createTemplate = async (data) => {
    const response = await axios.post('/templates', data);
    return response.data;
};

/**
 * Update an existing template (increments version if content changes).
 */
export const updateTemplate = async (id, data) => {
    const response = await axios.put(`/templates/${id}`, data);
    return response.data;
};

/**
 * Delete a template (soft delete).
 */
export const deleteTemplate = async (id) => {
    const response = await axios.delete(`/templates/${id}`);
    return response.data;
};

/**
 * Duplicate an existing template.
 */
export const duplicateTemplate = async (id, data = {}) => {
    const response = await axios.post(`/templates/${id}/duplicate`, data);
    return response.data;
};

/**
 * Toggle archive/active status for a template.
 */
export const archiveTemplate = async (id) => {
    const response = await axios.post(`/templates/${id}/archive`);
    return response.data;
};

/**
 * Use template: instantiates a document or routes to the appropriate editor.
 */
export const useTemplate = async (id, data = {}) => {
    const response = await axios.post(`/templates/${id}/use`, data);
    return response.data;
};

/**
 * Get full version history of a template.
 */
export const getTemplateVersions = async (id) => {
    const response = await axios.get(`/templates/${id}/versions`);
    return response.data;
};

/**
 * Publish a template (sets status to active, creates published version snapshot).
 */
export const publishTemplate = async (id, data = {}) => {
    const response = await axios.post(`/templates/${id}/publish`, data);
    return response.data;
};

/**
 * Restore a historical template version.
 */
export const restoreTemplateVersion = async (id, versionId) => {
    const response = await axios.post(`/templates/${id}/restore/${versionId}`);
    return response.data;
};

/**
 * Create a manual named snapshot of a template version.
 */
export const createTemplateVersion = async (id, data = {}) => {
    const response = await axios.post(`/templates/${id}/versions`, data);
    return response.data;
};

/**
 * Update template visibility and sharing permissions.
 */
export const shareTemplate = async (id, data) => {
    const response = await axios.post(`/templates/${id}/share`, data);
    return response.data;
};

/**
 * Upload a PDF template file and get extracted page metadata.
 */
export const uploadTemplatePdf = async (file, name, description = '') => {
    const formData = new FormData();
    formData.append('file', file);
    if (name) formData.append('name', name);
    if (description) formData.append('description', description);
    
    const response = await axios.post('/templates/upload-pdf', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

/**
 * Fetch base PDF file blob for a template.
 */
export const getTemplatePdfBlob = async (id) => {
    const response = await axios.get(`/templates/${id}/pdf-file`, {
        responseType: 'blob',
    });
    return response.data;
};

/**
 * Render template with filled or bound variable values and get flattened PDF blob.
 */
export const renderTemplatePdfBlob = async (id, payload = {}) => {
    const response = await axios.post(`/templates/${id}/render-pdf`, payload, {
        responseType: 'blob',
    });
    return response.data;
};



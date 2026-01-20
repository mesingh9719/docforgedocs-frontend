import axios from './axios';

export const getDocuments = async (params = {}) => {
    const response = await axios.get('/documents', { params });
    return response.data;
};

export const getDocument = async (id) => {
    const response = await axios.get(`/documents/${id}`);
    return response.data;
};

export const createDocument = async (data) => {
    const response = await axios.post('/documents', data);
    return response.data;
};

export const updateDocument = async (id, data) => {
    const response = await axios.put(`/documents/${id}`, data);
    return response.data;
};

export const deleteDocument = async (id) => {
    await axios.delete(`/documents/${id}`);
};

export const generatePdf = async (id, htmlContent) => {
    // Send html_content to backend
    const response = await axios.post(`/documents/${id}/generate-pdf`, { html_content: htmlContent });
    return response.data;
};

export const getNextInvoiceNumber = async () => {
    const response = await axios.get('/documents/next-invoice-number');
    return response.data;
};

export const sendDocument = async (id, email, message) => {
    const response = await axios.post(`/documents/${id}/send`, { email, message });
    return response.data;
};

export const remindDocument = async (id, email, message) => {
    const response = await axios.post(`/documents/${id}/remind`, { email, message });
    return response.data;
};

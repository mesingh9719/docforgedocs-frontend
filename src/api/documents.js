import axios from './axios';

export const getDocuments = async () => {
    const response = await axios.get('/documents');
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

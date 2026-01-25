import axios from './axios';

export const getPublicPosts = async (params = {}) => {
    const response = await axios.get('/public/posts', { params });
    return response.data;
};

export const getPublicPostBySlug = async (slug) => {
    const response = await axios.get(`/public/posts/${slug}`);
    return response.data;
};

export const getPublicCategories = async () => {
    const response = await axios.get('/public/categories');
    return response.data;
};

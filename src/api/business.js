import axios from './axios';

/**
 * Update the authenticated user's business settings.
 * @param {Object} data - Key-value pairs of settings to update.
 * @returns {Promise<Object>} - The updated business object wrapped in data.
 */
export const updateBusiness = async (data) => {
    let response;
    if (data instanceof FormData) {
        data.append('_method', 'PUT');
        response = await axios.post('/business', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } else {
        response = await axios.put('/business', data);
    }
    return response.data;
};

/**
 * Fetch the authenticated user's business data.
 * Currently uses the user endpoint as the business is attached to the user.
 * @returns {Promise<Object>}
 */
export const getBusiness = async () => {
    const response = await axios.get('/user');
    // The user resource has a 'business' relationship
    return response.data.data.business;
};

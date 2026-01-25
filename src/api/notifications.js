import api from './axios';

export const getNotifications = () => {
    return api.get('/notifications');
};

export const markAllNotificationsRead = () => {
    return api.post('/notifications/mark-all-read');
};

export const markNotificationRead = (id) => {
    return api.post(`/notifications/${id}/read`);
};

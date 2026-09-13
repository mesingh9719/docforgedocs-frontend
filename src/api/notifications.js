import api from './axios';

export const getNotifications = () => {
    return api.get('/notifications');
};

export const markAllNotificationsRead = () => {
    return api.post('/notifications/mark-all-read');
};

export const markNotificationRead = (id) => {
    return api.put(`/notifications/${id}/read`);
};

export const getUnreadCount = () => {
    return api.get('/notifications/unread-count');
};

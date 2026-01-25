import axios from './axios';

export const getDashboardStats = () => axios.get('/dashboard/stats');
export const getDashboardAnalytics = (params) => axios.get('/dashboard/analytics', { params });
export const getRecentActivity = () => axios.get('/dashboard/activity');

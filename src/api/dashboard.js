import axios from './axios';

export const getDashboardStats = () => axios.get('/dashboard/stats');
export const getRecentActivity = () => axios.get('/dashboard/activity');

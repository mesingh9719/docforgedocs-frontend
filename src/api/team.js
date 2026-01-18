import axios from './axios';

export const getTeamMembers = () => axios.get('/team');

export const inviteMember = (data) => axios.post('/team', data);

export const updateMember = (id, data) => axios.put(`/team/${id}`, data);

export const removeMember = (id) => axios.delete(`/team/${id}`);

export const acceptInvite = (data) => axios.post('/accept-invite', data);


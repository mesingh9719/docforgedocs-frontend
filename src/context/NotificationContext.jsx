import React, { createContext, useContext, useState, useEffect } from 'react';
import { getNotifications, getUnreadCount, markNotificationRead, markAllNotificationsRead } from '../api/notifications';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await getNotifications();
            // Backend returns paginated response: { data: [...], ... }
            const notifs = response.data.data;
            setNotifications(notifs);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await getUnreadCount();
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error("Failed to fetch unread count", error);
        }
    }

    const refreshNotifications = () => {
        if (!user) return;
        fetchNotifications();
        fetchUnreadCount();
    };

    const markAsRead = async (id) => {
        try {
            await markNotificationRead(id);
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
            // Re-fetch count to be accurate or decrement
            fetchUnreadCount();
        } catch (error) {
            console.error("Failed to mark as read", error);
            refreshNotifications(); // Revert on error
        }
    };

    const markAllAsRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read", error);
            refreshNotifications();
        }
    };

    useEffect(() => {
        if (user) {
            refreshNotifications();
            const interval = setInterval(refreshNotifications, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [user]);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

import React, { useEffect } from 'react';
import { useNotifications } from '../../../context/NotificationContext';
import { format } from 'date-fns';
import { Check, Trash2, Bell, FileText } from 'lucide-react';
import axios from 'axios';

const NotificationsPage = () => {
    const { notifications, markAsRead, markAllAsRead, refreshNotifications } = useNotifications();

    useEffect(() => {
        refreshNotifications();
    }, []);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            await axios.delete(`/api/v1/notifications/${id}`);
            refreshNotifications();
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Bell className="h-6 w-6 text-indigo-600" />
                    Notifications
                </h1>
                <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    Mark all as read
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {notifications.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-50 mb-4">
                            <Bell className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No notifications</h3>
                        <p className="text-slate-500">You're all caught up! Check back later.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => markAsRead(notification.id)}
                                className={`p-5 transition-colors cursor-pointer hover:bg-slate-50 flex gap-4 ${!notification.read_at ? 'bg-indigo-50/40' : ''}`}
                            >
                                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${notification.data.type === 'document_signed' ? 'bg-green-100 text-green-600' :
                                        notification.data.type === 'document_viewed' ? 'bg-blue-100 text-blue-600' :
                                            'bg-indigo-100 text-indigo-600'
                                    }`}>
                                    {notification.data.type === 'document_signed' ? <Check className="h-5 w-5" /> :
                                        notification.data.type === 'document_viewed' ? <FileText className="h-5 w-5" /> :
                                            <Bell className="h-5 w-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className={`text-sm font-medium ${!notification.read_at ? 'text-slate-900' : 'text-slate-700'}`}>
                                            {notification.data.message}
                                        </p>
                                        <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                                            {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {notification.data.document_name && `Document: ${notification.data.document_name}`}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={(e) => handleDelete(notification.id, e)}
                                        className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;

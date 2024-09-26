import { useEffect, useRef, useState } from 'react';

import { useInviteNotifications } from '../../hooks/use-invite-notifications';
import { InviteNotification, InviteNotificationType } from '../../types';

import '@fortawesome/fontawesome-free/css/all.min.css';
import './notifications.css';

const parseNotificationMessage = (notification: InviteNotification): string => {
    const date = new Date(notification.inviteDate.toDate());
    const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    switch (notification.type) {
        case InviteNotificationType.RSVP_CHANGED:
            return `RSVP ${notification.inviteStatus.toLocaleLowerCase()} for ${notification.inviteType} on ${formattedDate}`;
        case InviteNotificationType.RESTAURANT_SUGGESTION_UPDATE:
            return `New restaurant suggestion for ${notification.inviteType} on ${formattedDate}`;
        case InviteNotificationType.SUGGESTED_RESTAURANT_ACCEPTED_BY_RECIPIENT:
        case InviteNotificationType.SUGGESTED_RESTAURANT_ACCEPTED_BY_SENDER:
            return `Restaurant suggestion accepted for ${notification.inviteType} on ${formattedDate}`;
        default:
            return '';
    }
    
};

const Notifications: React.FC = () => {
    const { loadingNotifications, notifications, markAsRead } = useInviteNotifications();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState<InviteNotification[]>([]);

    useEffect(() => {
        if (loadingNotifications) return;
        const unread = notifications.filter(notification => !notification.read);
        setUnreadNotifications(unread);
    }, [notifications, loadingNotifications]);

    // Close dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleNotificationClick = async (notification: InviteNotification) => {
        setDropdownOpen(false);
        await markAsRead([notification.id]);
        window.location.href = `/invite/${notification.inviteId}`;
    };

    const handleMarkAllAsRead = async () => {
        setDropdownOpen(false);
        await markAsRead(unreadNotifications.map(n => n.id));
    };

    return (
        <div className="notifications">
            <button 
                className={`notifications-button ${unreadNotifications.length > 0 ? 'unread' : ''}`} 
                onClick={toggleDropdown} 
                disabled={loadingNotifications || unreadNotifications.length === 0}
            >
                <i className="fas fa-bell"></i>
                <span className="notification-count">{unreadNotifications.length}</span>
            </button>
            {dropdownOpen && (
                <div className="notifications-dropdown" ref={dropdownRef}>
                    {unreadNotifications.map(notification => (
                        <div 
                            key={notification.id} 
                            className="notification-item"
                            onClick={() => handleNotificationClick(notification)}
                        >
                            {parseNotificationMessage(notification)}
                        </div>
                    ))}
                {unreadNotifications.length > 0 && (
                    <button 
                        className="mark-all-read-link" 
                        onClick={handleMarkAllAsRead}
                        disabled={loadingNotifications}
                    >
                        Mark All as Read
                    </button>
                )}
                </div>
            )}
            
        </div>
    );
};

export default Notifications;

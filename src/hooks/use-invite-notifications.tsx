import { useContext } from "react";

import { InviteNotificationsContext } from "../context/notifications";

export const useInviteNotifications = () => {
    const context = useContext(InviteNotificationsContext);
    if (!context) {
        throw new Error('useInviteNotifications must be used within a InviteNotificationsProvider');
    }
    return context;
};
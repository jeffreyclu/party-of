import React, { useEffect, useState } from 'react';
import { useInvite } from '../hooks/use-invite';
import { useUser } from '../hooks/use-user';
import Loading from '../components/loading';
import { Link } from 'react-router-dom';

import './events.css';
import { InviteStatus } from '../types';

interface EventsProps {
    host: boolean;
}

export const Events: React.FC<EventsProps> = ({ host }) => {
    const { hostInvites, recipientInvites, fetchHostInvites, fetchRecipientInvites, loadingHostInvites, loadingRecipientInvites } = useInvite();
    const { user } = useUser();

    const [hasFetchedHostInvites, setHasFetchedHostInvites] = useState(false);
    const [hasFetchedRecipientInvites, setHasFetchedRecipientInvites] = useState(false);

    useEffect(() => {
        if (!user) {
            return;
        }
        const userId = user.uid;

        const fetchInvites = async () => {
            if (host && !hasFetchedHostInvites) {
                await fetchHostInvites(userId);
                setHasFetchedHostInvites(true);
            } else if (!host && !hasFetchedRecipientInvites) {
                await fetchRecipientInvites(userId);
                setHasFetchedRecipientInvites(true);
            }
        };
        fetchInvites();
    }, [host, fetchHostInvites, fetchRecipientInvites, hasFetchedHostInvites, hasFetchedRecipientInvites, user]);

    const events = host ? hostInvites : recipientInvites;

    if (loadingHostInvites || loadingRecipientInvites) {
        return <Loading />;
    }

    const getStatusClass = (status: InviteStatus) => {
        switch (status) {
            case InviteStatus.Pending:
                return 'status-pending';
            case InviteStatus.Accepted:
                return 'status-accepted';
            case InviteStatus.Declined:
                return 'status-declined';
            default:
                return 'status-unknown';
        }
    };

    // TODO: show declined events in a different section
    // TODO: show accepted events in a different section
    // TODO: archive events that have passed

    return (
        <div className="events-container">
            <h1>Events you're {host ? "hosting" : 'attending'}</h1>
            {events.length > 0 ? (
                <div className="events-scroll-container">
                    {events.map((event) => (
                        <div key={event.id} className={`event-card ${getStatusClass(event.status)}`}>
                            <Link to={`/invite/${event.id}`}>
                                <h2>{event.eventType}</h2>
                                <p>{new Date(event.eventDate.toDate()).toLocaleDateString()}</p>
                                <p>{new Date(event.eventDate.toDate()).toLocaleTimeString()}</p>
                                <div className="status-badge">{event.status}</div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <p>No events found.</p>
                    <Link to={host ? '/invite/create' : '/invites/hosting'}>Add an event</Link>
                </>
            )}
        </div>
    );
};
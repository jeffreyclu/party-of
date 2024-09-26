import { useState } from 'react';

import { Invite, InviteStatus, ToastType } from '../../types';
import { useToast } from '../../hooks/use-toast';

import './event-details.css';

const EventDetails = ({ invite, isHost }: { invite: Invite, isHost: boolean }) => {
    const [copied, setCopied] = useState(false);
    const { showToast } = useToast();

    const eventUrl = window.location.href;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(eventUrl).then(() => {
            setCopied(true);
            showToast('Link copied to clipboard!', ToastType.Success);
            setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
        });
    };

    return (
        <div className="event-details">
            <h1>Party of 2 for {invite.eventType}</h1>
            <h2>{new Date(invite.eventDate.toDate()).toLocaleDateString()} at {new Date(invite.eventDate.toDate()).toLocaleTimeString()}</h2>
            <h3>Event status: {invite.status}</h3>
            {isHost && invite.status === InviteStatus.Pending && (
                <div className="copy-section">
                    <p>Copy the event link below and send it to your recipient:</p>
                    <div className="copy-container">
                        <input type="text" value={eventUrl} readOnly className="event-url" />
                        <button onClick={handleCopyLink} className="copy-button">
                            {copied ? 'Link Copied!' : 'Copy Event Link'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetails;
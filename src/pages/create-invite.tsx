import { useState } from 'react';
import { createInvite } from '../firebase/invite-functions';
import Loading from '../components/loading';
import { useUser } from '../hooks/use-user';
import { EventType } from '../types';

import './create-invite.css';

const CreateInvite: React.FC = () => {
    const { user } = useUser();
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const formattedTime = today.toTimeString().split(' ')[0].slice(0, 5);

    const [eventDate, setEventDate] = useState<string>(formattedDate);
    const [eventTime, setEventTime] = useState<string>(formattedTime);
    const [eventType, setEventType] = useState<EventType>(EventType.Lunch);

    if (!user) {
        return <Loading />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventDate || !eventTime || !eventType) {
            alert('Please fill in all fields');
            return;
        }
        const dateTime = new Date(`${eventDate}T${eventTime}`);
        if (dateTime < new Date()) {
            alert('Please select a future date and time');
            return;
        }
        try {
            const dateTime = new Date(`${eventDate}T${eventTime}`);
            const inviteId = await createInvite(user.uid, dateTime, eventType);
            alert('Invite created successfully');
            window.location.href = `/invite/${inviteId}`;
        } catch (error) {
            console.error('Error creating invite:', error);
            alert('Failed to create invite');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="invite-form">
            <div className="form-group">
                <h1>Party of 2</h1>
                <p>Let's make some memories! Fill out the details below to create your event.</p>
                <label htmlFor="eventDate">On:</label>
                <input
                    type="date"
                    id="eventDate"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    min={formattedDate}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="eventTime">At:</label>
                <input
                    type="time"
                    id="eventTime"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="eventType">For:</label>
                <select
                    id="eventType"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    required
                >
                    <option value="">Select an event type</option>
                    {Object.values(EventType).map((type) => (
                        <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit" className="submit-button">Create Invite</button>
        </form>
    );
};

export default CreateInvite;
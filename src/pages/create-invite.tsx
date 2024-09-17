import { useState } from 'react';

import Loading from '../components/loading';
import { useUser } from '../hooks/use-user';
import { EventType, ToastType } from '../types';
import { useToast } from '../hooks/use-toast';
import { useUserProfile } from '../hooks/use-user-profile';

import './create-invite.css';
import { useInvite } from '../hooks/use-invite';
import { Link } from 'react-router-dom';

const CreateInvite: React.FC = () => {
    const { user, loadingUser } = useUser();
    const { userProfileData, loadingUserProfileData } = useUserProfile();
    const { createInvite } = useInvite();
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const formattedTime = today.toTimeString().split(' ')[0].slice(0, 5);

    const [eventDate, setEventDate] = useState<string>(formattedDate);
    const [eventTime, setEventTime] = useState<string>(formattedTime);
    const [eventType, setEventType] = useState<EventType>(EventType.Lunch);
    const [includeDietaryRestrictions, setIncludeDietaryRestrictions] = useState(true);

    const { showToast } = useToast();

    if (!user || loadingUser || loadingUserProfileData || !userProfileData) {
        return <Loading />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventDate || !eventTime || !eventType) {
            showToast('Please fill out all fields', ToastType.Error);
            return;
        }
        const dateTime = new Date(`${eventDate}T${eventTime}`);
        if (dateTime < new Date()) {
            showToast('Please select a future date and time', ToastType.Error);
            return;
        }
        try {
            const dateTime = new Date(`${eventDate}T${eventTime}`);
            const dietaryRestrictions = includeDietaryRestrictions ? userProfileData.dietaryRestrictions : [];
            const inviteId = await createInvite(user.uid, dateTime, eventType, dietaryRestrictions);
            if (inviteId) {
                window.location.href = `/invite/${inviteId}`;
            }
        } catch (error) {
            showToast((error as Error).message, ToastType.Error);
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
            <div className="form-group">
                <label>
                    <input
                        type="checkbox"
                        checked={includeDietaryRestrictions}
                        onChange={(e) => setIncludeDietaryRestrictions(e.target.checked)}
                    />
                    Include <Link to="/profile">dietary restrictions</Link>
                </label>
            </div>
            <button type="submit" className="submit-button">Create Invite</button>
        </form>
    );
};

export default CreateInvite;
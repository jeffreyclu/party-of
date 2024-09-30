import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import Loading from '../components/loading';
import { useUser } from '../hooks/use-user';
import { EventType, Restaurant, ToastType } from '../types';
import { useToast } from '../hooks/use-toast';
import { useUserProfile } from '../hooks/use-user-profile';
import { useInvite } from '../hooks/use-invite';
import FavoritesList from '../components/favorites-list';
import FormInputDate from '../components/form/form-input-date';
import FormInputTime from '../components/form/form-input-time';
import FormInputSelect from '../components/form/form-input-select';
import FormInputCheckbox from '../components/form/form-input-checkbox';

import './create-invite.css';

const CreateInvite: React.FC = () => {
    const { user, loadingUser } = useUser();
    const { userProfileData, loadingUserProfileData } = useUserProfile();
    const { createInvite } = useInvite();
    const restaurantListRef = useRef<HTMLDivElement>(null);

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const formattedTime = today.toTimeString().split(' ')[0].slice(0, 5);

    const [eventDate, setEventDate] = useState<string>(formattedDate);
    const [eventTime, setEventTime] = useState<string>(formattedTime);
    const [eventType, setEventType] = useState<EventType>(EventType.Lunch);
    const [includeDietaryRestrictions, setIncludeDietaryRestrictions] = useState(true);
    const [attachFavoriteRestaurant, setAttachFavoriteRestaurant] = useState(false);
    const [initialSuggestion, setInitialSuggestion] = useState<Restaurant | undefined>(undefined)

    const { showToast } = useToast();

    useEffect(() => {
        if (attachFavoriteRestaurant && restaurantListRef.current) {
            restaurantListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    })

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
            const inviteId = await createInvite(user.uid, dateTime, eventType, dietaryRestrictions, initialSuggestion);
            if (inviteId) {
                window.location.href = `/invite/${inviteId}`;
            }
        } catch (error) {
            showToast((error as Error).message, ToastType.Error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="invite-form">
            <h1>Party of 2</h1>
            <div className="form-group">
                <FormInputDate
                    label="On:"
                    id="eventDate"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    min={formattedDate}
                    // inline
                    required
                />
            </div>
            <div className="form-group">
                <FormInputTime 
                    label="At:"
                    id="eventTime"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    // inline
                    required
                />
            </div>
            <div className="form-group">
                <FormInputSelect
                    label="For:"
                    id="eventType"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    // inline
                    required
                >
                    {Object.values(EventType).map((type) => (
                        <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                    ))}
                </FormInputSelect>
            </div>
            <div className="form-group">
                <FormInputCheckbox
                    checked={includeDietaryRestrictions}
                    onChange={(e) => setIncludeDietaryRestrictions(e.target.checked)}
                    label={<><span>Include </span><Link to="/profile">dietary restrictions</Link></>} 
                />
            </div>
            <div className="form-group">
                <FormInputCheckbox
                    checked={attachFavoriteRestaurant}
                    onChange={(e) => setAttachFavoriteRestaurant(e.target.checked)}
                    label="Attach a restaurant suggestion"
                />
            </div>
            {attachFavoriteRestaurant && (
                <div className="form-group" ref={restaurantListRef}>
                    <FavoritesList singleRow onClick={setInitialSuggestion}/>
                </div>
            )}
            <button type="submit" className="create-invite-button">Create Invite</button>
        </form>
    );
};

export default CreateInvite;

import RsvpButtons from './rsvp-buttons';
import { InviteStatus, UserProfile } from '../../types';

import "./rsvp-section.css";

interface RsvpSectionProps {
    invite: { status: InviteStatus };
    user: UserProfile;
    changingRsvp: boolean;
    handleRsvp: (status: InviteStatus, includeDietaryRestrictions: boolean) => Promise<void>;
    loading: boolean;
    setChangingRsvp: (changing: boolean) => void;
}

const RsvpSection: React.FC<RsvpSectionProps> = ({ invite, user, changingRsvp, handleRsvp, loading, setChangingRsvp }) => (
    <div className="rsvp-section">
        {invite.status === InviteStatus.Pending && <h2>Dear {user.displayName}, please RSVP</h2>}
        {changingRsvp || invite.status === InviteStatus.Pending ? (
            <RsvpButtons 
                handleRsvp={handleRsvp} 
                loading={loading} 
                changingRsvp={changingRsvp} 
                invite={invite} 
            />
        ) : (
            <button onClick={() => setChangingRsvp(true)}>Change RSVP</button>
        )}
    </div>
);

export default RsvpSection;
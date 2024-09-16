import { InviteStatus } from '../../types';

interface RsvpButtonsProps {
    handleRsvp: (status: InviteStatus) => void;
    loading: boolean;
    changingRsvp: boolean;
    invite: { status: InviteStatus };
}

const RsvpButtons: React.FC<RsvpButtonsProps> = ({ handleRsvp, loading, changingRsvp, invite }) => (
    <>
        <button 
            className="rsvp-button accept" 
            onClick={() => handleRsvp(InviteStatus.Accepted)} 
            disabled={loading || (changingRsvp && invite.status === InviteStatus.Accepted)}
        >  
            Accept
        </button>
        <button 
            className="rsvp-button decline" 
            onClick={() => handleRsvp(InviteStatus.Declined)} 
            disabled={loading || (changingRsvp && invite.status === InviteStatus.Declined )}
        >
            Decline
        </button>
    </>
);

export default RsvpButtons;
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { InviteStatus } from '../../types';

import './rsvp-buttons.css';

interface RsvpButtonsProps {
    handleRsvp: (status: InviteStatus, includeDietaryRestrictions: boolean) => void;
    loading: boolean;
    changingRsvp: boolean;
    invite: { status: InviteStatus };
}

const RsvpButtons: React.FC<RsvpButtonsProps> = ({ handleRsvp, loading, changingRsvp, invite }) => {
    const [includeDietaryRestrictions, setIncludeDietaryRestrictions] = useState(true);

    return (
        <>
        <div>
            <button 
                className="rsvp-button accept" 
                onClick={() => handleRsvp(InviteStatus.Accepted, includeDietaryRestrictions)} 
                disabled={loading || (changingRsvp && invite.status === InviteStatus.Accepted)}
            >  
                Accept
            </button>
            <button 
                className="rsvp-button decline" 
                onClick={() => handleRsvp(InviteStatus.Declined, includeDietaryRestrictions)} 
                disabled={loading || (changingRsvp && invite.status === InviteStatus.Declined )}
            >
                Decline
            </button> 
            </div>
            {(!changingRsvp || (changingRsvp && invite.status === InviteStatus.Declined)) && (
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={includeDietaryRestrictions}
                            onChange={(e) => setIncludeDietaryRestrictions(e.target.checked)}
                            disabled={loading}
                        />
                        Include <Link to="/profile">dietary restrictions</Link>
                    </label>
                </div>
            )}
        </>
    );
}

export default RsvpButtons;
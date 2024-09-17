import { Invite, InviteStatus } from '../../types';

const EventDetails = ({ invite }: { invite: Invite}) => (
    <div>
        <h1>Party of 2 for {invite.eventType} </h1>
        <h2>{new Date(invite.eventDate.toDate()).toLocaleDateString()} at {new Date(invite.eventDate.toDate()).toLocaleTimeString()}</h2>
        <h3>Event status: {invite.status}</h3>
        {invite.status === InviteStatus.Pending && <p>Refresh to check status.</p>}
    </div>
);

export default EventDetails;

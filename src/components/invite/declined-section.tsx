import { Link } from 'react-router-dom';

const DeclinedSection = () => (
    <div className="declined-section">
        <h2>Sorry, the RSVP was declined.</h2>
        <Link to="/event/create" className="create-event-link">Create another event?</Link>
    </div>
);

export default DeclinedSection;
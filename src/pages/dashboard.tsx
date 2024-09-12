import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const handleNavigation = (path: string) => {
        window.location.href = path;
    };

    return (
        <div>
            <ul>
                <li>
                    <button onClick={() => handleNavigation('/map')}>Add favorite restaurants</button>
                </li>
                <li>
                    <Link to="/favorites">View favorites list</Link>
                </li>
            </ul>
        </div>
    );
};

export default Dashboard;
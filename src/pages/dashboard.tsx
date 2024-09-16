import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/use-user';
import { useUserProfile } from '../hooks/use-user-profile';
import Loading from '../components/loading';
import { useFavoriteRestaurants } from '../hooks/use-favorite-restaurants';

import './dashboard.css';

const Dashboard: React.FC = () => {
    const { loadingFavoriteRestaurants } = useFavoriteRestaurants();
    const { user, loadingUser } = useUser();
    const { userProfileData, loadingUserProfileData } = useUserProfile();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loadingUser && user && !loadingUserProfileData && userProfileData && !userProfileData.completedIntro) {
            navigate('/favorites/add');
        }
    }, [loadingUser, user, loadingUserProfileData, userProfileData, navigate]);

    if (loadingUser || loadingUserProfileData || loadingFavoriteRestaurants) {
        return <Loading />;
    }

    return (
        <div className="dashboard-container">
            <h1>Welcome {userProfileData?.displayName}</h1>
            <div className="card-grid">
                <div className="card">
                    <a href="/favorites/add">Add favorite restaurants</a>
                </div>
                <div className="card">
                    <Link to="/favorites">View favorites list</Link>
                </div>
                <div className="card">
                    <Link to="/invite/create">Create an event</Link>
                </div>
                <div className="card">
                    <Link to="/invites/hosting">View your events</Link>
                </div>
                <div className="card">
                    <Link to="/invites/attending">View your RSVPs</Link>
                </div>
                <div className="card">
                    <Link to="/profile">Update your preferences</Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
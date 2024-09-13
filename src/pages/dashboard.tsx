import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavoriteRestaurants } from '../hooks/use-favorite-restaurants';
import './dashboard.css'; // Import the CSS file
import Loading from '../components/loading';

const MIN_FAVORITES = 5;

const Dashboard: React.FC = () => {
    const { favoriteRestaurants, loadingFavoriteRestaurants } = useFavoriteRestaurants();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loadingFavoriteRestaurants && favoriteRestaurants.length < MIN_FAVORITES) {
            navigate('/favorites/add');
        }
    }, [navigate, favoriteRestaurants, loadingFavoriteRestaurants]);

    if (loadingFavoriteRestaurants) {
        return <Loading />;
    }

    if (!loadingFavoriteRestaurants && favoriteRestaurants.length < MIN_FAVORITES) {
        return null; // Render nothing while redirecting
    }

    return (
        <div className="dashboard-container">
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
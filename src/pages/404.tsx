import React from 'react';
import { Link } from 'react-router-dom';
import './404.css';

const NotFound: React.FC = () => {
    return (
        <div className="not-found-container">
            <h1>404</h1>
            <p>Oh no! This page seems to have been overcooked and is no longer on the menu.</p>
            <Link to="/">Try a new dish</Link>
        </div>
    );
};

export default NotFound;
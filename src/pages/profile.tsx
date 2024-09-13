import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/use-user';
import Loading from '../components/loading';

import './profile.css';
import { dietaryOptions } from '../consts';
import { getUserProfile, updateUserProfile } from '../firebase/user-functions';

export default function Profile() {
    const { user } = useUser();
    const [displayName, setDisplayName] = useState('');
    const [originalDisplayName, setOriginalDisplayName] = useState('');
    const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
    const [originalDietaryRestrictions, setOriginalDietaryRestrictions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [editDisplayName, setEditDisplayName] = useState(false);
    const [displayNameError, setDisplayNameError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [processing, setProcessing] = useState(false);

    // fetch user profile data from db
    useEffect(() => {
        if (user) {
            const fetchUserProfile = async () => {
                const profileData = await getUserProfile(user.uid);
                if (profileData) {
                    setDisplayName(profileData.displayName || user.displayName || '');
                    setOriginalDisplayName(profileData.displayName || user.displayName || '');
                    setDietaryRestrictions(profileData.dietaryRestrictions || []);
                    setOriginalDietaryRestrictions(profileData.dietaryRestrictions || []);
                } else {
                    setDisplayName(user.displayName || '');
                    setOriginalDisplayName(user.displayName || '');
                }
                setLoading(false);
            };
            fetchUserProfile();
        }
    }, [user]);

    const handleCheckboxChange = (restriction: string) => {
        setDietaryRestrictions((prev) =>
            prev.includes(restriction)
                ? prev.filter((item) => item !== restriction)
                : [...prev, restriction]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (displayName.length < 3) {
            setDisplayNameError('Display name must be at least 3 characters long.');
            return;
        }
        try {
            setProcessing(true);
            if (user) {
                await updateUserProfile(user.uid, displayName, dietaryRestrictions);
                setSuccessMessage('Profile updated successfully!');
                setEditDisplayName(false); // Exit edit mode after successful save
                setOriginalDisplayName(displayName); // Update original display name
                setOriginalDietaryRestrictions(dietaryRestrictions); // Update original dietary restrictions
                setTimeout(() => {
                    window.location.reload();
                }, 1000); // Reload the page after 1 second
            }
        } catch (error) {
            console.error('Error responding to invite: ', error);
        } finally {
            setProcessing(false);    
        }
        
    };

    const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDisplayName(value);
        if (value.length < 3) {
            setDisplayNameError('Display name must be at least 3 characters long.');
        } else {
            setDisplayNameError('');
        }
    };

    const handleCancel = () => {
        setDisplayName(originalDisplayName);
        setDietaryRestrictions(originalDietaryRestrictions);
        setEditDisplayName(false);
        setDisplayNameError('');
    };

    const hasChanges = () => {
        return (
            displayName !== originalDisplayName ||
            JSON.stringify(dietaryRestrictions) !== JSON.stringify(originalDietaryRestrictions)
        );
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="profile-container">
            <h1>Update Preferences</h1>
            <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="displayName">Display Name</label>
                    {editDisplayName ? (
                        <div className="inline-group">
                            <input
                                type="text"
                                id="displayName"
                                value={displayName}
                                onChange={handleDisplayNameChange}
                            />
                        </div>
                    ) : (
                        <div className="inline-group">
                            <h2>{displayName}</h2>
                            <button type="button" className="edit-button" onClick={() => setEditDisplayName(true)}>Edit</button>
                        </div>
                    )}
                    {displayNameError && <p className="error">{displayNameError}</p>}
                </div>
                <div className="form-group">
                    <label>Dietary Restrictions</label>
                    {dietaryOptions.map((option) => (
                        <div key={option} className="checkbox-group">
                            <input
                                type="checkbox"
                                id={option}
                                checked={dietaryRestrictions.includes(option)}
                                onChange={() => handleCheckboxChange(option)}
                            />
                            <label htmlFor={option} className="checkbox-label">{option}</label>
                        </div>
                    ))}
                </div>
                <div className="button-group">
                    <button type="submit" className="submit-button" disabled={!hasChanges() || displayName.length < 3 || loading || processing}>Save</button>
                    <button type="button" className="cancel-button" disabled={!hasChanges() && !editDisplayName || loading || processing} onClick={handleCancel}>Cancel</button>
                </div>
                {successMessage && <p className="success">{successMessage}</p>}
            </form>
        </div>
    );
}
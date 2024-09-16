import { useState, useEffect } from 'react';

import Loading from '../components/loading';
import { useUser } from '../hooks/use-user';
import useUserProfile from '../hooks/use-user-profile';
import { DietaryOptions, ToastType } from '../types';
import { useToast } from '../hooks/use-toast';

import './profile.css';

export default function Profile() {
    const { user } = useUser();
    const { userProfileData, loadingUserProfileData, updateUserProfile } = useUserProfile(user);
    const { showToast } = useToast();
    
    const [displayName, setDisplayName] = useState('');
    const [originalDisplayName, setOriginalDisplayName] = useState('');
    const [dietaryRestrictions, setDietaryRestrictions] = useState<DietaryOptions[]>([]);
    const [originalDietaryRestrictions, setOriginalDietaryRestrictions] = useState<DietaryOptions[]>([]);
    const [editDisplayName, setEditDisplayName] = useState(false);
    const [displayNameError, setDisplayNameError] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (userProfileData) {
            setDisplayName(userProfileData.displayName);
            setOriginalDisplayName(userProfileData.displayName);
            setDietaryRestrictions(userProfileData.dietaryRestrictions);
            setOriginalDietaryRestrictions(userProfileData.dietaryRestrictions);
        }
    }, [userProfileData]);

    const handleCheckboxChange = (restriction: DietaryOptions) => {
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
            if (user && userProfileData) {
                await updateUserProfile({...userProfileData, displayName, dietaryRestrictions});
                showToast('Profile updated successfully!', ToastType.Success);
                setEditDisplayName(false); // Exit edit mode after successful save
                setOriginalDisplayName(displayName); // Update original display name
                setOriginalDietaryRestrictions(dietaryRestrictions); // Update original dietary restrictions
                setTimeout(() => {
                    window.location.reload();
                }, 1000); // Reload the page after 1 second
            }
        } catch (error) {
            showToast((error as Error).message, ToastType.Error);
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

    if (loadingUserProfileData && !processing) {
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
                    <div className="checkbox-flex">
                        {Object.values(DietaryOptions).map((option) => (
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
                </div>
                <div className="button-group">
                    <button type="submit" className="submit-button" disabled={!hasChanges() || displayName.length < 3 || loadingUserProfileData || processing}>Save</button>
                    <button type="button" className="cancel-button" disabled={!hasChanges() && !editDisplayName || loadingUserProfileData || processing} onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}
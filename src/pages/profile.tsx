import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/use-user';
import { db } from '../firebase/index'; // Adjust the import as necessary
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const dietaryOptions = [
    'Peanut Allergy',
    'Dairy Intolerance',
    'Gluten Intolerance',
    'Celiac Disease',
    'Shellfish Allergy',
    'Soy Allergy',
    'Egg Allergy',
];

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

    useEffect(() => {
        if (user) {
            const fetchUserProfile = async () => {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setDisplayName(userData.displayName || user.displayName || '');
                    setOriginalDisplayName(userData.displayName || user.displayName || '');
                    setDietaryRestrictions(userData.dietaryRestrictions || []);
                    setOriginalDietaryRestrictions(userData.dietaryRestrictions || []);
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
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                displayName,
                dietaryRestrictions,
            }, { merge: true });
            setSuccessMessage('Profile updated successfully!');
            setEditDisplayName(false); // Exit edit mode after successful save
            setOriginalDisplayName(displayName); // Update original display name
            setOriginalDietaryRestrictions(dietaryRestrictions); // Update original dietary restrictions
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

    const hasChangesOtherThanName = () => {
        return (
            JSON.stringify(dietaryRestrictions) !== JSON.stringify(originalDietaryRestrictions)
        );
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h2>Update Preferences</h2>
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
                            <p>{displayName}</p>
                            <button type="button" onClick={() => setEditDisplayName(true)}>Edit</button>
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
                    <button type="submit" className="submit-button" disabled={!hasChanges() || displayName.length < 3}>Save</button>
                    <button type="button" className="cancel-button" disabled={!hasChanges() && !editDisplayName} onClick={handleCancel}>Cancel</button>
                </div>
                {successMessage && <p className="success">{successMessage}</p>}
            </form>
        </div>
    );
}
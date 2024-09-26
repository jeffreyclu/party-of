import { useState } from "react";
import { DietaryOptions } from "../../types";

import "./dietary-restrictions.css";

interface DietaryRestrictionsSectionProps {
    senderDietaryRestrictions: DietaryOptions[];
    recipientDietaryRestrictions: DietaryOptions[];
    isHost: boolean;
}

const DietaryRestrictionsSection: React.FC<DietaryRestrictionsSectionProps> = ({ isHost, senderDietaryRestrictions, recipientDietaryRestrictions }) => {
    const [showDietaryRestrictions, setShowDietaryRestrictions] = useState(false);
    
    const formatDietaryRestrictions = (restrictions: DietaryOptions[]) => {
        return restrictions.join(', ');
    };

    // TODO: dietary restrictions on the invite should update when the user updates their dietary restrictions
    
    return (
        <div className="dietary-restrictions-section">
            {showDietaryRestrictions && (
                <div className="dietary-restrictions-container">
                    {senderDietaryRestrictions.length > 0 && (
                        <div>
                            <span style={{ fontWeight: "bold"}}>{isHost ? "My" : "Their"} Dietary Restrictions: </span>
                            <span>{formatDietaryRestrictions(senderDietaryRestrictions)}</span>
                        </div>
                    )}
                    {recipientDietaryRestrictions.length > 0 && (
                        <div>
                            <span style={{ fontWeight: "bold"}}>{isHost ? "Their" : "My"} Dietary Restrictions: </span>
                            <span>{formatDietaryRestrictions(recipientDietaryRestrictions)}</span>
                        </div>
                    )}
                </div>
            )}
            <span className="show-dietary-restrictions" onClick={() => setShowDietaryRestrictions(!showDietaryRestrictions)}>
                {showDietaryRestrictions ? 'Hide Dietary Restrictions' : 'Show Dietary Restrictions'}
            </span>
        </div>
    );
};

export default DietaryRestrictionsSection;
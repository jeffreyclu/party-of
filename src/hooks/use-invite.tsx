import { useContext } from "react";
import { InviteContext } from "../context/invite";

export const useInvite = () => {
    const context = useContext(InviteContext);
    if (context === undefined) {
        throw new Error('useInvite must be used within an InviteProvider');
    }
    return context;
};
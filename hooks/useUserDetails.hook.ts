import { useUserDetailsQuery } from "api/user.api";
import { User } from "types";

interface ReturnProps {
    userDetails?: User;
    fullName?: string;
}

export const useUserDetails = (): ReturnProps => {

    const { data: userDetails } = useUserDetailsQuery();

    const fullName = `${userDetails?.firstName} ${userDetails?.lastName}`;

    return {
        userDetails,
        fullName
    }
};
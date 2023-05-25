import { useUserDetailsQuery } from "api/user.api";

interface ReturnProps {
    initials: string;
}

interface Props {
    name?: string;
}

export const useInitials: (args?: Props) => ReturnProps = (props) => {
    /**
     * This hook is used to get the initials of the user
     * or the initials of the name passed in the props
     */
    const { data: userDetails } = useUserDetailsQuery(undefined)

    if (props?.name) {
        const name = props.name;
        const initials = name.split(" ").map(word => word.charAt(0)).join("");
        return {
            initials
        }
    }

    if (!userDetails) {
        return {
            initials: ""
        }
    }

    const initials = userDetails?.firstName[0] + userDetails?.lastName[0]

    return {
        initials
    }
}


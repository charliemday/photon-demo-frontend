import { useSelector } from "react-redux";
import { RootState } from "store";

interface ReturnProps {
    authToken: string
}

export const useAuth = (): ReturnProps => {
    const authToken = useSelector((state: RootState) => state.auth.token);
    return {
        authToken
    }
}
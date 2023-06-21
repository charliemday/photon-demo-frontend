import { baseApi } from "api";
import { useDispatch } from "react-redux";

interface ReturnProps {
    resetState: () => void;
}

export const useResetState = (): ReturnProps => {
    const dispatch = useDispatch();

    const resetState = () => {
        dispatch({ type: "LOGOUT" });
        dispatch(baseApi.util.resetApiState());
    }

    return {
        resetState
    }
}
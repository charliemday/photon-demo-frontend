import { baseApi } from "api";
import { ROUTES } from "config";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

interface ReturnProps {
  logout: () => void;
}

export const LOGOUT_ACTION = "LOGOUT";

export const useLogout = (): ReturnProps => {
  const dispatch = useDispatch();
  const router = useRouter();

  const logout = () => {
    dispatch({ type: LOGOUT_ACTION });
    dispatch(baseApi.util.resetApiState());
    router.push(ROUTES.BASE);
  };

  return {
    logout,
  };
};

import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { useUserDetailsQuery } from "api/user.api";
import { ROUTES } from "config";
import { RootState } from "store";
import { AuthState } from "store/slices";

interface Props {
  children: React.ReactNode;
}

export const AdminWrapper: React.FC<Props> = ({ children }) => {
  const authState: AuthState = useSelector((state: RootState) => state.auth);
  const authToken = authState?.token;

  const router = useRouter();

  const { data: userDetails } = useUserDetailsQuery(undefined, {
    skip: !authToken,
  });

  useEffect(() => {
    /**
     * On load check if the user is an admin
     */
    if (router.isReady) {
      if (!userDetails?.isStaff) {
        router.push(ROUTES.BASE);
      }
    }
  }, [router, userDetails]);

  return <div>{children}</div>;
};

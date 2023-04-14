import { Flex } from "@chakra-ui/react";
import { useUserDetailsQuery } from "api/user.api";
import { SidebarLayout } from "components/layouts";
import { ROUTES } from "config";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { MoonLoader } from "react-spinners";

interface Props {}

export const BackgroundView: React.FC<Props> = () => {
  const {
    data: userDetails,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useUserDetailsQuery(undefined);

  const router = useRouter();

  useEffect(() => {
    if (isSuccess && !isLoading) {
      if (userDetails?.isStaff) {
        router.push(ROUTES.AUTOMATION);
      } else {
        router.push(ROUTES.DASHBOARD);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isLoading, isError, error, userDetails]);

  return (
    <>
      <SidebarLayout />
      <Flex
        alignItems="center"
        justifyContent="center"
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgColor="rgba(255, 255, 255, 0.75)"
      >
        <MoonLoader size={40} />
      </Flex>
    </>
  );
};

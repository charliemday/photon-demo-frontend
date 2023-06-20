import { Flex, Text } from "@chakra-ui/react";
import { useListTeamsQuery } from "api/team.api";
import { useUserDetailsQuery, useUserTiersQuery } from "api/user.api";
import { ROUTES } from "config";
import { useFeatureFlag } from "hooks";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { MoonLoader } from "react-spinners";
import { setActiveTeam } from "store/slices";

interface Props {}

export const BackgroundView: React.FC<Props> = () => {
  const {
    data: userDetails,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useUserDetailsQuery(undefined);
  const { isLoading: isLoadingUserTiers, isSuccess: hasLoadedUserTiers } = useUserTiersQuery();
  const { data: teams } = useListTeamsQuery({});

  const [pageErrored, setPageErrored] = useState(false);

  const dispatch = useDispatch();
  const { hasAccess } = useFeatureFlag();
  const router = useRouter();

  useEffect(() => {
    /**
     * If the page consistently hangs for more than n seconds
     * show the error page
     */
    const n = 20;

    const timeout = setTimeout(() => {
      setPageErrored(true);
    }, n * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (isSuccess && !isLoading && !isLoadingUserTiers && hasLoadedUserTiers) {
      // Initialize the active team if the user has one
      dispatch(setActiveTeam(teams?.[0]));
      if (userDetails?.isStaff) {
        router.push(ROUTES.AUTOMATION);
      } else {
        router.push(ROUTES.WORD_SEEK);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isLoading, isError, error, userDetails, isLoadingUserTiers, hasLoadedUserTiers]);

  if (pageErrored) {
    return (
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
        <Text fontSize="xl" fontWeight="semibold">
          ⚠️ Something went wrong. Please refresh the page.
        </Text>
      </Flex>
    );
  }

  return (
    <>
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

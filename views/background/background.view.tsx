import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { useListTeamsQuery } from "api/team.api";
import { useUserDetailsQuery, useUserTiersQuery } from "api/user.api";
import { BRAND_COLOR, ROUTES } from "config";
import { useFeatureFlag } from "hooks";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiRefresh } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { PropagateLoader } from "react-spinners";
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
      const { email } = userDetails;

      if (userDetails?.isStaff) {
        router.push(ROUTES.AUTOMATION);
      } else {
        if (email && email.includes("+demopaa")) {
          router.push(ROUTES.DEMO_QUESTIONS_ASKED);
          return;
        }

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
        <Stack alignItems="center">
          <Text fontSize="xl" fontWeight="semibold" color="red.400">
            ⚠️ Something went wrong. Please refresh the page.
          </Text>
          <Box
            color="#E4706C"
            fontSize={32}
            cursor="pointer"
            onClick={() => {
              window.location.reload();
            }}
          >
            <BiRefresh />
          </Box>
        </Stack>
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
        <PropagateLoader color={BRAND_COLOR} />
      </Flex>
    </>
  );
};

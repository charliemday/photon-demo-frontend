import React, { useEffect } from "react";
import { ModalStepWrapper } from "./modal-step-wrapper";
import {
  Box,
  Heading,
  HStack,
  Stack,
  Text,
  Grid,
  GridItem,
  useToast,
} from "@chakra-ui/react";
import { BsFillPersonFill } from "react-icons/bs";
import Image from "next/image";

import { Button } from "components/button";
import { useListTeamsQuery } from "api/team.api";
import { usePopulateSearchConsoleReportsMutation } from "api/vendor.api";
import { typeCheckError } from "utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PopulateSCReports: React.FC<Props> = (props) => {
  const { data: teams } = useListTeamsQuery(undefined);
  const [populateReports, { isLoading, isSuccess, isError, error }] =
    usePopulateSearchConsoleReportsMutation();

  const toast = useToast();

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast({
        title: "Success",
        description: "All Teams have had their SC reports updated.",
        status: "success",
        isClosable: true,
      });
    }

    if (!isLoading && isError && error) {
      toast({
        title: "Error",
        description: typeCheckError(error) || "Something went wrong.",
        status: "error",
        isClosable: true,
      });
    }
  }, [isLoading, isSuccess, toast, error, isError]);

  const renderTeam = (logo: string | null, name: string) => (
    <Stack alignItems="center">
      <Box
        position="relative"
        minH={25}
        w={25}
        boxShadow="md"
        borderRadius="md"
      >
        {logo ? (
          <Image src={logo} layout="fill" alt={name} unoptimized />
        ) : (
          <BsFillPersonFill fontSize={28} />
        )}
      </Box>
      <Text fontSize="sm" fontWeight="semibold" noOfLines={1}>
        {name}
      </Text>
    </Stack>
  );

  return (
    <ModalStepWrapper {...props}>
      <Stack>
        <Heading fontSize="lg">Populate Search Console Reports</Heading>
        <Text fontSize="sm">
          This step will populate the Search Console reports for all the teams.
          <Grid templateColumns="repeat(6, 1fr)" gap={4} py={12}>
            {teams?.slice(0, 18)?.map((team) => (
              <GridItem key={team.id}>
                {renderTeam(team.logo, team.name)}
              </GridItem>
            ))}
          </Grid>
        </Text>
        <HStack justifyContent="flex-end" pt={6}>
          <Button
            size="sm"
            isLoading={isLoading}
            onClick={() => populateReports(null)}
          >
            Populate
          </Button>
          <Button size="sm" onClick={props.onClose}>
            Cancel
          </Button>
        </HStack>
      </Stack>
    </ModalStepWrapper>
  );
};

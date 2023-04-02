import { Box, Flex, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import React from "react";

interface Props {
  onClick?: () => void;
  title: string;
  description: string;
  buttonLabel?: string;
  emoji?: string;
  isLoading?: boolean;
}

const DashboardCard: React.FC<Props> = ({
  onClick,
  title,
  description,
  emoji,
  buttonLabel = "Get Started",
  isLoading = false,
}) => {
  return (
    <Box w={350} h="auto" p={8} border="solid 2px black" borderRadius="xl">
      <Flex flexDir="column" justifyContent="space-between" h="full">
        <Flex
          w={41}
          height={41}
          bgColor="purple.300"
          justifyContent="center"
          alignItems="center"
          borderRadius="md"
          border="solid 2px black"
          mb={3}
        >
          <Text fontSize="xl">{emoji}</Text>
        </Flex>
        <Box>
          <Box>
            <Text fontWeight="semibold">{title}</Text>
          </Box>
          <Box my={4}>
            <Text fontSize="sm" letterSpacing={0.25}>
              {description}
            </Text>
          </Box>
        </Box>
        <Box>
          {buttonLabel && onClick && (
            <Button w="full" onClick={onClick} isLoading={isLoading}>
              {buttonLabel}
            </Button>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default DashboardCard;

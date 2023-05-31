import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import { Heading, Label } from "components/text";
import { FC } from "react";

interface Props {
  onClick?: () => void;
  title: string;
  description: string;
  buttonLabel?: string;
  emoji?: string;
  isLoading?: boolean;
}

export const ProductCard: FC<Props> = ({
  onClick,
  title,
  description,
  emoji,
  buttonLabel = "Get Started",
  isLoading = false,
}) => (
  <Box
    w={350}
    h="auto"
    p={8}
    borderColor="#ECECEC"
    borderWidth="1px"
    borderRadius="xl"
    boxShadow="md"
  >
    <Flex direction="column" justifyContent="space-between" gap="4" h="full">
      <Flex direction="column" gap="4">
        <Flex
          w={41}
          height={41}
          bgColor="purple.300"
          justifyContent="center"
          alignItems="center"
          borderRadius="md"
          border="solid 2px black"
        >
          <Text fontSize="xl">{emoji}</Text>
        </Flex>

        <Flex direction="column" gap="3">
          <Heading level="h3" fontSize="lg">
            {title}
          </Heading>

          <Label>{description}</Label>
        </Flex>
      </Flex>

      {buttonLabel && onClick && (
        <Button w="full" onClick={onClick} isLoading={isLoading} border="solid 2px black">
          {buttonLabel}
        </Button>
      )}
    </Flex>
  </Box>
);

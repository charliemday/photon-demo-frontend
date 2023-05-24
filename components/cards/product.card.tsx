import { Box, Flex, Text } from "@chakra-ui/react";
import { Button } from "components/button";
import { Label } from "components/text";
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
          <Label letterSpacing={0.25}>{description}</Label>
        </Box>
      </Box>
      <Box>
        {buttonLabel && onClick && (
          <Button w="full" onClick={onClick} isLoading={isLoading} border="solid 2px black">
            {buttonLabel}
          </Button>
        )}
      </Box>
    </Flex>
  </Box>
);

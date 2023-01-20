import { Stack, Text, Box, Flex } from "@chakra-ui/react";
import { BRAND_COLOR } from "config";
import Image from "next/image";
import React from "react";
import { BsCheckCircle } from "react-icons/bs";

interface Props {
  title: string;
  description: string;
  onClick: () => void;
  comingSoon?: boolean;
  image?: string;
  isDisabled?: boolean;
}

export const AutomationCard: React.FC<Props> = ({
  title,
  description,
  onClick,
  comingSoon,
  image,
  isDisabled,
}) => {
  const renderComingSoon = () => (
    <Flex
      position="absolute"
      h="full"
      w="full"
      bgColor="rgba(255,255,255,0.75)"
      pointerEvents="none"
      zIndex={100}
      justifyContent="center"
      alignItems="center"
    >
      <Text fontWeight="semibold">Coming Soon</Text>
    </Flex>
  );

  const renderDisabled = () => (
    <Flex
      position="absolute"
      h="full"
      w="full"
      bgColor="rgba(255,255,255,0.75)"
      pointerEvents="none"
      zIndex={100}
      justifyContent="center"
      alignItems="center"
    >
      <Text fontWeight="semibold">Disabled</Text>
    </Flex>
  );

  return (
    <Box position="relative">
      {comingSoon && !isDisabled && renderComingSoon()}
      {isDisabled && renderDisabled()}
      <Stack
        p={6}
        borderRadius="md"
        boxShadow="lg"
        _hover={
          !comingSoon && !isDisabled
            ? {
                boxShadow: "xl",
                bgColor: BRAND_COLOR,
                color: "white",
              }
            : {}
        }
        cursor={comingSoon || isDisabled ? "not-allowed" : "pointer"}
        onClick={() => {
          if (!comingSoon && !isDisabled) {
            onClick();
          }
        }}
        h={200}
        overflow="hidden"
        border="solid 1px lightgray"
        position="relative"
      >
        <Text fontWeight="semibold" noOfLines={1}>
          {title}
        </Text>
        <Text fontSize="sm" noOfLines={3} opacity={0.75}>
          {description}
        </Text>
        {image && (
          <Box
            borderRadius="sm"
            overflow="hidden"
            position="absolute"
            height={25}
            width={25}
            bottom={5}
            right={5}
          >
            <Image src={image} alt="Step Image" layout="fill" />
          </Box>
        )}
      </Stack>
    </Box>
  );
};

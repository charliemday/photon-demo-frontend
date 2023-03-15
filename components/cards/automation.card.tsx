import { Badge, Box, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { BRAND_COLOR } from "config";
import Image from "next/image";
import React from "react";

interface Props {
  title: string;
  description: string;
  onClick: () => void;
  comingSoon?: boolean;
  image?: string | string[];
  isDisabled?: boolean;
  badgeLabel?: string;
  badgeColor?: string;
}

export const AutomationCard: React.FC<Props> = ({
  title,
  description,
  onClick,
  comingSoon,
  image,
  isDisabled,
  badgeLabel,
  badgeColor,
}) => {
  const renderComingSoon = () => (
    <Flex
      position="absolute"
      h="full"
      w="full"
      bgColor="rgba(225,225,225,0.75)"
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
      bgColor="rgba(225,225,225,0.75)"
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
        {badgeLabel && (
          <Box position="absolute" right={4} top={3}>
            <Badge colorScheme={badgeColor}>{badgeLabel}</Badge>
          </Box>
        )}
        <Text fontWeight="semibold" noOfLines={1}>
          {title}
        </Text>
        <Text fontSize="sm" noOfLines={3} opacity={0.75}>
          {description}
        </Text>
        {image ? (
          Array.isArray(image) ? (
            <HStack position="absolute" bottom={5} right={5}>
              {image.map((img, key) => (
                <Box
                  key={key}
                  borderRadius="sm"
                  height={22}
                  width={22}
                  position="relative"
                  overflow="hidden"
                >
                  <Image src={img} alt="Step Image" layout="fill" />
                </Box>
              ))}
            </HStack>
          ) : (
            <Box
              borderRadius="sm"
              overflow="hidden"
              position="absolute"
              height={22}
              width={22}
              bottom={5}
              right={5}
            >
              <Image src={image} alt="Step Image" layout="fill" />
            </Box>
          )
        ) : null}
      </Stack>
    </Box>
  );
};

import React from "react";
import { HStack, Stack, Text } from "@chakra-ui/react";
import { GrMoney } from "react-icons/gr";
import { GoLaw } from "react-icons/go";
import { FaUnlockAlt } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";

interface Props {}

const ICON_SIZE = 18;

export const WelcomeStep: React.FC<Props> = () => (
  <div>
    <Stack alignItems="center">
      <Text fontSize="sm">
        {`We're excited to have you on board! Let's get your account step up - this'll only take 2 minutes`}
      </Text>
      <Text fontSize="sm">
        With Baser we want to help you get control of your tools through cost,
        compliance, access management, discovery, and so much more!
      </Text>
      <HStack pt={6} spacing={6}>
        <GrMoney fontSize={ICON_SIZE} />
        <GoLaw fontSize={ICON_SIZE} />
        <FaUnlockAlt fontSize={ICON_SIZE} />
        <AiOutlineSearch fontSize={ICON_SIZE} />
      </HStack>
    </Stack>
  </div>
);

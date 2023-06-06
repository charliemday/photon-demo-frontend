import { Box, Divider, HStack, ModalHeader, Stack, Text } from "@chakra-ui/react";
import { useUserTiersQuery } from "api/user.api";
import { useGetAppSumoDetailsQuery } from "api/vendor.api";
import { Button } from "components/button";
import { AppSumoLogo } from "components/logos";
import { BRAND_COLOR } from "config";
import { APPSUMO_PLAN_IDS, APPSUMO_TIERS } from "config/app-sumo";
import { FC, useEffect } from "react";
import { BsCheck2, BsCheckCircleFill } from "react-icons/bs";
import { Modal } from "./modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface TierBlock {
  name: string;
  features: string[];
  planId: APPSUMO_PLAN_IDS;
}

export const AppSumoSubscriptionModal: FC<Props> = ({ isOpen, onClose }) => {
  const { data, refetch } = useGetAppSumoDetailsQuery();
  const { refetch: refetchUserTiers } = useUserTiersQuery();

  useEffect(() => {
    refetch();
    refetchUserTiers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const navigateToAppSumoPortal = () => {
    if (data) {
      const { invoiceItemUuid } = data;
      const portal = `https://appsumo.com/account/redemption/${invoiceItemUuid}#change-plan`;
      window.open(portal, "_blank");
    }
  };

  const renderTierBlock = (tier: TierBlock) => {
    const isActivePlan = data?.planId === tier.planId;
    return (
      <Stack
        border={isActivePlan ? `2px solid ${BRAND_COLOR}` : "2px solid #E2E8F0"}
        p={3}
        borderRadius="xl"
        boxShadow="md"
        position="relative"
      >
        <Text fontSize="lg" fontWeight="bold">
          {tier.name}
        </Text>
        <Divider />
        <Stack pt={2}>
          {tier.features.map((feature, key) => (
            <HStack key={key} spacing={2}>
              <Box>
                <BsCheck2 color="green" fontSize={12} />
              </Box>
              <Text fontSize="sm" fontWeight={key === 0 ? "bold" : "normal"}>
                {feature}
              </Text>
            </HStack>
          ))}
        </Stack>
        {isActivePlan && (
          <HStack py={6} justifyContent="center" w="full" alignItems="center">
            <BsCheckCircleFill color="green" fontSize={12} />
            <Text fontSize="sm" fontWeight="bold">
              Active Plan
            </Text>
          </HStack>
        )}
      </Stack>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <Stack>
        <ModalHeader>Your App Sumo Subscription</ModalHeader>
        <Divider />

        <HStack p={12} alignItems="flex-start" justifyContent="center" spacing={8}>
          {APPSUMO_TIERS.map((tier) => renderTierBlock(tier))}
        </HStack>
        <HStack justifyContent="space-between" px={12} pb={6}>
          <AppSumoLogo size="sm" />
          <Button onClick={navigateToAppSumoPortal}>Manage Subscription</Button>
        </HStack>
      </Stack>
    </Modal>
  );
};

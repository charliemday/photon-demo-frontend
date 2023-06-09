import { Box, HStack, ModalBody, ModalHeader, Text } from "@chakra-ui/react";
import { useUserDetailsQuery } from "api/user.api";
import { Image } from "components/image";
import { Modal } from "components/modals";
import { PRICING_TABLE_ID, STRIPE_PUBLISHABLE_KEY } from "config";
import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export const PricingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { data: user } = useUserDetailsQuery(undefined);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalHeader>
        <HStack>
          <Box
            w={8}
            h={8}
            borderRadius="md"
            overflow="hidden"
            position="relative"
          >
            <Image
              src="/logos/stripe.png"
              layout="fill"
              objectFit="contain"
              alt="Stripe logo"
            />
          </Box>
          <Text>Pricing</Text>
        </HStack>
      </ModalHeader>
      <ModalBody>
        <stripe-pricing-table
          pricing-table-id={PRICING_TABLE_ID}
          publishable-key={STRIPE_PUBLISHABLE_KEY}
          customer-email={user?.email}
        />
      </ModalBody>
    </Modal>
  );
};

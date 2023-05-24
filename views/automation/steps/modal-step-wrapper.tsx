import {
  Box,
  Divider,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useActiveContentStrategy, useActiveTeam } from "hooks";
import Image from "next/image";
import { FC, ReactNode, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: string;
  contentProps?: {
    [key: string]: any;
  };
  showContentStrategy?: boolean;
}

export const ModalStepWrapper: FC<Props> = ({
  isOpen,
  onClose,
  children,
  size = "2xl",
  contentProps,
  showContentStrategy = true,
}) => {
  const activeTeam = useActiveTeam();
  const activeContentStrategy = useActiveContentStrategy();

  const [imageError, setImageError] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay />
      <ModalContent p={12} {...contentProps}>
        <ModalCloseButton />
        <Box h={10} w={10} position="absolute" top={5} left={8} borderRadius={4} overflow="hidden">
          {imageError ? null : (
            <Image
              src={activeTeam?.logo || ""}
              alt={activeTeam?.name || ""}
              layout="fill"
              onError={() => setImageError(true)}
            />
          )}
        </Box>

        <Box position="absolute" left={20} top={7}>
          <Text fontSize="lg" fontWeight="bold">
            {activeTeam?.name}
          </Text>
        </Box>
        {showContentStrategy && (
          <Box position="absolute" right={20} top={7} overflow="hidden" maxW={400}>
            <Text fontSize="lg" fontWeight="bold" isTruncated title="Name of Content Strategy">
              {activeContentStrategy
                ? `📝 ${activeContentStrategy?.name}`
                : "⚠️ No Content Strategy Selected"}
            </Text>
          </Box>
        )}

        <Divider my={6} />
        {children}
      </ModalContent>
    </Modal>
  );
};

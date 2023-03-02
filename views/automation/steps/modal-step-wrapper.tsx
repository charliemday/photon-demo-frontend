import {
  Box,
  Divider,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { Team } from "types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: string;
}

export const ModalStepWrapper: React.FC<Props> = ({
  isOpen,
  onClose,
  children,
  size = "2xl",
}) => {
  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay />
      <ModalContent p={12}>
        <ModalCloseButton />
        <Box
          h={10}
          w={10}
          position="absolute"
          top={5}
          left={8}
          borderRadius={4}
          overflow="hidden"
        >
          <Image
            src={activeTeam?.logo || ""}
            alt={activeTeam?.name || ""}
            layout="fill"
          />
        </Box>
        <Divider my={6} />
        {children}
      </ModalContent>
    </Modal>
  );
};

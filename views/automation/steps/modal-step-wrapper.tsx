import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Box,
  Divider,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { Team } from "types";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalStepWrapper: React.FC<Props> = ({
  isOpen,
  onClose,
  children,
}) => {
  const activeTeam: Team = useSelector(
    (state: RootState) => state.team.activeTeam
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
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

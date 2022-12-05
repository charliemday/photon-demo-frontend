import {
  Box,
  HStack,
  useDisclosure,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Heading,
  Flex,
  Stack,
} from "@chakra-ui/react";
import { Button } from "components/button";
import {
  AddToolModal,
  ConnectAccountModal,
  ConnectingBankModal,
} from "components/modals";
import { Table } from "components/table";
import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoSync } from "react-icons/io5";
import Fuse from "fuse.js";
import { BiSearch } from "react-icons/bi";

import { useListUserToolsQuery, UserToolList } from "api/tool.api";
import { useUserDetailsQuery } from "api/user.api";
import { BRAND_NAME, ONBOARDING_STEPS } from "config";
import { AiOutlineDesktop } from "react-icons/ai";
import { OnboardingModal } from "components/onboarding-flow";

interface Props {}

const options = {
  keys: ["tool.name"],
};

enum ModalType {
  NEW_TOOL = "newTool",
  CONNECT_ACCOUNT = "connectAccount",
  OAUTH_CONNECTING = "oauthConnecting",
  OAUTH_SUCCESS = "oauthSuccess",
  ONBOARDING = "onboarding",
  CONNECTING_BANK = "connectingBank",
}

// The minimum onboarding step to show the onboarding modal
const MINIMUM_ONBOARDING = ONBOARDING_STEPS.completeOnboardingStep;

export const OverviewView: React.FC<Props> = () => {
  const { data, isLoading } = useListUserToolsQuery(undefined);
  const { data: userDetails, isSuccess } = useUserDetailsQuery(undefined);
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [tableData, setTableData] = useState<UserToolList[]>(data || []);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const [vendorApp, setVendorApp] = useState<string | null>(null);

  useEffect(() => {
    if (userDetails && isSuccess) {
      if ((userDetails.onboardingStep || 0) <= MINIMUM_ONBOARDING) {
        setModalType(ModalType.ONBOARDING);
        onOpen();
      }
    }
  }, [userDetails, isSuccess, onOpen]);

  useEffect(() => {
    setTableData(data || []);
  }, [data]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    if (data) {
      const fuse = new Fuse(data, options);
      const result = fuse.search(searchTerm);

      if (searchTerm === "") {
        setTableData(data);
      } else {
        setTableData(result.map((item: any) => item.item));
      }
    }
  };

  const renderButtons = () => (
    <HStack>
      <Box position="relative">
        <Button
          onClick={() => {
            setModalType(ModalType.CONNECTING_BANK);
            onOpen();
          }}
          size="sm"
        >
          <HStack>
            <IoSync />
            <Text>Sync Accounts</Text>
          </HStack>
        </Button>
        <Text opacity={0.5} fontSize={10} position="absolute" left={2}>
          Automate adding your tools
        </Text>
      </Box>
      <Button
        onClick={() => {
          setModalType(ModalType.NEW_TOOL);
          onOpen();
        }}
        size="sm"
      >
        <HStack>
          <IoMdAdd />
          <Text>Add a Tool</Text>
        </HStack>
      </Button>
    </HStack>
  );

  // If the user is using mobile then force them to use desktop

  const screenWidth = window.innerWidth;
  const minMobileWidth = 768;

  if (screenWidth <= minMobileWidth) {
    return (
      <Flex
        h="full"
        w="full"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        pt={40}
      >
        <Stack alignItems="center">
          <AiOutlineDesktop fontSize={32} />
          <Text fontSize="sm">
            {BRAND_NAME} is not optimised for mobile yet. Please use a
            desktop/laptop screen.
          </Text>
        </Stack>
      </Flex>
    );
  }

  return (
    <>
      <Box pt={20}>
        <Heading size="lg">👋 Welcome {userDetails?.firstName}</Heading>
        <HStack my={12} justifyContent="space-between">
          <Box w="full">
            <InputGroup>
              <InputLeftElement>
                <BiSearch />
              </InputLeftElement>
              <Input
                placeholder="Search Tools"
                onChange={handleSearch}
                bgColor="#E2E8F0"
                w="50%"
                variant="filled"
              />
            </InputGroup>
          </Box>
          {renderButtons()}
        </HStack>
        {data && (
          <Table
            tableData={tableData}
            isLoading={isLoading}
            isSearching={!!(searchTerm && searchTerm.length)}
            isHidden={userDetails?.hideTools}
          />
        )}
      </Box>
      <AddToolModal
        isOpen={isOpen && modalType === ModalType.NEW_TOOL}
        onClose={onClose}
      />
      <ConnectAccountModal
        isOpen={isOpen && modalType === ModalType.CONNECT_ACCOUNT}
        onClose={onClose}
      />
      <ConnectingBankModal
        isOpen={isOpen && modalType === ModalType.CONNECTING_BANK}
        onClose={onClose}
      />
      <OnboardingModal
        isOpen={isOpen && modalType === ModalType.ONBOARDING}
        onClose={onClose}
      />
    </>
  );
};

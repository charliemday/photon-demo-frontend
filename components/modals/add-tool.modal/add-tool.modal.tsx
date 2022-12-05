import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Button as ChakraButton,
  FormLabel,
  Flex,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Checkbox,
  InputGroup,
  InputLeftAddon,
  HStack,
  Divider,
} from "@chakra-ui/react";
import {
  useListToolsQuery,
  useCreateUserToolMutation,
  useListUserToolsQuery,
  ToolList,
  CreateUserToolBody,
  RenewalCycleEnum,
} from "api/tool.api";
import { FiChevronDown } from "react-icons/fi";
import { capitalizeFirstLetter } from "utils";
import { Button } from "components/button";
import { Select } from "components/select";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export interface FormValeus {
  name: string;
  description: string;
}

export enum PlanEnum {
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

const ICON_SIZE = 15;

export const AddToolModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const toast = useToast();

  const { data } = useListToolsQuery(undefined);
  const { data: userTools, refetch } = useListUserToolsQuery(undefined);

  const [isFreeTool, setIsFreeTool] = useState(false);
  const [renewalCycle, setRenewalCycle] = useState<RenewalCycleEnum>(
    RenewalCycleEnum.monthly
  );
  const [renewalAmount, setRenewalAmount] = useState<number | undefined>(
    undefined
  );
  const [renewalDate, setRenewalDate] = useState<string>();

  const [createUserTool, { isLoading: isCreating }] =
    useCreateUserToolMutation();
  const [selectedOption, setSelectedOption] =
    useState<Partial<ToolList> | null>(null);

  useEffect(() => {
    setSelectedOption(null);
  }, [isOpen]);

  const handleClick = async () => {
    if (selectedOption) {
      const option = data?.find((d) => d.name === selectedOption.name);
      if (option?.id) {
        let body: CreateUserToolBody = {
          tool: option.id,
        };

        if (!isFreeTool) {
          body = {
            ...body,
            renewalCycle,
            renewalAmount,
            renewalDate,
          };
        }

        const response = await createUserTool(body);

        if ("error" in response) {
          toast({
            title: "Error",
            description: "Unable to add tool. Please try again later.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          refetch();
          toast({
            title: "Tool Added",
            description: `${option.name} has been added to your account`,
            status: "success",
            isClosable: true,
            duration: 5000,
          });
        }

        onClose();
      }
    }
  };

  const renderRenewalCost = () => (
    <Stack
      opacity={isFreeTool ? 0.5 : 1}
      pointerEvents={isFreeTool ? "none" : "auto"}
    >
      <FormLabel fontSize="sm">Renewal Cost</FormLabel>
      <InputGroup size="sm">
        <InputLeftAddon>£</InputLeftAddon>
        <Input
          size="sm"
          placeholder="9.99"
          type="number"
          onChange={(e) => setRenewalAmount(Number(e.target.value))}
        />
      </InputGroup>
    </Stack>
  );

  const renderRenewalDate = () => (
    <Stack
      opacity={isFreeTool ? 0.5 : 1}
      pointerEvents={isFreeTool ? "none" : "auto"}
    >
      <FormLabel fontSize="sm">Renewal Date</FormLabel>
      <Input
        size="sm"
        placeholder="Select Date and Time"
        fontSize="sm"
        type="date"
        cursor="pointer"
        value={renewalDate}
        onChange={(e) => setRenewalDate(e.target.value)}
      />
    </Stack>
  );

  const renderRenewalCycle = () => (
    <Stack
      opacity={isFreeTool ? 0.5 : 1}
      pointerEvents={isFreeTool ? "none" : "auto"}
    >
      <FormLabel fontSize="sm">Renewal Cycle</FormLabel>
      <Menu>
        <MenuButton
          size="sm"
          as={ChakraButton}
          rightIcon={<FiChevronDown />}
          w="full"
        >
          <Flex justifyContent="flex-start">
            {capitalizeFirstLetter(renewalCycle)}
          </Flex>
        </MenuButton>
        <MenuList>
          {Object.keys(RenewalCycleEnum).map((plan, key) => (
            <MenuItem
              key={key}
              onClick={() => setRenewalCycle(plan as RenewalCycleEnum)}
              fontSize="sm"
            >
              {capitalizeFirstLetter(plan)}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Stack>
  );

  const renderFreeToolCheck = () => (
    <Stack>
      <FormLabel fontSize="sm">Is this a free tool?</FormLabel>
      <Checkbox
        isChecked={isFreeTool}
        onChange={(e) => setIsFreeTool(e.target.checked)}
      />
    </Stack>
  );

  const renderToolSelect = () => (
    <Stack>
      <FormLabel fontSize="sm">Tool Select</FormLabel>
      <Select
        isMulti={false}
        options={
          data
            ? data.map((d) => ({
                label: d.name,
                value: d.name,
              }))
            : []
        }
        placeholder="Select or Search for a Tool..."
        onChange={(option) =>
          setSelectedOption({
            name: option.value,
          })
        }
      />
    </Stack>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a new tool</ModalHeader>
        <ModalCloseButton />
        <Divider mb={2} />
        <ModalBody>
          <Stack spacing={6}>
            {renderToolSelect()}
            {renderFreeToolCheck()}
            {renderRenewalCycle()}
            {renderRenewalDate()}
            {renderRenewalCost()}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Flex alignItems="center" justifyContent="flex-end">
              <Button
                colorScheme="blue"
                onClick={handleClick}
                isDisabled={!selectedOption}
                size="sm"
                isLoading={isCreating}
              >
                Add {selectedOption?.name}
              </Button>
            </Flex>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

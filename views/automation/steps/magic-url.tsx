import { HStack, Stack, Text, Tooltip, useClipboard, useToast } from "@chakra-ui/react";
import { useGenerateMagicTokenMutation } from "api/auth.api";
import { useListUsersQuery } from "api/user.api";
import { Button } from "components/button";
import { Select } from "components/select";
import { BASE_FRONTEND_URL } from "config/urls";
import { FC, useEffect, useMemo, useState } from "react";
import { typeCheckError } from "utils";
import { ModalStepWrapper } from "./modal-step-wrapper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MagicUrl: FC<Props> = (props) => {
  const { data: users, isLoading } = useListUsersQuery();
  const [generateMagicToken, { isLoading: isGenerating, error: generateError }] =
    useGenerateMagicTokenMutation();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [magicUrl, setMagicUrl] = useState<string | null>(null);
  const toast = useToast();
  const { onCopy, hasCopied, setValue } = useClipboard("");

  useEffect(() => {
    if (!props.isOpen) {
      setSelectedUserId(null);
      setMagicUrl(null);
    }
  }, [props]);

  const userOptions = useMemo(() => {
    if (!users) return [];
    return users.map((user) => ({
      value: user.id.toString(),
      label: `${user.firstName} ${user.lastName} (${user.email})`,
    }));
  }, [users]);

  const handleGenerateMagicToken = async () => {
    if (!selectedUserId) return;
    const response = await generateMagicToken({ userId: selectedUserId });

    if ("error" in response) {
      toast({
        title: typeCheckError(generateError) || "An error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setMagicUrl(response.data.magicUrl);
    setValue(BASE_FRONTEND_URL + response.data.magicUrl);
  };

  const renderMagicUrl = () => (
    <Stack border="solid 1px lightgray" borderRadius="md" p={8}>
      <Text fontSize="sm" fontWeight="semibold">
        Magic URL:
      </Text>
      <Tooltip
        label="Copy this one-time link into the URL to access the Set Password Page for the specific user"
        hasArrow
      >
        <Text>
          {BASE_FRONTEND_URL}
          {magicUrl}
        </Text>
      </Tooltip>
    </Stack>
  );

  return (
    <ModalStepWrapper
      {...props}
      title="Generate Magic URL"
      showContentStrategy={false}
      showTeam={false}
    >
      <Stack>
        <Text fontSize="sm" fontWeight="semibold">
          Which user needs a magic link?
        </Text>
        <Select
          options={userOptions}
          placeholder="🔍 Search for a user..."
          onChange={({ value }) => setSelectedUserId(parseInt(value))}
          isLoading={isLoading}
        />
        {magicUrl && renderMagicUrl()}

        <HStack justifyContent="flex-end">
          {magicUrl && (
            <Button isLoading={isGenerating} disabled={!selectedUserId} onClick={onCopy}>
              {hasCopied ? "Copied" : "Copy"}
            </Button>
          )}
          <Button
            onClick={handleGenerateMagicToken}
            isLoading={isGenerating}
            isDisabled={!selectedUserId}
          >
            🪄 Generate
          </Button>
        </HStack>
      </Stack>
    </ModalStepWrapper>
  );
};

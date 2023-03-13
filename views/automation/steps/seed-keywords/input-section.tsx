import { Box, Checkbox, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { Image } from "components/image";
import { FC, useEffect, useState } from "react";

interface Props {
  title: string;
  subtitle?: string;
  label: string;
  helperText: string;
  onChange: (value: string | number) => void;
  defaultValue: string | number;
  inputType?: "number" | "text";
  onCheck?: (value: boolean) => void;
  isChecked?: boolean;
  checkLabel?: string;
}

const InputSection: FC<Props> = ({
  title,
  subtitle,
  label,
  helperText,
  onChange,
  defaultValue,
  onCheck,
  isChecked,
  checkLabel,
  inputType = "number",
}) => {
  const [input, setInput] = useState<string | number>(defaultValue);
  useEffect(() => {
    if (onChange) {
      onChange(input);
    }
  }, [input, onChange]);

  return (
    <Stack spacing={6}>
      <HStack>
        <Box
          width={18}
          height={18}
          position="relative"
          borderRadius={4}
          overflow="hidden"
        >
          <Image src="steps/semrush.jpeg" layout="fill" alt="Semrush Logo" />
        </Box>
        <Text fontWeight="bold" fontSize="md">
          {title}
        </Text>
      </HStack>
      {onCheck && (
        <Stack spacing={6}>
          <Checkbox
            onChange={({ target: { checked } }) => {
              onCheck(checked);
            }}
            defaultChecked={isChecked}
          >
            <Text fontSize="sm">{checkLabel}</Text>
          </Checkbox>

          {subtitle && (
            <Text fontSize="xs" opacity={0.75}>
              {subtitle}
            </Text>
          )}
        </Stack>
      )}

      <Stack>
        <HStack w="75%">
          <Text fontWeight="semibold" fontSize="sm">
            {label}
          </Text>
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            type={inputType}
            w="15%"
            px={2}
            fontSize="sm"
          />
        </HStack>
        <Text fontSize="xs" opacity={0.75}>
          {helperText}
        </Text>
      </Stack>
    </Stack>
  );
};

export default InputSection;

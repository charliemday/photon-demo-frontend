import { Stack, Text } from "@chakra-ui/react";
import { BRAND_COLOR } from "config";
import { FC } from "react";

export interface Props {
  title: string;
  value: number;
  color?: string;
}

export const ContentDataCard: FC<Props> = ({ title, value, color = BRAND_COLOR }) => {
  const formatValue = (value: number) => {
    if (value > 1e6) {
      return `${value / 1e6}M`;
    }

    if (value > 1e3) {
      return `${value / 1e3}K`;
    }

    return value;
  };

  return (
    <Stack
      background={color}
      paddingX="16px"
      paddingY="12px"
      borderRadius="8px"
      justify="space-between"
      spacing="8px"
    >
      <Text fontSize="xs" fontWeight="semibold">
        {title}
      </Text>

      <Text fontSize="2xl" fontWeight="semibold">
        {formatValue(value)}
      </Text>
    </Stack>
  );
};

import { Flex, Skeleton, Stack, Text } from "@chakra-ui/react";
import { Tag } from "components/tag";
import { BRAND_COLOR } from "config";
import { OverviewStat } from "hooks/useBuildOverviewStats.hook";
import { FC } from "react";

export interface Props extends Partial<OverviewStat> {
  width?: number;
  isLoading?: boolean;
  height?: number;
}

export const DataCard: FC<Props> = ({
  title,
  textColor,
  value,
  delta,
  width,
  height,
  isLoading,
  color = BRAND_COLOR,
}) => {
  const formatValue = (value: number) => {
    if (value > 1e6) {
      return `${value / 1e6}M`;
    }

    if (value > 1e3) {
      return `${value / 1e3}K`;
    }

    return value;
  };

  const formatDelta = (value: number) => {
    const sign = value > 0 ? "+" : "-";
    return `${sign} ${Math.round(Math.abs(value) * 100)}%`;
  };

  if (isLoading) {
    return <Skeleton width={width} borderRadius="md" height={height || 50} />;
  }

  return (
    <Stack
      background={color}
      padding="12px"
      borderRadius="8px"
      justify="space-between"
      spacing="4px"
      w="full"
    >
      <Text fontSize="xs" fontWeight="semibold" color={textColor} lineHeight="1">
        {title}
      </Text>

      <Text fontSize="2xl" fontWeight="bold" color={textColor} lineHeight="1">
        {formatValue(value || 0)}
      </Text>

      <Flex opacity={0.7}>
        <Tag text={delta ? formatDelta(delta) : "-"} size="sm" />
      </Flex>
    </Stack>
  );
};

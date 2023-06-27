import { Flex, HStack, Progress, Text, Tooltip } from "@chakra-ui/react";
import { Assigned } from "components/assigned";
import { Button } from "components/button";
import { Tag } from "components/tag";
import { Body } from "components/text";
import { GREEN } from "config";
import { FC } from "react";

export type RowSize = "xs" | "sm" | "md" | "lg";

export enum RowItemTypes {
  text = "text",
  tag = "tag",
  avatar = "avatar",
  progress = "progress",
  button = "button",
  /**
   * For more complex components
   */
  component = "component",
}

export interface RowDataItem {
  value: string | number | FC;
  type: RowItemTypes;
  flex?: number;
  size?: RowSize;
  tagColor?: string;
  onClick?: () => void;
  tooltip?: boolean;
}

interface Props extends RowDataItem {
  onClick?: () => void;
}

export const TableRowItem: FC<Props> = ({
  value,
  type,
  onClick,
  tagColor,
  tooltip = true,
  size = "xs",
}) => {
  if (type === RowItemTypes.text && typeof value === "string") {
    if (tooltip) {
      return (
        <Tooltip label={value} hasArrow>
          <Text fontSize={size} key={value} isTruncated>
            {value}
          </Text>
        </Tooltip>
      );
    }

    return (
      <Text fontSize={size} key={value} isTruncated>
        {value}
      </Text>
    );
  }

  if (type === RowItemTypes.tag && typeof value === "string") {
    return <Tag key={value} fontSize={size} text={value} bgColor={tagColor} />;
  }

  if (type === RowItemTypes.avatar && typeof value === "string") {
    return <Assigned key={value} name={value} size={size} />;
  }

  if (type === RowItemTypes.progress && typeof value === "number") {
    if (value === 100) {
      return <Tag key={value} fontSize={size} text={"✅ Complete"} bgColor={GREEN} />;
    }

    return (
      <HStack>
        <Flex>
          <Progress value={value} size="md" width={75} borderRadius="md" />
        </Flex>
        <Body>{value}%</Body>
      </HStack>
    );
  }

  if (type === RowItemTypes.button && typeof value === "string") {
    return (
      <Button onClick={onClick} size={size}>
        {value}
      </Button>
    );
  }

  if (type === RowItemTypes.component) {
    const Component = value as FC;
    return <Component />;
  }

  return null;
};

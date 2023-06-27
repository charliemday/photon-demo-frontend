import {
  Tag as ChakraTag,
  TagLabel,
  ThemingProps,
  Tooltip,
  TypographyProps,
} from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  text: string;
  bgColor?: string;
  textColor?: string;
  fontSize?: TypographyProps["fontSize"];
  size?: ThemingProps["size"];
  showTooltip?: boolean;
  textAlign?: TypographyProps["textAlign"];
  fontWeight?: TypographyProps["fontWeight"];
}

export const Tag: FC<Props> = ({
  text,
  bgColor,
  textColor,
  fontSize,
  showTooltip,
  textAlign = "center",
  fontWeight = "semibold",
  size = "md",
}) => {
  if (!text) return null;

  const renderTag = () => (
    <ChakraTag bgColor={bgColor} textColor={textColor} size={size}>
      <TagLabel fontSize={fontSize} textAlign={textAlign} fontWeight={fontWeight}>
        {text}
      </TagLabel>
    </ChakraTag>
  );

  if (showTooltip) {
    return (
      <Tooltip label={text} aria-label={text} hasArrow>
        {renderTag()}
      </Tooltip>
    );
  }

  return renderTag();
};

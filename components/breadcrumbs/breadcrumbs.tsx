import { HStack } from "@chakra-ui/react";
import { Label } from "components/text";
import React from "react";
import { AiOutlineRight } from "react-icons/ai";

export interface Breadcrumb {
  label: string;
  onClick?: () => void;
}

interface Props {
  breadcrumbs: Breadcrumb[];
}

export const Breadcrumbs: React.FC<Props> = ({ breadcrumbs }) => (
  <HStack spacing={3}>
    {breadcrumbs.map(({ label, onClick }, index) => (
      <HStack key={index} spacing={3}>
        <Label
          onClick={onClick && onClick}
          _hover={{
            textDecoration: onClick && "underline",
            cursor: onClick && "pointer",
          }}
        >
          {label}
        </Label>
        {index !== breadcrumbs.length - 1 && <AiOutlineRight />}
      </HStack>
    ))}
  </HStack>
);

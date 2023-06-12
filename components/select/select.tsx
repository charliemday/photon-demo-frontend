import { Flex, Skeleton } from "@chakra-ui/react";
import React from "react";
import ReactSelect, { ContainerProps, createFilter } from "react-select";

export interface Option {
  value: string;
  label: string;
}

const customStyles = {
  container: (provided: ContainerProps) => ({
    ...provided,
    width: "100%",
  }),
};

interface Props {
  options: Option[];
  onChange: (e: Option) => void;
  placeholder?: string;
  defaultValue?: any;
  isMulti?: boolean;
  isLoading?: boolean;
  noOptionsMessage?: () => string;
}

export const Select: React.FC<Props> = ({
  options,
  placeholder = "Select...",
  onChange,
  defaultValue = [],
  isMulti = false,
  isLoading = false,
  noOptionsMessage = () => "No options",
}) =>
  isLoading ? (
    <Flex justifyContent="center" w="full">
      <Skeleton w="full" h={8} borderRadius="md" />
    </Flex>
  ) : (
    <div style={{ width: "100%", zIndex: 999 }}>
      <ReactSelect
        isMulti={isMulti}
        options={options}
        placeholder={placeholder}
        onChange={onChange}
        defaultValue={defaultValue}
        filterOption={createFilter({
          ignoreAccents: false,
        })}
        noOptionsMessage={noOptionsMessage}
      />
    </div>
  );

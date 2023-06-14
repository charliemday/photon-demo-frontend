import { Flex, Skeleton } from "@chakra-ui/react";
import { FC } from "react";
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
  defaultValue?: Option;
  isMulti?: boolean;
  isLoading?: boolean;
  noOptionsMessage?: () => string;
}

export const Select: FC<Props> = ({
  options,
  placeholder = "Select...",
  onChange,
  defaultValue,
  isMulti = false,
  isLoading = false,
  noOptionsMessage = () => "No options",
}) => {
  return isLoading ? (
    <Flex justifyContent="center" w="full">
      <Skeleton w="full" h={8} borderRadius="md" />
    </Flex>
  ) : (
    <div style={{ width: "100%", zIndex: 999 }}>
      <ReactSelect
        key={defaultValue ? `${defaultValue.value}` : ``}
        isMulti={isMulti}
        options={options}
        placeholder={placeholder}
        // @ts-ignore
        onChange={onChange}
        defaultValue={defaultValue}
        filterOption={createFilter({
          ignoreAccents: false,
        })}
        noOptionsMessage={noOptionsMessage}
      />
    </div>
  );
};

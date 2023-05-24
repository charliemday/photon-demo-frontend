import React from "react";
import ReactSelect, { createFilter } from "react-select";

export interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  onChange: (e: Option) => void;
  placeholder?: string;
  defaultValue?: any;
  isMulti?: boolean;
}

export const Select: React.FC<Props> = ({
  options,
  placeholder = "Select...",
  onChange,
  defaultValue = [],
  isMulti = false,
}) => (
  <ReactSelect
    isMulti={isMulti}
    options={options}
    placeholder={placeholder}
    onChange={onChange}
    defaultValue={defaultValue}
    filterOption={createFilter({
      ignoreAccents: false,
    })}
  />
);

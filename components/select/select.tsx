import React from "react";
import ReactSelect from "react-select";

interface Props {
  options: {
    value: string;
    label: string;
  }[];
  placeholder: string;
  onChange: (e: any) => void;
  defaultValue?: any;
  isMulti?: boolean;
}

export const Select: React.FC<Props> = ({
  options,
  placeholder = "Select...",
  onChange,
  defaultValue = [],
  isMulti = true,
}) => (
  <ReactSelect
    isMulti={isMulti}
    options={options}
    placeholder={placeholder}
    onChange={onChange}
    defaultValue={defaultValue}
  />
);

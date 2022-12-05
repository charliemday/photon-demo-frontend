import React from "react";
import {
  InputGroup,
  Input,
  InputRightElement,
  Button,
  InputProps,
} from "@chakra-ui/react";

interface Props extends InputProps {}

export const PasswordInput: React.FC<Props> = (props) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="Enter password"
        {...props}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

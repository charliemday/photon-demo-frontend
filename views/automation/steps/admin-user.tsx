import { Box, Input, Stack } from "@chakra-ui/react";
import { Button } from "components/button";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setAuthToken } from "store/slices/auth.slice";
import { ModalStepWrapper } from "./modal-step-wrapper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminUser: React.FC<Props> = (props) => {
  const [token, setToken] = useState<string>("");
  const dispatch = useDispatch();

  const handleTokenChange = () => {
    dispatch(setAuthToken(token));
  };

  return (
    <ModalStepWrapper {...props}>
      <Stack>
        <Input
          placeholder="Insert here"
          onChange={(e) => {
            setToken(e.target.value);
          }}
        />
        <Box>
          <Button onClick={handleTokenChange}>Submit</Button>
        </Box>
      </Stack>
    </ModalStepWrapper>
  );
};

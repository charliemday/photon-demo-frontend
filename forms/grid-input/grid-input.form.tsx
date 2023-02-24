import {
  Box,
  FormControl,
  Grid,
  GridItem,
  HStack,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Button } from "components/button";
import { useEffect, useState } from "react";
import { BiMinusCircle } from "react-icons/bi";
import uuid from "react-uuid";

interface Props {
  onChange?: (competitors: string[]) => void;
  buttonLabel?: string;
}

const GridInputForm: React.FC<Props> = ({
  onChange,
  buttonLabel = "Submit",
}) => {
  const [inputs, setInputs] = useState<{
    [key: string]: string;
  }>({
    [uuid()]: "",
  });

  useEffect(() => {
    if (onChange) {
      onChange(Object.values(inputs));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  const renderCompetitorInput = (key: string) => (
    <GridItem colSpan={1}>
      <HStack pr={2} w="full">
        <FormControl isRequired>
          <Input
            placeholder="Target Keyword"
            value={inputs[key]}
            onChange={(e) => {
              setInputs((s) => {
                const newInputs = { ...s };
                newInputs[key] = e.target.value;
                return newInputs;
              });
            }}
          />
        </FormControl>
        <Box
          cursor="pointer"
          opacity={0.5}
          _hover={{
            color: "red.500",
            opacity: 1,
          }}
          onClick={() => {
            setInputs((s) => {
              const newInputs = { ...s };
              delete newInputs[key];
              return newInputs;
            });
          }}
        >
          <BiMinusCircle />
        </Box>
      </HStack>
    </GridItem>
  );

  return (
    <Stack w="full">
      <Grid templateColumns="repeat(2, 1fr)" gap={3}>
        {Object.keys(inputs).map((inputKey, key) =>
          renderCompetitorInput(inputKey)
        )}
      </Grid>
      <Box>
        <Button
          size="sm"
          mt={3}
          onClick={() => {
            setInputs((s) => {
              const newInputs = { ...s };
              newInputs[uuid()] = "";
              return newInputs;
            });
          }}
        >
          {buttonLabel}
        </Button>
      </Box>
    </Stack>
  );
};

export default GridInputForm;

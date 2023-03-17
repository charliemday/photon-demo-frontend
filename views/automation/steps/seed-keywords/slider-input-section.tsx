import React, { useEffect, useState } from "react";

import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
} from "@chakra-ui/react";

import { MdGraphicEq } from "react-icons/md";

interface Props {
  defaultValue?: number;
  onChange?: (value: number) => void;
}

const SliderInputSection: React.FC<Props> = ({
  defaultValue = 0.1,
  onChange,
}) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    onChange && onChange(value);
  }, [value, onChange]);

  return (
    <Stack w="full" spacing={12}>
      <Stack>
        <Text fontWeight="bold">{`📐 Percentage of results to run through PAA`}</Text>
        <Text fontSize="xs" opacity={0.75}>
          This will send the top {Math.floor(value * 100)}% broad keywords based
          on volume through PAA.
        </Text>
      </Stack>
      <Box w="full">
        <Slider
          aria-label="slider-ex-4"
          defaultValue={defaultValue * 100}
          onChange={(value) => setValue(value / 100)}
        >
          <SliderTrack bg="red.100">
            <SliderFilledTrack bg="tomato" />
          </SliderTrack>
          <SliderThumb boxSize={6}>
            <Box color="tomato" as={MdGraphicEq} />
          </SliderThumb>
        </Slider>
      </Box>
    </Stack>
  );
};

export default SliderInputSection;

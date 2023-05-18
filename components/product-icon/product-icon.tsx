import { Box, Stack, Text } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

interface Props {
  icon: ReactNode | string;
}

export const ProductIcon: FC<Props> = ({ icon }) => (
  <Box>
    <Stack
      paddingX="20px"
      paddingY="16px"
      borderRadius="10px"
      justify="center"
      align="center"
      spacing="10px"
      overflow="hidden"
      borderColor="#000000"
      borderStartWidth="1px"
      borderEndWidth="1px"
      borderTopWidth="1px"
      borderBottomWidth="1px"
      width="70px"
      height="70px"
      background="#6B58DD"
      boxShadow="0px 0px 6px 0px rgba(169, 169, 169, 0.15)"
    >
      <Text
        fontFamily="Inter"
        lineHeight="0.88"
        fontWeight="medium"
        fontSize="24px"
        color="#6B58DD"
        textAlign="center"
      >
        {icon}
      </Text>
    </Stack>
  </Box>
);

import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `'ClashGrotesk', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
  },
  colors: {
    brand: {
      checkbox1: {
        500: "#C3E8DA",
      },
      checkbox2: { 500: "#ECD8FA" },
      checkbox3: { 500: "#F7C994" },
    },
  },
});

export default theme;

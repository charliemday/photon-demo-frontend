import "../styles/globals.css";
import type { AppProps } from "next/app";

import { Provider } from "react-redux";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { PersistGate } from "redux-persist/integration/react";
import { Analytics } from "@vercel/analytics/react";

import { store, persistor } from "store";
import { theme } from "styles";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode="light" />
          <Analytics />
          <Component {...pageProps} />
        </ChakraProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;

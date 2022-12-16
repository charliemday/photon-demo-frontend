import "../styles/globals.css";
import type { AppProps } from "next/app";

import { Provider } from "react-redux";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { PersistGate } from "redux-persist/integration/react";
import { Analytics } from "@vercel/analytics/react";

import { store, persistor } from "store";
import { theme } from "styles";
import { GoogleOAuthProvider } from "@react-oauth/google";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId="417319515275-8h0f5p130lgg07b8r2r5h680kkmc0oqo.apps.googleusercontent.com">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode="light" />
            <Analytics />
            <Component {...pageProps} />
          </ChakraProvider>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default MyApp;

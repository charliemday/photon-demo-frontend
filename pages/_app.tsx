import type { AppProps } from "next/app";
import "../styles/globals.css";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { GoogleOAuthProvider } from "@react-oauth/google";
import Script from "next/script";
import { persistor, store } from "store";
import { theme } from "styles";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId="417319515275-8h0f5p130lgg07b8r2r5h680kkmc0oqo.apps.googleusercontent.com">
      <Script src="https://js.stripe.com/v3/pricing-table.js" />
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

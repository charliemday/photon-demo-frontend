import type { AppProps } from "next/app";
import "../styles/globals.css";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { IS_PROD } from "config";
import Script from "next/script";
import { persistor, store } from "store";
import { theme } from "styles";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Stripe Pricing Table */}
      <Script src="https://js.stripe.com/v3/pricing-table.js" />
      {/* Fathom Analytics */}
      <Script
        src="https://cdn.usefathom.com/script.js"
        data-site={process.env.NEXT_PUBLIC_FATHOM_SITE_ID}
        defer
      />
      {/* Rewardful */}
      {IS_PROD && (
        <Script
          id="rewardful"
          dangerouslySetInnerHTML={{
            __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`,
          }}
        />
      )}
      {/* Hotjar */}
      {IS_PROD && (
        <Script
          id="hotjar"
          dangerouslySetInnerHTML={{
            __html: `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:3546670,hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
          }}
        />
      )}
      <Script src="https://r.wdfl.co/rw.js" data-rewardful="449653" />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode="light" />
            <Analytics />
            <Component {...pageProps} />
          </ChakraProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default MyApp;

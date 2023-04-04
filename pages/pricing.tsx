import { HStack } from "@chakra-ui/react";
import { SidebarLayout } from "components/layouts";
import React from "react";

interface Props {}

const Pricing: React.FC<Props> = () => {
  return (
    <SidebarLayout headerTitle="Baser | Pricing" title={`Pricing`}>
      {/* <Script
        id="pricing-table"
        dangerouslySetInnerHTML={{
          __html: `
            <body>
            <h1>Hello World</h1>
            </body>
           `,
        }}
      /> */}
      <HStack>
        <stripe-pricing-table
          pricing-table-id="prctbl_1Mqd96LNdzse6S4DufcZjKUy"
          publishable-key="pk_test_51LHmsRLNdzse6S4DcncvXixQcP906XLoEpkqEPAi5yFQrCaBQ8pwChTMIxex4sRHGfoAF0aKpS7qCoed61KbMUo100bPN8Mj2A"
        />
      </HStack>
    </SidebarLayout>
  );
};

export default Pricing;

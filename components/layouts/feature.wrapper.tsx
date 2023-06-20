import { Link, Stack, Text } from "@chakra-ui/react";
import { useFeatureFlag } from "hooks";
import { FC, ReactNode } from "react";
import { FeatureKeys } from "types";

interface Props {
  children: ReactNode;
  /**
   * These are the features that are restricted and require
   * the user's tier to be checked against
   */
  restrictedFeatures: FeatureKeys[];
}

export const FeatureWrapper: FC<Props> = ({ children, restrictedFeatures = [] }) => {
  const { hasAccess } = useFeatureFlag();

  if (!hasAccess({ features: restrictedFeatures }))
    return (
      <Stack pt={6}>
        <Text>
          🔒 You do not have access to this page. If you would like access please contact as at
          <Link href="mailto:info@gtebaser.com"> info@getbaser.com</Link>
        </Text>
      </Stack>
    );

  return <>{children}</>;
};

import { Stack, useDisclosure } from "@chakra-ui/react";
import { useGetSearchConsoleSitesQuery } from "api/vendor.api";
import { Select } from "components/select";
import { Body, Link } from "components/text";
import { useActiveTeam } from "hooks";
import { FC, useMemo } from "react";
import { GscConnectModal } from "views/word-seek/modals";

interface Props {
  onChange: (site: string) => void;
}

export const SiteSelect: FC<Props> = ({ onChange }) => {
  const activeTeam = useActiveTeam();
  const { isOpen, onClose, onToggle } = useDisclosure();

  const { data: sites, isLoading: isSitesLoading } = useGetSearchConsoleSitesQuery({
    teamUid: activeTeam?.uid || null,
  });
  const siteOptionData = useMemo(
    () => sites?.map((site) => ({ value: site, label: site })) || [],
    [sites],
  );

  return (
    <>
      <GscConnectModal isOpen={isOpen} onClose={onClose} />
      <Select
        onChange={({ value }) => onChange(value)}
        placeholder="🔍 Search for a site..."
        options={siteOptionData.map((site) => ({
          label: site.label.replace("sc-domain:", "https://www."),
          value: site.value,
        }))}
        isLoading={isSitesLoading}
        // @ts-ignore
        noOptionsMessage={() => (
          <Stack p={10}>
            <Body>🤔</Body>
            <Body>{`Looks like we couldn't find any sites linked to your account...make sure you've connected your GSC or alternatively try refreshing the connection`}</Body>
            <Link onClick={onToggle}>Connect Google Search Console Here</Link>
          </Stack>
        )}
      />
    </>
  );
};

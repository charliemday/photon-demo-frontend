import { useGetSearchConsoleSitesQuery } from "api/vendor.api";
import { Select } from "components/select";
import { useActiveTeam } from "hooks";
import { FC, useMemo } from "react";

interface Props {
  onChange: (site: string) => void;
}

export const SiteSelect: FC<Props> = ({ onChange }) => {
  const activeTeam = useActiveTeam();
  const { data: sites, isLoading: isSitesLoading } = useGetSearchConsoleSitesQuery({
    teamUid: activeTeam?.uid || null,
  });
  const siteOptionData = useMemo(
    () => sites?.map((site) => ({ value: site, label: site })) || [],
    [sites],
  );

  return (
    <Select
      onChange={({ value }) => onChange(value)}
      placeholder="🔍 Search for a site..."
      options={siteOptionData.map((site) => ({
        label: site.label.replace("sc-domain:", "https://www."),
        value: site.value,
      }))}
      isLoading={isSitesLoading}
      noOptionsMessage={() => "No sites found"}
    />
  );
};

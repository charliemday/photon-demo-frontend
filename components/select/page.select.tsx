import { useGetSearchConsolePagesQuery } from "api/vendor.api";
import { useActiveTeam } from "hooks";
import { FC, useMemo } from "react";
import { Select } from "./select";

interface Props {
  domain: string;
  onChange: (page: string) => void;
}

export const PageSelect: FC<Props> = ({ domain, onChange }) => {
  const activeTeam = useActiveTeam();

  const { data: pagesData, isLoading } = useGetSearchConsolePagesQuery(
    {
      teamUid: activeTeam?.uid || "",
      domain,
    },
    {
      skip: !activeTeam,
    },
  );

  const pagesOptionData = useMemo(
    () =>
      pagesData?.pages.map((page) => ({
        value: page,
        label: page,
      })) || [],
    [pagesData],
  );

  return (
    <Select
      onChange={({ value }) => onChange(value)}
      placeholder="🔍 Select a page..."
      options={pagesOptionData.map((page) => ({
        label: page.label.replace("sc-domain:", "https://www."),
        value: page.value,
      }))}
      isLoading={isLoading}
      noOptionsMessage={() => "No pages found"}
    />
  );
};

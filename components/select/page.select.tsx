import { useGetSearchConsolePagesQuery } from "api/vendor.api";
import { useActiveTeam } from "hooks";
import { FC, useMemo } from "react";
import { Select } from "./select";

interface Props {
  onChange: (page: string) => void;
  subdomain?: string;
}

export const PageSelect: FC<Props> = ({ onChange, subdomain }) => {
  const activeTeam = useActiveTeam();
  const gscUrl = activeTeam?.gscUrl || "";

  const { data: pagesData, isLoading } = useGetSearchConsolePagesQuery(
    {
      teamUid: activeTeam?.uid || "",
      domain: gscUrl || "",
    },
    {
      skip: !activeTeam || !gscUrl,
    },
  );

  const pagesOptionData = useMemo(() => {
    const checkSubdomain = (page: string) => {
      if (subdomain) {
        return page.includes(subdomain);
      }
      return true;
    };

    if (!pagesData?.pages) {
      return [];
    }

    // Sort the pages alphabetically
    const sortedPages = [...pagesData?.pages].sort((a, b) => a.localeCompare(b));

    return (
      sortedPages.filter(checkSubdomain).map((page) => ({
        value: page,
        label: page,
      })) || []
    );
  }, [pagesData, subdomain]);

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

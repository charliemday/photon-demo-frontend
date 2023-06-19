import { useGetSearchConsolePagesQuery } from "api/vendor.api";
import { useActiveTeam } from "hooks";
import { FC, useEffect, useMemo } from "react";
import { extractSubdomain, formatGscDomain } from "utils";
import { Select } from "./select";

interface Props {
  onChange: (site: string) => void;
}

export const SubdomainSelect: FC<Props> = ({ onChange }) => {
  const activeTeam = useActiveTeam();
  const gscUrl = activeTeam?.gscUrl || "";

  const {
    data: pagesData,
    refetch,
    isLoading,
  } = useGetSearchConsolePagesQuery(
    {
      domain: gscUrl || "",
      teamUid: activeTeam?.uid || "",
    },
    {
      skip: !activeTeam || !gscUrl,
    },
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  const subdomainOptionData = useMemo(() => {
    const extractSubdomains = (urls: string[] = []): string[] => {
      const subdomains: string[] = [];
      const formattedGscUrl = formatGscDomain(gscUrl);

      for (const url of urls) {
        const extractedSubdomain = extractSubdomain(url);
        const subdomain = extractedSubdomain
          ? `${extractedSubdomain}.${formattedGscUrl}`
          : formattedGscUrl;
        if (subdomain && !subdomains.includes(subdomain)) {
          subdomains.push(subdomain);
        }
      }
      return subdomains;
    };

    return extractSubdomains(pagesData?.pages).map((subdomain) => ({
      label: subdomain,
      value: subdomain,
    }));
  }, [pagesData, gscUrl]);

  return (
    <Select
      onChange={({ value }) => onChange(value)}
      placeholder="🔍 Select a page..."
      options={subdomainOptionData.map(({ label, value }) => ({
        label: label,
        value: value,
      }))}
      isLoading={isLoading}
      noOptionsMessage={() => "No subdomains found"}
    />
  );
};

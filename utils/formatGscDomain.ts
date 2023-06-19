export const formatGscDomain = (domain: string): string => {
    /**
     * We format the GSC domain to:
     * 1. Remove any prefixed "sc-domain:" string from GSC
     * 2. Remove any subdomains to get the root domain
     */
    const scDomain = "sc-domain:";
    let formattedDomain = domain;

    if (domain.includes(scDomain)) {
        formattedDomain = domain.replace(scDomain, "");
    }

    // Removes any subdomains
    return formattedDomain.replace(/^(https?:\/\/)?[^\/]+\.([^\/]+\.[^\/]+)(\/.*)?$/i, "$2");
};

export interface Field {
  value: string;
  label: string;
  description: string;
}

export const metricalFields: Field[] = [
  {
    value: "Co",
    label: "Competitive Density",
    description:
      "Competitive density of advertisers using the given term for their ads. One (1) means the highest competition.",
  },
  {
    value: "Cp",
    label: "Cost per Click",
    description:
      "Average price in US dollars advertisers pay for a user's click on an ad containing a particular keyword (Google AdWords).",
  },
  {
    value: "Db",
    label: "Database",
    description: "Regional database (US, UK, Italy, etc.)",
  },
  {
    value: "Hs",
    label: "Historical Data",
    description:
      "This columns shows whether or not a report's line returns historical data.",
  },
  {
    value: "Wc",
    label: "Word Count",
    description:
      'Word Count. Allow to filter the results for keywords with certain amounts of terms in them. Like, "more than 3 words, but less than 5."',
  },
  {
    value: "Nq",
    label: "Search Volume",
    description:
      "The average number of times users have searched for a given keyword per month. We calculate this value over the last 12 months.",
  },
  {
    value: "Nr",
    label: "Number of Results",
    description:
      "The total number of organic results returned for a given keyword at the last date of collection.",
  },
  {
    value: "P0",
    label: "Position 0",
    description:
      "A position of the first queried domain for a particular keyword in Google's top 100 organic or paid search results.",
  },
  {
    value: "P1",
    label: "Position 1",
    description:
      "A position of the second queried domain for a particular keyword in Google's top 100 organic or paid search results.",
  },
  {
    value: "P2",
    label: "Position 2",
    description:
      "A position of the third queried domain for a particular keyword in Google's top 100 organic or paid search results.",
  },
  {
    value: "P3",
    label: "Position 3",
    description:
      "A position of the fourth queried domain for a particular keyword in Google's top 100 organic or paid search results.",
  },
  {
    value: "P4",
    label: "Position 4",
    description:
      "A position of the fifth queried domain for a particular keyword in Google's top 100 organic or paid search results.",
  },
  {
    value: "Ph",
    label: "Phrase",
    description:
      "Keyword bringing users to the website via Google's top 100 organic search results. You can enter multiple keywords by separating them with a comma. A comma is treated as an OR operator. Max 300 characters.",
  },
  {
    value: "Po",
    label: "Position",
    description:
      "Position a URL gets with a particular keyword in Google's top 100 organic or paid search results.",
  },
  {
    value: "Pp",
    label: "Paid Position",
    description:
      "The position of the Ad at the time of previous data collection",
  },
  { value: "Pr", label: "Price", description: "Price of promoted product" },
  { value: "Qu", label: "Query", description: "Query" },
  { value: "Rt", label: "Report Type", description: "Report type" },
  {
    value: "Tc",
    label: "Traffic Cost",
    description:
      "The percentage of the domain's total traffic cost that is attributed to a particular keyword.",
  },
  {
    value: "Tr",
    label: "Traffic Rank",
    description:
      "The share of traffic driven to the website with a particular keyword for a specified period.",
  },
  { value: "Ts", label: "Timestamp", description: "UNIX Timestamp." },
  {
    value: "Tt",
    label: "Traffic Share",
    description:
      "The title of a product listing ad that represents the name of a promoted product",
  },
  {
    value: "Ur",
    label: "URL",
    description: "The URL of the target page (Backlinks).",
  },
  { value: "Vu", label: "Visible URL", description: "Visible URL." },
  {
    value: "In",
    label: "Intent",
    description:
      "Filter by keyword intent. Possible values: 0 - Commercial, 1 - Informational, 2 - Navigational, 3 - Transactional.",
  },
  {
    value: "Ipu",
    label: "Intent Unknown",
    description: "Number of positions with unknown intent.",
  },
  {
    value: "Ip0",
    label: "Intent Commercial",
    description: "Number of positions with the Commercial intent.",
  },
  {
    value: "Ip1",
    label: "Intent Informational",
    description: "Number of positions with the Informational intent.",
  },
  {
    value: "Ip2",
    label: "Intent Navigational",
    description: "Number of positions with the Navigational intent.",
  },
  {
    value: "Ip3",
    label: "Intent Transactional",
    description: "Number of positions with the Transactional intent.",
  },
];

export const textFields: Field[] = [
  {
    value: "Ph",
    label: "Phrase",
    description:
      "The keyword bringing users to the URL via Google's top 100 organic search results.",
  },
  { value: "Qu", label: "Query", description: "Query" },
  { value: "Rt", label: "Report Type", description: "Report type" },
  {
    value: "Ur",
    label: "URL",
    description: "The URL displayed in search results for the given keyword.",
  },
  {
    value: "Vu",
    label: "Visible URL",
    description:
      "Display URL. This is the URL displayed on your Ad, identifying your site for users",
  },
  { value: "title", label: "Title", description: "The title of a text ad" },
  { value: "text", label: "Ad Title", description: "The title of a text ad" },
  {
    value: "ad",
    label: "Ad",
    description: "The concatenated title, text and visible URL of a text ad",
  },
  {
    value: "url",
    label: "URL",
    description: "The visible URL, or the target URL, or the domain name",
  },
];

export const metricOperations: Field[] = [
  { value: "Eq", label: "Equals", description: "equals" },
  { value: "Gt", label: "Greater Than", description: "greater than" },
  { value: "Lt", label: "Less Than", description: "less than" },
];

export const textOperations: Field[] = [
  { value: "Bw", label: "Starts with", description: "starts with" },
  { value: "Ew", label: "Ends with", description: "ends with" },
  { value: "Eq", label: "Exactly matching", description: "exactly matching" },
  { value: "Co", label: "Containing", description: "containing" },
  { value: "Wm", label: "Word matching", description: "word matching" },
];

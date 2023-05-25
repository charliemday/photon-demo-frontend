export enum KEY {
    AHREFS_STEP_1 = "ahrefs-step-1",
    SEMRUSH_STEP_1 = "semrush-step-1",
    COMBINED_STEPS = "combined-steps",
    SEMRUSH_BROAD_SEED_KEYWORDS = "semrush-broad-seed-keywords",
    PEOPLE_ALSO_ASKED = "people-also-asked",
    SEARCH_CONSOLE_CONNECT = "search-console-connect",
    SEARCH_CONSOLE_REPORT = "search-console-report",
    COMPARE_CONSOLE_REPORT = "compare-console-report",
    UPLOAD_AHREFS_REPORT = "upload-ahrefs-report",
    POPULATE_SC_REPORTS = "populate-sc-reports",
    KEYWORD_INSIGHTS_UPLOAD = "keyword-insights-upload",
    KEYWORD_INSIGHTS_RESULTS = "keyword-insights-results",
    TEAM_BLOGS = "team-blogs",
    ADMIN_USER = "admin-user",
    TEAM_CONTENT_STRATEGIES = "team-content-strategies",
    TASK_MODAL = "task-modal",
    WORD_SEEK_JOBS = "word-seek-jobs",
    MAGIC_URL = "magic-url",
}

export interface STEP {
    title: string;
    description: string;
    key?: KEY;
    comingSoon?: boolean;
    image?: string | string[];
    isDisabled?: boolean;
    isNew?: boolean;
    isDeprecated?: boolean;
}

export const STEPS: { title: string; steps: STEP[] }[] = [
    {
        title: "🌱 Step 1",
        steps: [
            {
                title: "1.1 SEMRush Competitors",
                description: `This will run Target Keywords and Competitors through the SEMRush API`,
                key: KEY.SEMRUSH_STEP_1,
                image: ["/openai-avatar.png", "/steps/semrush.jpeg"],
            },
            {
                title: "1.2 SEMRush Broad Seed Keywords",
                description: `This will run Target Keywords through the SEMRush API`,
                key: KEY.SEMRUSH_BROAD_SEED_KEYWORDS,
                image: ["/steps/semrush.jpeg"],
            },
            {
                title: "1.3 Combined Steps",
                description: `This will run both Step 1 and Step 2`,
                key: KEY.COMBINED_STEPS,
                image: [
                    "/steps/excel.png",
                    "/openai-avatar.png",
                    "/steps/ahrefs.jpeg",
                    "/steps/semrush.jpeg",
                ],
            },
        ],
    },
    {
        title: "🔍 Step 2",
        steps: [
            {
                title: "2.1 People Also Asked",
                description: `This will take a CSV file with the first column of sorted keywords and get the "People Also Asked" questions for each keyword`,
                key: KEY.PEOPLE_ALSO_ASKED,
                image: "/steps/google.jpeg",
            },
        ],
    },
    {
        title: "🧠 Step 3",
        steps: [
            {
                title: "3.1 Upload Keyword Insights Data",
                description: `This will automate the content creation on the SEO Hub`,
                image: "/openai-avatar.png",
                key: KEY.KEYWORD_INSIGHTS_UPLOAD,
            },
            {
                title: "3.2 View Themes",
                description: `Views the keyword themes prior to blog generation`,
                image: "/openai-avatar.png",
                key: KEY.KEYWORD_INSIGHTS_RESULTS,
            },
            {
                title: "3.3 Blog Outlines",
                description: `View the team's blog outlines`,
                image: "/openai-avatar.png",
                key: KEY.TEAM_BLOGS,
            },
        ],
    },
    {
        title: "📊 Reporting & Tasks",
        steps: [
            {
                title: "Tasks",
                description: "Manually view, create, update, and remove tasks for a team",
                key: KEY.TASK_MODAL,
                image: "/logos/baser.png",
                isNew: true,
            },
            {
                title: "Populate SC Reports",
                description: `This will populate the Search Console reports for *all* the teams.`,
                key: KEY.POPULATE_SC_REPORTS,
                image: "/steps/search-console.svg",
            },
        ],
    },
    {
        title: "🛠️ SEO Tools",
        steps: [
            {
                title: "Connect up your Google Search Console",
                description: `This will allow Baser to access your Google Search Console data through Google's API so we can show your site metrics on your SEO hub.`,
                key: KEY.SEARCH_CONSOLE_CONNECT,
                image: "/steps/google.jpeg",
            },
            {
                title: "Word Seek",
                description: `Take the GSC keywords and check whether they exist on the
          pages they're associated with. The output will be saved to the drive.`,
                key: KEY.COMPARE_CONSOLE_REPORT,
                image: "/steps/search-console.svg",
            },
            {
                title: "Word Seek Jobs",
                description: "View the Word Seek jobs that are not currently complete",
                key: KEY.WORD_SEEK_JOBS,
                image: "/steps/search-console.svg",

            }
        ],
    },
    {
        title: "🔒 Admin Tools",
        steps: [
            {
                title: "Admin User",
                description: "For admin use",
                key: KEY.ADMIN_USER,
            },
            {
                title: "🪄 Generate Magic URL",
                description: "Generate a magic URL for a user",
                key: KEY.MAGIC_URL,
                isNew: true,
            }

        ],
    },
];
import { BRAND_NAME, TAG_LINE } from "config";
import type { NextPage } from "next";
import Head from "next/head";
import { WelcomeView } from "views/welcome";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>
          {BRAND_NAME} | {TAG_LINE}
        </title>
      </Head>
      <WelcomeView />
    </>
  );
};

export default Home;

import Layout from "components/layout";
import Page from "components/page";
import type { NextPage } from "next";
const Home: NextPage = () => {
  return (
    <>
      <div>
        <Layout>
          <Page />
        </Layout>
      </div>
    </>
  );
};

export default Home;

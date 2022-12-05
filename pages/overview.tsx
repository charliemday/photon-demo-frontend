import { MainLayout } from "components/layouts";
import React from "react";
import { OverviewView } from "views/overview";

const Overview: React.FC = () => (
  <MainLayout>
    <OverviewView />
  </MainLayout>
);

export default Overview;

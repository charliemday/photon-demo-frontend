import Head from "next/head";
import { FC, ReactNode } from "react";

interface Props {
  title?: string;
  children: ReactNode;
}

export const BaseLayout: FC<Props> = ({ title, children }) => (
  <div>
    <Head>
      <title>{title}</title>
    </Head>
    {children}
  </div>
);

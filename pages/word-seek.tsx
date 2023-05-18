import { SidebarLayout } from "components/layouts";
import { FC } from "react";
import { WordSeekView } from "views/word-seek";

const WordSeek: FC = () => {
  return (
    <SidebarLayout headerTitle="Baser | WordSeek" title={`Word Seek | Find your missing keywords`}>
       
      <WordSeekView />
    </SidebarLayout>
  );
};

export default WordSeek;

import { SidebarLayout } from "components/layouts";
import { WORD_SEEK } from "config";
import { useUserDetails } from "hooks";
import { FC } from "react";
import { WordSeekView } from "views/word-seek";

const WordSeek: FC = () => {
  const { fullName } = useUserDetails();

  return (
    <SidebarLayout
      headerTitle="Baser | WordSeek"
      title={fullName ? `Welcome to ${WORD_SEEK}, ${fullName} 👋` : WORD_SEEK}
    >
      <WordSeekView />
    </SidebarLayout>
  );
};

export default WordSeek;

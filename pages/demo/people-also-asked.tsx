import { MainLayout } from "components/layouts";
import { FC } from "react";
import { QuestionsAskedView } from "views/questions-asked";

const QuestionsAsked: FC = () => (
  <MainLayout>
    <QuestionsAskedView />
  </MainLayout>
);

export default QuestionsAsked;

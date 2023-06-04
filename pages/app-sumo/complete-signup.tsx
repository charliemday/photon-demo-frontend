import { BaseLayout } from "components/layouts";
import { FC } from "react";
import { CompleteSignupView } from "views/app-sumo";

interface Props {}

const CompleteSignup: FC<Props> = () => (
  <BaseLayout title="Complete Signup">
    <CompleteSignupView />
  </BaseLayout>
);

export default CompleteSignup;

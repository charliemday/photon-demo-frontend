import React from "react";
import { Button } from "./button";

interface Props {}

export const FeedbackButton: React.FC<Props> = () => {
  return (
    <Button bgColor="purple.400" color="black" size="sm">
      Feedback
    </Button>
  );
};

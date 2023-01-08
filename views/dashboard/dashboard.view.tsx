import React from "react";

interface Props {}

export const DashboardView: React.FC<Props> = () => (
  <div>
    <button
      type="button"
      onClick={() => {
        throw new Error("Sentry Frontend Error");
      }}
    >
      Click me to trigger sentry
    </button>
  </div>
);

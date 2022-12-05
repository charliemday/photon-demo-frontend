import { NextRouter } from "next/router";

export const resetQueryParams = (router: NextRouter) => {
  router.push(
    {
      query: {},
    },
    undefined,
    { shallow: true }
  );
};

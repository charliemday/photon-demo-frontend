import { Image } from "components/image";
import { FC } from "react";

const RATIO = 74 / 1000;

const APP_SUMO_IMAGE_WIDTH_LG = 500;
const APP_SUMO_IMAGE_WIDTH_MD = 300;
const APP_SUMO_IMAGE_WIDTH_SM = 200;

interface Props {
  size?: "sm" | "md" | "lg";
}

export const AppSumoLogo: FC<Props> = ({ size = "md" }) => {
  if (size === "sm") {
    return (
      <Image
        src="/appsumo_partners.png"
        alt="Welcome"
        height={APP_SUMO_IMAGE_WIDTH_SM * RATIO}
        width={APP_SUMO_IMAGE_WIDTH_SM}
      />
    );
  }

  if (size === "lg") {
    return (
      <Image
        src="/appsumo_partners.png"
        alt="Welcome"
        height={APP_SUMO_IMAGE_WIDTH_LG * RATIO}
        width={APP_SUMO_IMAGE_WIDTH_LG}
      />
    );
  }

  return (
    <Image
      src="/appsumo_partners.png"
      alt="Welcome"
      height={APP_SUMO_IMAGE_WIDTH_MD * RATIO}
      width={APP_SUMO_IMAGE_WIDTH_MD}
    />
  );
};

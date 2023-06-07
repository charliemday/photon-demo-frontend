import { Image } from "components/image";
import { FC } from "react";

const RATIO = 480 / 480;

const BASER_IMAGE_WIDTH_LG = 400;
const BASER_IMAGE_WIDTH_MD = 200;
const BASER_IMAGE_WIDTH_SM = 100;

interface Props {
  size?: "sm" | "md" | "lg";
  src?: string;
}

export const BaserLogo: FC<Props> = ({ size = "md", src = "/logos/baser.png" }) => {
  if (size === "sm") {
    return (
      <Image
        src={src}
        alt="Baser"
        height={BASER_IMAGE_WIDTH_SM * RATIO}
        width={BASER_IMAGE_WIDTH_SM}
      />
    );
  }

  if (size === "lg") {
    return (
      <Image
        src={src}
        alt="Baser"
        height={BASER_IMAGE_WIDTH_LG * RATIO}
        width={BASER_IMAGE_WIDTH_LG}
      />
    );
  }

  return (
    <Image
      src={src}
      alt="Baser"
      height={BASER_IMAGE_WIDTH_MD * RATIO}
      width={BASER_IMAGE_WIDTH_MD}
    />
  );
};

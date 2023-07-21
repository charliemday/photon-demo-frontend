import { Image } from "components/image";
import { FC } from "react";

const RATIO = 480 / 480;

const WORD_SEEK_IMAGE_WIDTH_LG = 400;
const WORD_SEEK_IMAGE_WIDTH_MD = 200;
const WORD_SEEK_IMAGE_WIDTH_SM = 100;

interface Props {
  size?: "sm" | "md" | "lg";
}

const source = "/logos/paa.png";

export const PaaLogo: FC<Props> = ({ size = "md" }) => {
  if (size === "sm") {
    return (
      <Image
        src={source}
        alt="WordSeek"
        height={WORD_SEEK_IMAGE_WIDTH_SM * RATIO}
        width={WORD_SEEK_IMAGE_WIDTH_SM}
      />
    );
  }

  if (size === "lg") {
    return (
      <Image
        src={source}
        alt="WordSeek"
        height={WORD_SEEK_IMAGE_WIDTH_LG * RATIO}
        width={WORD_SEEK_IMAGE_WIDTH_LG}
      />
    );
  }

  return (
    <Image
      src={source}
      alt="WordSeek"
      height={WORD_SEEK_IMAGE_WIDTH_MD * RATIO}
      width={WORD_SEEK_IMAGE_WIDTH_MD}
    />
  );
};

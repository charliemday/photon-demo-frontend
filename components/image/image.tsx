import React, { useState } from "react";
import NextImage, { ImageProps } from "next/image";

interface Props extends ImageProps {
  fallbackComponent?: JSX.Element;
  unoptimized?: boolean;
}

export const Image: React.FC<Props> = ({
  fallbackComponent,
  unoptimized = true,
  ...rest
}) => {
  const [imageError, setImageError] = useState(false);

  if (fallbackComponent && imageError) {
    return fallbackComponent;
  }

  return (
    <NextImage
      unoptimized={unoptimized}
      {...rest}
      onError={() => setImageError(true)}
    />
  );
};

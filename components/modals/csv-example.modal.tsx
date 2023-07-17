import { Flex } from "@chakra-ui/react";
import { BRAND_COLOR } from "config";
import { FC, useState } from "react";
import { PropagateLoader } from "react-spinners";
import { Modal } from "./modal";

interface Props {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CsvExampleModal: FC<Props> = ({ url, isOpen, onClose }) => {
  const [showLoader, setShowLoader] = useState(true);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      contentProps={{
        maxW: "90vw",
        height: "80vh",
        padding: 20,
      }}
    >
      <Flex
        border="solid 1px lightgray"
        h="full"
        borderRadius="lg"
        overflow="hidden"
        alignItems="center"
        justifyContent="center"
      >
        <iframe
          src={url}
          width="100%"
          height="100%"
          title="CSV Example"
          onLoad={() => setShowLoader(false)}
        />
        {showLoader && <PropagateLoader color={BRAND_COLOR} />}
      </Flex>
    </Modal>
  );
};

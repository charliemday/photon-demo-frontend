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
        position="relative"
      >
        <iframe
          src={url}
          width="100%"
          height="100%"
          title="CSV Example"
          onLoad={() => setShowLoader(false)}
          style={{
            opacity: showLoader ? 0.5 : 1,
          }}
        />
        {showLoader && (
          <Flex
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            bottom={0}
            right={0}
            alignItems="center"
            justifyContent="center"
            zIndex={99}
          >
            <PropagateLoader color={BRAND_COLOR} />
          </Flex>
        )}
      </Flex>
    </Modal>
  );
};

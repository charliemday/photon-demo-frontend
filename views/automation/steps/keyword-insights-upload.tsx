import { FC, useEffect } from "react";
import { ModalStepWrapper } from "./modal-step-wrapper";

import { useToast } from "@chakra-ui/react";
import { useUploadKeywordInsightsOutputMutation } from "api/engine.api";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { typeCheckError } from "utils";
import { UploadZone } from "./upload-zone";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const KeywordInsightsUpload: FC<Props> = (props) => {
  const activeTeam = useSelector((state: RootState) => state.team.activeTeam);

  const toast = useToast();

  const [uploadFile, { isLoading, isSuccess, isError, error }] =
    useUploadKeywordInsightsOutputMutation();

  const handleUploadClick = (files: File[]) => {
    let formData = new FormData();

    formData.append("file", files[0]);
    formData.append("team_id", activeTeam.id);

    uploadFile(formData);
  };

  useEffect(() => {
    if (!isLoading) {
      if (isSuccess) {
        toast({
          title: "Success",
          description: "Your report has been uploaded",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      if (isError && error) {
        toast({
          title: "Error",
          description: typeCheckError(error) || "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }, [isSuccess, isError, error, isLoading, toast]);

  return (
    <ModalStepWrapper {...props}>
      <UploadZone
        title="Upload Keyword Insights Data"
        subtitle="Upload the output from Keyword Insights"
        uploadText="Upload the file here"
        isLoading={isLoading}
        handleUpload={handleUploadClick}
      />
    </ModalStepWrapper>
  );
};

/**
 * TODO: Use RTK for this file
 */
import { useToast } from "@chakra-ui/react";
import { BASE_URL, ENGINE_URL } from "config/urls";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";

interface ReturnProps {
    uploadRawData: (files: File[]) => void;
    uploadAlsoAskedData: (data: { file: File, language?: string, team: string }) => null | any;
    isRawDataLoading: boolean;
    isAlsoAskedDataLoading: boolean;
};

export const useAutomation = (): ReturnProps => {

    const [isRawDataLoading, setIsRawDataLoading] = useState<boolean>(false);
    const [isAlsoAskedDataLoading, setIsAlsoAskedDataLoading] = useState<boolean>(false);
    const activeTeam = useSelector((state: RootState) => state.team.activeTeam)

    const toast = useToast();

    const uploadRawData = (files: File[]) => {


        setIsRawDataLoading(true);
        // Call the API to upload the CSV file
        const formData = new FormData();

        files.forEach((file) => {
            formData.append("files", file);
        });

        formData.append("team_id", activeTeam?.id);

        fetch(`${ENGINE_URL}/process-csv`, {
            method: "POST",
            body: formData,
        })
            .then((res) => res.blob())
            .then(() => {
                setIsRawDataLoading(false);
                toast({
                    title: "Success",
                    description: "Your CSV file has been processed and saved to the Drive.",
                    status: "success",
                    isClosable: true,
                });
            })
            .catch(() => {
                setIsRawDataLoading(false);
                toast({
                    title: "Error",
                    description: "Something went wrong",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            });

    };

    const uploadAlsoAskedData = async (data: { file: File, language?: string, team: string }) => {

        const { file, language, team } = data;

        setIsAlsoAskedDataLoading(true);
        // Call the API to upload the CSV file
        const formData = new FormData();

        formData.append("file", file);
        formData.append("team", team);

        if (language) formData.append("language", language);

        const response = fetch(`${BASE_URL}/people-also-ask/`, {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((response) => {
                setIsAlsoAskedDataLoading(false);
                toast({
                    title: "Success",
                    description: "Your CSV file has been sent. We will save the QuestionsAsked output to the Drive and notify you on Slack when it's ready.",
                    status: "success",
                    isClosable: true,
                });
                return response;
            })
            .catch((e) => {
                setIsAlsoAskedDataLoading(false);
                toast({
                    title: "Error",
                    description: "Something went wrong",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return null;
            });

        return response;
    };

    return {
        uploadRawData,
        uploadAlsoAskedData,
        isRawDataLoading,
        isAlsoAskedDataLoading,
    }
};
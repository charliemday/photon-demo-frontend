import { useToast } from "@chakra-ui/react";
import { BASE_URL, ENGINE_URL } from "config/urls";
import { useState } from "react";

interface ReturnProps {
    uploadRawData: (files: File[]) => void;
    uploadAlsoAskedData: (file: File) => null | any;
    isRawDataLoading: boolean;
    isAlsoAskedDataLoading: boolean;
};

export const useAutomation = (): ReturnProps => {

    const [isRawDataLoading, setIsRawDataLoading] = useState<boolean>(false);
    const [isAlsoAskedDataLoading, setIsAlsoAskedDataLoading] = useState<boolean>(false);

    const toast = useToast();

    const uploadRawData = (files: File[]) => {

        setIsRawDataLoading(true);
        // Call the API to upload the CSV file
        const formData = new FormData();

        files.forEach((file) => {
            formData.append("files", file);
        });

        fetch(`${ENGINE_URL}/process-csv`, {
            method: "POST",
            body: formData,
        })
            .then((res) => res.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");

                a.href = url;
                a.setAttribute("download", "output.xlsx");
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                setIsRawDataLoading(false);

                toast({
                    title: "Success",
                    description: "Your CSV file has been processed",
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

    const uploadAlsoAskedData = async (file: File) => {

        setIsAlsoAskedDataLoading(true);
        // Call the API to upload the CSV file
        const formData = new FormData();

        formData.append("file", file);

        const response = fetch(`${BASE_URL}/questions-asked/`, {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((response) => {
                setIsAlsoAskedDataLoading(false);
                toast({
                    title: "Success",
                    description: "Your CSV file has been sent. We will send the QuestionsAsked output to your email and notify you on Slack when it's ready.",
                    status: "success",
                    isClosable: true,
                });
                return response;
            })
            .catch((e) => {
                console.log('error', e)
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
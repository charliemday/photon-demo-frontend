
import { useToast } from '@chakra-ui/react';
import { useWordSeekMutation } from 'api/engine.api';
import { useGetSearchConsolePagesQuery } from 'api/vendor.api';
import { typeCheckError } from 'utils';
import { useActiveTeam } from './useActiveTeam.hook';


interface ReturnProps {
    runWordSeek: (pages: string[]) => void;
    isLoading: boolean;
    isSuccess: boolean;
}

interface Props {
    site: string | null;
}

export const useRunWordSeek = (args: Props): ReturnProps => {

    const { site } = args;
    const activeTeam = useActiveTeam();
    const toast = useToast();

    const [runWordSeekMutation, { isLoading, isSuccess }] = useWordSeekMutation();
    const { data: pagesData } = useGetSearchConsolePagesQuery({
        domain: site || "",
        teamUid: activeTeam?.uid,
    }, {
        skip: !activeTeam?.uid || !site,
    });

    const runWordSeek = async (pages: string[]) => {
        if (!activeTeam?.id || !site) return;

        if (!pagesData?.pages) return;

        const data = {
            site,
            pages: pages.length === 0 ? pagesData?.pages : [...pages],
            teamId: activeTeam?.id,
        }
        const response = await runWordSeekMutation(data)

        if (!response || "error" in response) {
            toast({
                title: "Error",
                description: typeCheckError(response?.error) || "Something went wrong",
                status: "error",
                isClosable: true,
            });
            return;
        }

        toast({
            title: "Success",
            description: "WordSeek is running",
            status: "success",
            isClosable: true,
        })
    };

    return {
        runWordSeek,
        isLoading,
        isSuccess
    };
}
import { Input, Stack, Text, useToast } from "@chakra-ui/react";
import { useCreateContentStrategyMutation } from "api/strategies.api";
import { Button } from "components/button";
import { useActiveTeam } from "hooks";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { StepWizardChildProps } from "react-step-wizard";
import { setActiveContentStrategy } from "store/slices";
import { typeCheckError } from "utils";

interface Props extends Partial<StepWizardChildProps> {
  onComplete: (id: number) => void;
}

export const Step1: React.FC<Props> = ({
  nextStep,
  currentStep = 0,
  totalSteps,
  onComplete,
}) => {
  const activeTeam = useActiveTeam();
  const [name, setName] = useState<string | null>(null);
  const toast = useToast();
  const dispatch = useDispatch();

  const [
    createContentStrategy,
    { isLoading, isError, error, isSuccess, data },
  ] = useCreateContentStrategyMutation();

  useEffect(() => {
    if (!isLoading && isSuccess) {
      data?.id && onComplete(data?.id);
      nextStep && nextStep();
    }

    if (!isLoading && isError && error) {
      toast({
        title: typeCheckError(error) || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isError, isSuccess, error, nextStep, toast]);

  const handleCreateContentStrategy = async () => {
    if (activeTeam && name) {
      const createContentStrategyResponse = await createContentStrategy({
        teamId: activeTeam.id,
        body: {
          name,
        },
      });

      if ("error" in createContentStrategyResponse) return;

      if (createContentStrategyResponse.data) {
        dispatch(setActiveContentStrategy(createContentStrategyResponse.data));
      }
    }
  };

  return (
    <Stack spacing={12}>
      <Stack>
        <Text fontSize="xl" fontWeight="bold">
          Content Strategy
        </Text>
        <Text fontSize="sm" fontWeight="light" color="gray.500">
          Step {currentStep} of {totalSteps}
        </Text>
      </Stack>

      <Stack spacing={6}>
        <Text fontSize="lg" fontWeight="bold">
          Name your content strategy
        </Text>
        <Text>
          You could end up with multiple strategies for different topics. e.g.
          if you do online wish lists, you might have a strategy for Christmas
          or Birthday, with different competitors.
        </Text>
        <Input
          placeholder="Content Strategy Name"
          onChange={(e) => setName(e.target.value)}
        />
      </Stack>

      <Button
        onClick={handleCreateContentStrategy}
        isLoading={isLoading}
        isDisabled={!name}
      >
        Start Content Strategy
      </Button>
    </Stack>
  );
};

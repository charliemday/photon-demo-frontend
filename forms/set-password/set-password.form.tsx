import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { Button } from "components/button";
import { PasswordInput } from "components/inputs";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";

export interface SetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

interface Props {
  handleSubmit: (values: SetPasswordFormValues) => void;
}

const SetPasswordScheme = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 Characters")
    .required("Password Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password Required"),
});

export const SetPasswordForm: React.FC<Props> = ({ handleSubmit }) => {
  const formik = useFormik<SetPasswordFormValues>({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: SetPasswordScheme,
    onSubmit: (values) => {
      if (handleSubmit) {
        handleSubmit(values);
      } else {
        alert(JSON.stringify(values, null, 2));
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={6}>
        <Heading>🔐 Set Password</Heading>
        <FormControl
          isInvalid={!!formik.errors?.password && formik.touched.password}
        >
          <FormLabel>Password</FormLabel>
          <PasswordInput
            name="password"
            placeholder="************"
            onChange={formik.handleChange}
          />
          <FormErrorMessage>{formik.errors?.password}</FormErrorMessage>
          <FormHelperText>
            ( Must be at least 6 characters long )
          </FormHelperText>
        </FormControl>
        <FormControl
          isInvalid={
            !!formik.errors?.confirmPassword && formik.touched.confirmPassword
          }
        >
          <FormLabel>Confirm Password</FormLabel>
          <PasswordInput
            name="confirmPassword"
            placeholder="************"
            onChange={formik.handleChange}
          />
          <FormErrorMessage>{formik.errors?.confirmPassword}</FormErrorMessage>
        </FormControl>
      </Stack>
      <Flex mt={8} justifyContent="flex-end">
        <Button type="submit">Set Password</Button>
      </Flex>
    </form>
  );
};

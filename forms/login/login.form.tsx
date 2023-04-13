import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Button } from "components/button";
import { PasswordInput } from "components/inputs";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";

export interface LoginFormValues {
  email: string;
  password: string;
}

interface Props {
  onLinkClick?: () => void;
  handleLogin?: (values: LoginFormValues) => void;
  isLoading?: boolean;
  formErrorMsg?: string | null;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().required("Email Required"),
  password: Yup.string().required("Password Required"),
});

export const LoginForm: React.FC<Props> = ({
  onLinkClick,
  handleLogin,
  isLoading,
  formErrorMsg,
}) => {
  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      if (handleLogin) {
        handleLogin(values);
      } else {
        alert(JSON.stringify(values, null, 2));
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={6} mb={12}>
        <Heading as="h2">Login</Heading>
        <FormControl isInvalid={!!formik.errors?.email && formik.touched.email}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            name="email"
            placeholder="your@email.com"
            onChange={formik.handleChange}
          />
          <FormErrorMessage>
            {formik.errors?.email && formik.dirty.valueOf()}
          </FormErrorMessage>
        </FormControl>

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
        </FormControl>
      </Stack>

      {formErrorMsg && (
        <Flex mb={12}>
          <Text textColor={"red.500"}>{formErrorMsg}</Text>
        </Flex>
      )}

      <Flex alignItems="center" justifyContent="space-between">
        <Button colorScheme="purple" type="submit" isLoading={isLoading}>
          Login
        </Button>
        <Link
          textColor="blue.400"
          onClick={onLinkClick}
        >{`Don't have an account?`}</Link>
      </Flex>
    </form>
  );
};

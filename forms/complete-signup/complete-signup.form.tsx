import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Button } from "components/button";
import { PasswordInput } from "components/inputs";
import { SUPPORT_EMAIL } from "config";
import { useFormik } from "formik";
import { FC } from "react";
import * as Yup from "yup";

export interface CompleteSignupFormValues {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  handleSubmit: (values: CompleteSignupFormValues) => void;
  isLoading?: boolean;
  email: string;
}

const CompleteSignupScheme = Yup.object().shape({
  firstName: Yup.string().required("First Name Required"),
  lastName: Yup.string().required("Last Name Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 Characters")
    .required("Password Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password Required"),
});

export const CompleteSignupForm: FC<Props> = ({ handleSubmit, isLoading, email }) => {
  const formik = useFormik<CompleteSignupFormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: CompleteSignupScheme,
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
        <Heading as="h2">Complete Signup</Heading>
        <HStack>
          <FormControl isInvalid={!!formik.errors?.firstName && formik.touched.firstName}>
            <FormLabel>First Name</FormLabel>
            <Input name="firstName" placeholder="First Name" onChange={formik.handleChange} />
            <FormErrorMessage>{formik.errors?.firstName}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!formik.errors?.lastName && formik.touched.lastName}>
            <FormLabel>Last Name</FormLabel>
            <Input name="lastName" placeholder="Last Name" onChange={formik.handleChange} />
            <FormErrorMessage>{formik.errors?.lastName}</FormErrorMessage>
          </FormControl>
        </HStack>
        {email.length > 0 && (
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input value={email} isDisabled />
          </FormControl>
        )}
        <FormControl isInvalid={!!formik.errors?.password && formik.touched.password}>
          <FormLabel>Password</FormLabel>
          <PasswordInput
            name="password"
            placeholder="************"
            onChange={formik.handleChange}
          />
          <FormErrorMessage>{formik.errors?.password}</FormErrorMessage>
          <FormHelperText>( Must be at least 6 characters long )</FormHelperText>
        </FormControl>
        <FormControl isInvalid={!!formik.errors?.confirmPassword && formik.touched.confirmPassword}>
          <FormLabel>Confirm Password</FormLabel>
          <PasswordInput
            name="confirmPassword"
            placeholder="************"
            onChange={formik.handleChange}
          />
          <FormErrorMessage>{formik.errors?.confirmPassword}</FormErrorMessage>
        </FormControl>
      </Stack>
      <HStack mt={8} justifyContent="space-between">
        <Text
          color="blue.500"
          cursor="pointer"
          fontSize="sm"
          _hover={{ textDecoration: "underline" }}
          onClick={() => window.open(`mailto:${SUPPORT_EMAIL}`)}
        >
          Need some help?
        </Text>
        <Button type="submit" isDisabled={isLoading} isLoading={isLoading}>
          Complete Signup
        </Button>
      </HStack>
    </form>
  );
};

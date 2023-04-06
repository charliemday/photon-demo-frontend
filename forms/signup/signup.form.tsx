import {
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Button } from "components/button";
import { PasswordInput } from "components/inputs";
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from "config";
import { useFormik } from "formik";
import { FC, useState } from "react";
import * as Yup from "yup";

export interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  onLinkClick?: () => void;
  handleSignup?: (values: SignupFormValues) => void;
  isLoading?: boolean;
  formErrorMsg?: string | null;
}

const SignupSchema = Yup.object().shape({
  email: Yup.string().required("Email Required"),
  firstName: Yup.string().required("First Name Required"),
  lastName: Yup.string().required("Last Name Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 Characters")
    .required("Password Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password Required"),
});

export const SignupForm: FC<Props> = ({
  onLinkClick,
  handleSignup,
  isLoading,
  formErrorMsg,
}) => {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  const formik = useFormik<SignupFormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      if (handleSignup) {
        handleSignup(values);
      } else {
        alert(JSON.stringify(values, null, 2));
      }
    },
  });

  const isButtonDisabled = !hasAcceptedTerms || !formik.isValid;

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={6} mb={12}>
        <Heading as="h2">Signup</Heading>

        <HStack spacing={6}>
          <FormControl
            isInvalid={!!formik.errors?.firstName && formik.touched.firstName}
          >
            <FormLabel>First Name</FormLabel>
            <Input
              placeholder="Steve"
              name="firstName"
              onChange={formik.handleChange}
            />
            <FormErrorMessage>{formik.errors?.firstName}</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!formik.errors?.lastName && formik.touched.lastName}
          >
            <FormLabel>Last Name</FormLabel>
            <Input
              placeholder="McQueen"
              name="lastName"
              onChange={formik.handleChange}
            />
            <FormErrorMessage>{formik.errors?.lastName}</FormErrorMessage>
          </FormControl>
        </HStack>

        <FormControl isInvalid={!!formik.errors?.email && formik.touched.email}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            name="email"
            placeholder="steve@mcqueen.com"
            onChange={formik.handleChange}
          />
          <FormErrorMessage>{formik.errors?.email}</FormErrorMessage>
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
        <HStack>
          <Checkbox
            isChecked={hasAcceptedTerms}
            onChange={(e) => setHasAcceptedTerms(e.target.checked)}
          />
          <Text>
            I agree to the{" "}
            <Link href={TERMS_OF_SERVICE_URL}>Terms of Service</Link> and the{" "}
            <Link href={PRIVACY_POLICY_URL}>Privacy Policy</Link>
          </Text>
        </HStack>
      </Stack>

      {formErrorMsg && (
        <Flex mb={12}>
          <Text textColor={"red.500"} fontSize="sm">
            Could not login with credentials
          </Text>
        </Flex>
      )}

      <Flex alignItems="center" justifyContent="space-between">
        <Button
          colorScheme="purple"
          type="submit"
          isLoading={isLoading}
          isDisabled={isButtonDisabled}
        >
          Signup
        </Button>
        <Link textColor="blue.400" onClick={onLinkClick}>
          Already have an account?
        </Link>
      </Flex>
    </form>
  );
};

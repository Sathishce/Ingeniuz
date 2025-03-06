import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { apolloClient } from "./ApolloClient";

// GraphQL Queries and Mutations
export const GET_USER = gql`
  query GetUser($email: String!) {
    user(email: $email) {
      id
      email
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      requiresMFA
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $email: String!, $phone: String!) {
    register(username: $username, email: $email, phone: $phone) {
      id
      email
    }
  }
`;

export const COMPLETE_TWO_FACTOR = gql`
  mutation CompleteTwoFactor($email: String!, $emailOtp: String!, $smsOtp: String!) {
    completeTwoFactor(email: $email, emailOtp: $emailOtp, smsOtp: $smsOtp) {
      token
      username
    }
  }
`;

export const IS_FIRST_USER = gql`
  query GetIsFirstLogin($email: String!) {
    getIsFirstLogin(email: $email)
  }
`;

export const UPDATE_FIRST_LOGIN = gql`
  mutation UpdateFirstLogin($email: String!, $isFirstLogin: Boolean!) {
    updateFirstLogin(email: $email, isFirstLogin: $isFirstLogin) {
      email
      isFirstLogin
    }
  }
`;

export const UPDATE_USER_FLAG = gql`
  mutation UpdateUserFlag($email: String!, $flag: String!) {
    updateUserFlag(email: $email, flag: $flag) {
      email
    }
  }
`;

// Authentication Hooks
export const useUser = (email: string) => {
  const { loading, error, data } = useQuery(GET_USER, {
    client: apolloClient,
    variables: { email },
  });
  return { loading, error, user: data?.user };
};

/**
 * Hook to log in a user.
 *
 * @returns an object with the following properties:
 * - `login`: a function that accepts an object with `email` and `password` properties and returns a promise that resolves to a boolean indicating whether the login was successful.
 * - `loading`: a boolean indicating whether the mutation is in progress.
 * - `error`: an error object if the mutation failed.
 */
export const useLoginUser = () => {
  const [login, { loading, error }] = useMutation(LOGIN_USER, { client: apolloClient });
  return { login, loading, error };
};

/**
 * Hook to register a new user.
 *
 * @returns an object with the following properties:
 * - `register`: a function that accepts an object with `username`, `email`, and `phone` properties and returns a promise that resolves if the registration is successful.
 * - `loading`: a boolean indicating whether the mutation is in progress.
 * - `error`: an error object if the mutation failed.
 */
export const useRegisterUser = () => {
  const [register, { loading, error }] = useMutation(REGISTER_USER, { client: apolloClient });
  return { register, loading, error };
};

export const useCompleteTwoFactor = () => {
  const [completeTwoFactor, { loading, error }] = useMutation(COMPLETE_TWO_FACTOR, { client: apolloClient });
  return { completeTwoFactor, loading, error };
};

/**
 * Hook to determine if a user has logged in for the first time.
 *
 * @param email the email address of the user.
 * @returns an object with the following properties:
 * - `isFirstLogin`: a boolean indicating whether the user has logged in for the first time.
 * - `loading`: a boolean indicating whether the query is in progress.
 * - `error`: an error object if the query failed.
 */
export const useIsFirstUser = (email: string) => {
  const { data, loading, error } = useQuery(IS_FIRST_USER, {
    client: apolloClient,
    variables: { email },
  });
  return { isFirstLogin: data?.getIsFirstLogin, loading, error };
};

/**
 * Hook to update the "first login" flag for a user.
 *
 * @returns an object with the following properties:
 * - `updateFirstLogin`: a function that accepts an object with `email` and `isFirstLogin` properties and returns a promise that resolves if the mutation is successful.
 * - `loading`: a boolean indicating whether the mutation is in progress.
 * - `error`: an error object if the mutation failed.
 * - `data`: the result of the mutation, which is an object with a single property `updateFirstLogin` that is a boolean indicating whether the mutation was successful.
 */
export const useUpdateFirstLogin = () => {
  const [updateFirstLogin, { loading, error, data }] = useMutation(UPDATE_FIRST_LOGIN, { client: apolloClient });
  return { updateFirstLogin, loading, error, data };
};

/**
 * Hook to update a user's flag.
 *
 * @returns an object with the following properties:
 * - `updateUserFlag`: a function that accepts an object with `email` and `flag` properties and returns a promise that resolves if the mutation is successful.
 * - `loading`: a boolean indicating whether the mutation is in progress.
 * - `error`: an error object if the mutation failed.
 * - `data`: the result of the mutation, which is an object containing the updated user flag information.
 */

export const useUpdateUserFlag = () => {
  const [updateUserFlag, { loading, error, data }] = useMutation(UPDATE_USER_FLAG, { client: apolloClient });
  return { updateUserFlag, loading, error, data };
};
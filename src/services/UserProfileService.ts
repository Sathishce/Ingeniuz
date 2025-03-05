import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { apolloClient } from "./ApolloClient";

export const ADD_USER_PROFILE = gql`
  mutation UpdateUserProfile($email: String!, $flag: String!, $answer: String!) {
    updateUserProfile(email: $email, flag: $flag, answer: $answer)
  }
`;

export const useUpdateUserProfile = () => {
  const [updateUserProfile, { loading, error }] = useMutation(ADD_USER_PROFILE, { client: apolloClient });
  return { updateUserProfile, loading, error };
};
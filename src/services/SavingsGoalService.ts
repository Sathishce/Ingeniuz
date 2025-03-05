import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { apolloClient } from "./ApolloClient";

// GraphQL Queries and Mutations
export const SAVINGS_GOALS = gql`
  query SavingsGoals {
    savingsGoals {
      id
      name
      amount
      monthlyAmount
      createdAt
    }
  }
`;

export const ADD_SAVINGS_GOAL = gql`
  mutation AddSavingsGoal($name: String!, $amount: Float!, $monthlyAmount: Float!) {
    addSavingsGoal(name: $name, amount: $amount, monthlyAmount: $monthlyAmount) {
      id
      name
      amount
      monthlyAmount
      createdAt
    }
  }
`;

export const RENAME_SAVINGS_GOAL = gql`
  mutation RenameSavingsGoal($id: ID!, $newName: String!) {
    renameSavingsGoal(id: $id, newName: $newName) {
      id
      name
    }
  }
`;

export const DELETE_SAVINGS_GOAL = gql`
  mutation DeleteSavingsGoal($id: ID!) {
    deleteSavingsGoal(id: $id)
  }
`;

// Savings Goal Hooks
export const useSavingsGoals = () => {
  const { data, loading, error } = useQuery(SAVINGS_GOALS, { client: apolloClient });
  return { savingsGoals: data?.savingsGoals, loading, error };
};

export const useAddSavingsGoal = () => {
  const [addSavingsGoal, { loading, error }] = useMutation(ADD_SAVINGS_GOAL, {
    client: apolloClient,
    update(cache, { data: { addSavingsGoal } }) {
      const existingGoals = cache.readQuery<{ savingsGoals: any[] }>({
        query: SAVINGS_GOALS,
      });
      if (existingGoals) {
        cache.writeQuery({
          query: SAVINGS_GOALS,
          data: {
            savingsGoals: [...existingGoals.savingsGoals, addSavingsGoal],
          },
        });
      }
    },
  });
  return { addSavingsGoal, loading, error };
};

export const useRenameSavingsGoal = () => {
  const [renameSavingsGoal, { loading, error }] = useMutation(RENAME_SAVINGS_GOAL, {
    client: apolloClient,
    update(cache, { data: { renameSavingsGoal } }) {
      cache.modify({
        fields: {
          savingsGoals(existingGoals = []) {
            return existingGoals.map((goal: any) =>
              goal.id === renameSavingsGoal.id ? { ...goal, name: renameSavingsGoal.name } : goal
            );
          },
        },
      });
    },
  });
  return { renameSavingsGoal, loading, error };
};

export const useDeleteSavingsGoal = () => {
  const [deleteSavingsGoal, { loading, error }] = useMutation(DELETE_SAVINGS_GOAL, {
    client: apolloClient,
    update(cache, { data: { deleteSavingsGoal } }) {
      cache.modify({
        fields: {
          savingsGoals(existingGoals = [], { readField }) {
            return existingGoals.filter((goal: any) => readField("id", goal) !== deleteSavingsGoal);
          },
        },
      });
    },
  });
  return { deleteSavingsGoal, loading, error };
};
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { apolloClient } from "./ApolloClient";

// GraphQL Queries and Mutations
export const TRANSACTIONS = gql`
  query Transactions($startDate: String!, $endDate: String!) {
    transactions(startDate: $startDate, endDate: $endDate) {
      id
      amount
      date
      merchant
      category {
        id
        name
      }
    }
  }
`;

export const CHANGE_TRANSACTION_CATEGORY = gql`
  mutation ChangeTransactionCategory($id: ID!, $categoryIdValue: ID!) {
    changeTransactionCategory(id: $id, categoryIdValue: $categoryIdValue) {
      id
      category {
        id
        name
      }
    }
  }
`;

// Transaction Hooks
export const useTransactions = (startDate: string, endDate: string) => {
  const { data, loading, error } = useQuery(TRANSACTIONS, {
    client: apolloClient,
    variables: { startDate, endDate },
  });
  return { transactions: data?.transactions, loading, error };
};

export const useChangeTransactionCategory = () => {
  const [changeCategory, { loading, error }] = useMutation(CHANGE_TRANSACTION_CATEGORY, {
    client: apolloClient,
    update(cache, { data: { changeTransactionCategory } }) {
      cache.modify({
        fields: {
          transactions(existingTransactions = []) {
            return existingTransactions.map((transaction: any) =>
              transaction.id === changeTransactionCategory.id
                ? { ...transaction, category: changeTransactionCategory.category }
                : transaction
            );
          },
        },
      });
    },
  });
  return { changeCategory, loading, error };
};
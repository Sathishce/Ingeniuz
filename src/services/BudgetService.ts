import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { apolloClient } from './ApolloClient';

// GraphQL Queries and Mutations
export const BUDGET_SUMMARY = gql`
  query BudgetSummary($startDate: String!, $endDate: String!, $includeTransactions: Boolean!) {
    budgetSummary(startDate: $startDate, endDate: $endDate, includeTransactions: $includeTransactions) {
      categoryId
      categoryName
      amountBudgeted
      amountSpent
      color
      categoryType
      transactions {
        id
        amount
        date
        merchant
      }
      isCustom
    }
  }
`;

export const BUDGET_CATEGORIES = gql`
  query BudgetCategories {
    budgetCategories {
      id
      name
      budgetedAmount
      type
      color
    }
  }
`;

export const ADD_BUDGET_CATEGORY = gql`
  mutation AddBudgetCategory($name: String!, $budgetedAmount: Float!, $type: String!, $color: String!) {
    addBudgetCategory(name: $name, budgetedAmount: $budgetedAmount, type: $type, color: $color) {
      id
      name
      budgetedAmount
      type
      color
    }
  }
`;

export const RENAME_BUDGET_CATEGORY = gql`
  mutation RenameBudgetCategory($id: ID!, $newName: String!) {
    renameBudgetCategory(id: $id, newName: $newName) {
      id
      name
    }
  }
`;

export const CHANGE_CATEGORY_BUDGETED_AMOUNT = gql`
  mutation ChangeCategoryBudgetedAmount($id: ID!, $amount: Float!) {
    changeCategoryBudgetedAmount(id: $id, amount: $amount) {
      id
      budgetedAmount
    }
  }
`;

export const DELETE_BUDGET_CATEGORY = gql`
  mutation DeleteBudgetCategory($id: ID!) {
    deleteBudgetCategory(id: $id)
  }
`;

// Budget Hooks
export const useBudgetSummary = (startDate: string, endDate: string, includeTransactions: boolean = true) => {
  const { data, loading, error } = useQuery(BUDGET_SUMMARY, {
    client: apolloClient,
    variables: { startDate, endDate, includeTransactions },
  });
  return { summary: data?.budgetSummary, loading, error };
};

export const useBudgetCategories = () => {
  const { data, loading, error } = useQuery(BUDGET_CATEGORIES, { client: apolloClient });
  return { categories: data?.budgetCategories, loading, error };
};

export const useAddBudgetCategory = () => {
  const [addCategory, { loading, error }] = useMutation(ADD_BUDGET_CATEGORY, {
    client: apolloClient,
    update(cache, { data: { addBudgetCategory } }) {
      const existingCategories = cache.readQuery<{ budgetCategories: any[] }>({
        query: BUDGET_CATEGORIES,
      });
      if (existingCategories) {
        cache.writeQuery({
          query: BUDGET_CATEGORIES,
          data: {
            budgetCategories: [...existingCategories.budgetCategories, addBudgetCategory],
          },
        });
      }
    },
  });
  return { addCategory, loading, error };
};

export const useRenameBudgetCategory = () => {
  const [renameCategory, { loading, error }] = useMutation(RENAME_BUDGET_CATEGORY, {
    client: apolloClient,
    update(cache, { data: { renameBudgetCategory } }) {
      cache.modify({
        fields: {
          budgetCategories(existingCategories = []) {
            return existingCategories.map((category: any) =>
              category.id === renameBudgetCategory.id ? { ...category, name: renameBudgetCategory.name } : category
            );
          },
        },
      });
    },
  });
  return { renameCategory, loading, error };
};

export const useChangeCategoryBudgetedAmount = () => {
  const [changeBudgetedAmount, { loading, error }] = useMutation(CHANGE_CATEGORY_BUDGETED_AMOUNT, {
    client: apolloClient,
    update(cache, { data: { changeCategoryBudgetedAmount } }) {
      cache.modify({
        fields: {
          budgetCategories(existingCategories = []) {
            return existingCategories.map((category: any) =>
              category.id === changeCategoryBudgetedAmount.id
                ? { ...category, budgetedAmount: changeCategoryBudgetedAmount.budgetedAmount }
                : category
            );
          },
        },
      });
    },
  });
  return { changeBudgetedAmount, loading, error };
};

export const useDeleteBudgetCategory = () => {
  const [deleteCategory, { loading, error }] = useMutation(DELETE_BUDGET_CATEGORY, {
    client: apolloClient,
    update(cache, { data: { deleteBudgetCategory } }) {
      cache.modify({
        fields: {
          budgetCategories(existingCategories = [], { readField }) {
            return existingCategories.filter(
              (category: any) => readField('id', category) !== deleteBudgetCategory
            );
          },
        },
      });
    },
  });
  return { deleteCategory, loading, error };
};
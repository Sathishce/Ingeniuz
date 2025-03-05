// Re-export Apollo Client and utilities
export { apolloClient, setToken, setEmail, setUserName, removeToken } from "./ApolloClient";

// Re-export Authentication Hooks and Queries/Mutations
export {
  useUser,
  useLoginUser,
  useRegisterUser,
  useCompleteTwoFactor,
  useIsFirstUser,
  useUpdateFirstLogin,
  useUpdateUserFlag,
  GET_USER,
  LOGIN_USER,
  REGISTER_USER,
  COMPLETE_TWO_FACTOR,
  IS_FIRST_USER,
  UPDATE_FIRST_LOGIN,
  UPDATE_USER_FLAG,
} from "./AuthService";

// Re-export Budget Hooks and Queries/Mutations
export {
  useBudgetSummary,
  useBudgetCategories,
  useAddBudgetCategory,
  useRenameBudgetCategory,
  useChangeCategoryBudgetedAmount,
  useDeleteBudgetCategory,
  BUDGET_SUMMARY,
  BUDGET_CATEGORIES,
  ADD_BUDGET_CATEGORY,
  RENAME_BUDGET_CATEGORY,
  CHANGE_CATEGORY_BUDGETED_AMOUNT,
  DELETE_BUDGET_CATEGORY,
} from "./BudgetService";

// Re-export Transaction Hooks and Queries/Mutations
export {
  useTransactions,
  useChangeTransactionCategory,
  TRANSACTIONS,
  CHANGE_TRANSACTION_CATEGORY,
} from "./TransactionService";

// Re-export Savings Goal Hooks and Queries/Mutations
export {
  useSavingsGoals,
  useAddSavingsGoal,
  useRenameSavingsGoal,
  useDeleteSavingsGoal,
  SAVINGS_GOALS,
  ADD_SAVINGS_GOAL,
  RENAME_SAVINGS_GOAL,
  DELETE_SAVINGS_GOAL,
} from "./SavingsGoalService";

// Re-export User Profile Hooks and Queries/Mutations
export {
  useUpdateUserProfile,
  ADD_USER_PROFILE,
} from "./UserProfileService";
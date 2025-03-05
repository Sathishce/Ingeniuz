import { config } from 'dotenv';
import * as SecureStore from 'expo-secure-store';

// Load .env file
config();

export const env = {
  // GraphQL Endpoints from ApolloClient.js
  GRAPHQL_API_ENDPOINT_DEV: process.env.GRAPHQL_API_ENDPOINT_DEV || 'https://vkim4po36i.execute-api.amazonaws.com/',
  GRAPHQL_API_ENDPOINT_PROD: process.env.GRAPHQL_API_ENDPOINT_PROD || 'https://tmjlvem55h.execute-api.amazonaws.com/',
  APP_ENV: process.env.APP_ENV || 'development', // "development" or "production"
  APP_NAME: process.env.APP_NAME || 'InGeniuZ',
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'support@example.com',
  // Add more as needed
} as const;

// Get the active GraphQL endpoint based on APP_ENV
export const getGraphQLEndpoint = (): string => {
  return env.APP_ENV === 'production' ? env.GRAPHQL_API_ENDPOINT_PROD : env.GRAPHQL_API_ENDPOINT_DEV;
};

// Async methods for SecureStore (unchanged from previous)
export const getSecureEnv = async (key: string, defaultValue: string): Promise<string> => {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value || process.env[key] || defaultValue;
  } catch (error) {
    console.error(`Failed to get secure env "${key}":`, error);
    return process.env[key] || defaultValue;
  }
};

export const setSecureEnv = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error(`Failed to set secure env "${key}":`, error);
  }
};
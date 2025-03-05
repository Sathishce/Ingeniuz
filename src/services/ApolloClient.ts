import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { Log, LogLevel, createLog } from '../entities/Log';
import {  getGraphQLEndpoint } from '../config/env';
import { storageService } from './StorageService'; // Use singleton

const TEST_MODE = false;
const TEST_TOKEN = '';

const httpLink = new HttpLink({
  uri: getGraphQLEndpoint(),
});

const authLink = setContext(async (_, { headers }) => {
  const token = TEST_MODE ? TEST_TOKEN : await storageService.getItem<string>('authToken');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const logEntries: Log[] = [];
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      const log = createLog(LogLevel.ERROR, `GraphQL Error: ${message}`, undefined, { locations, path });
      logEntries.push(log);
      console.error(`[${log.level}] ${log.message}`, log.context);
    });
  }
  if (networkError) {
    const log = createLog(LogLevel.ERROR, `Network Error: ${networkError.message}`);
    logEntries.push(log);
    console.error(`[${log.level}] ${log.message}`);
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

/**
 * Stores the given token and email in local storage.
 * @param token The JWT token to store.
 * @param email The associated email address of the user.
 */
export async function setToken(token: string, email: string): Promise<void> {
  await storageService.setItem('authToken', token);
  await storageService.saveCurrentUserEmail(email);
  console.log('User email saved'); // Keep your original log
}

/**
 * Stores the given email address in local storage.
 * @param email The email address of the user.
 */
export async function setEmail(email: string): Promise<void> {
  await storageService.saveCurrentUserEmail(email);
  console.log('User email saved');
}

/**
 * Stores the given user name in local storage.
 * @param userName The user name to store.
 */

export async function setUserName(userName: string): Promise<void> {
  await storageService.saveCurrentUserName(userName);
}

/**
 * Removes the JWT token from local storage.
 */
export async function removeToken(): Promise<void> {
  await storageService.deleteItem('authToken');
}
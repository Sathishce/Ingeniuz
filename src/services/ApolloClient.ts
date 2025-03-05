import { ApolloClient, InMemoryCache, HttpLink,  from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';
import { Log, LogLevel, createLog } from '../entities/Log';
import {  getGraphQLEndpoint } from '../config/env';
import { saveCurrentUserEmail, saveCurrentUserName } from './StorageService';

const TEST_MODE = false;
const TEST_TOKEN = '';

const httpLink = new HttpLink({
  uri: getGraphQLEndpoint(),
});

const authLink = setContext(async (_, { headers }) => {
  const token = TEST_MODE ? TEST_TOKEN : await SecureStore.getItemAsync('authToken');
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

export async function setToken(token: string, email: string): Promise<void> {
  await SecureStore.setItemAsync('authToken', token);
  await setEmail(email);
}

export async function setEmail(email: string): Promise<void> {
  await saveCurrentUserEmail(email);
  console.log('User email saved');
}

export async function setUserName(userName: string): Promise<void> {
  await saveCurrentUserName(userName);
}

export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync('authToken');
}
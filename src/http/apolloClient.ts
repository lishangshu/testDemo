// lib/apolloClient.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import { ApolloLink } from '@apollo/client/link/core';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { toast } from 'react-toastify'
const httpLink = new HttpLink({
  // uri: 'http://47.115.60.170:8000/query', // 你的 GraphQL API 地址
  uri: 'http://49.51.193.219:8100/query', // 你的 GraphQL API 地址
  // uri: 'https://shambhala.finance/query', // 你的 GraphQL API 地址
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      // console.log('------',message)
      toast.error(message)
      // console.log(
      //   `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      // )
    );
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const clientconfig = new ApolloClient({
  link: ApolloLink.from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});

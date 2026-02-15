import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { API_URL } from '../config/constant';

const httpLink = createHttpLink({
    uri: API_URL,
    includeExtensions: false,
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        }
    };
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );

            // Handle authentication errors
            if (extensions?.code === 'UNAUTHENTICATED' || message.includes('Unauthorized')) {
                console.warn('Authentication error detected, clearing token');
                localStorage.removeItem('token');
                // Redirect to login if not already there
                if (!window.location.href.includes('/auth/login')) {
                    window.location.href = '/#/auth/login';
                }
            }

            // Handle forbidden errors
            if (extensions?.code === 'FORBIDDEN') {
                console.warn('Permission denied');
            }
        });
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError.message}`);
        
        // Handle network errors (e.g., server down)
        if ('statusCode' in networkError) {
            const statusCode = (networkError as { statusCode?: number }).statusCode;
            if (statusCode === 401) {
                localStorage.removeItem('token');
                if (!window.location.href.includes('/auth/login')) {
                    window.location.href = '/#/auth/login';
                }
            } else if (statusCode === 500) {
                console.error('Server error occurred');
            }
        }
    }
});

export const client = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});

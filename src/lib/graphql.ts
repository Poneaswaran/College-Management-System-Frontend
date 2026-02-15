import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError, ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
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
const errorLink = onError(({ error }: ErrorLink.ErrorHandlerOptions) => {
    // Handle GraphQL errors
    if (CombinedGraphQLErrors.is(error)) {
        error.errors.forEach((err) => {
            console.error(
                `[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`
            );

            // Handle authentication errors
            if (err.extensions?.code === 'UNAUTHENTICATED' || err.message.includes('Unauthorized')) {
                console.warn('Authentication error detected, clearing token');
                localStorage.removeItem('token');
                // Redirect to login if not already there
                if (!window.location.href.includes('/auth/login')) {
                    window.location.href = '/#/auth/login';
                }
            }

            // Handle forbidden errors
            if (err.extensions?.code === 'FORBIDDEN') {
                console.warn('Permission denied');
            }
        });
    } else {
        // Handle network errors
        console.error(`[Network error]: ${error}`);
        
        // Handle network errors (e.g., server down)
        if (error && typeof error === 'object' && 'statusCode' in error) {
            const statusCode = (error as { statusCode?: number }).statusCode;
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

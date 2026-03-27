import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError, ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { GRAPHQL_URL } from '../config/constant';

const httpLink = createHttpLink({
    uri: GRAPHQL_URL,
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
            const isAuthError = 
                err.extensions?.code === 'UNAUTHENTICATED' || 
                err.message.includes('Unauthorized') ||
                err.message.includes('Authentication required') ||
                err.message.includes('Please login');

            if (isAuthError) {
                console.warn('Authentication error detected, clearing token');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // Use a small delay to allow logs/state to update before redirect
                setTimeout(() => {
                    // Redirect to login if not already there
                    if (!window.location.href.includes('/auth/login')) {
                        window.location.href = '/#/auth/login';
                    }
                }, 100);
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
                localStorage.removeItem('user');
                setTimeout(() => {
                    if (!window.location.href.includes('/auth/login')) {
                        window.location.href = '/#/auth/login';
                    }
                }, 100);
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

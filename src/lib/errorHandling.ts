import type { ApolloError } from '@apollo/client';

export interface GraphQLErrorDetails {
    message: string;
    code?: string;
    statusCode?: number;
    isAuthError: boolean;
    isNetworkError: boolean;
    isForbidden: boolean;
}

/**
 * Parse Apollo GraphQL errors into a user-friendly format
 */
export const parseGraphQLError = (error: ApolloError | Error): GraphQLErrorDetails => {
    // Default error structure
    const errorDetails: GraphQLErrorDetails = {
        message: 'An unexpected error occurred',
        isAuthError: false,
        isNetworkError: false,
        isForbidden: false,
    };

    // Handle Apollo errors
    if ('graphQLErrors' in error && error.graphQLErrors?.length > 0) {
        const gqlError = error.graphQLErrors[0];
        errorDetails.message = gqlError.message;
        errorDetails.code = gqlError.extensions?.code as string;

        // Check for authentication errors
        if (
            errorDetails.code === 'UNAUTHENTICATED' ||
            gqlError.message.toLowerCase().includes('unauthorized') ||
            gqlError.message.toLowerCase().includes('not authenticated')
        ) {
            errorDetails.isAuthError = true;
            errorDetails.message = 'Your session has expired. Please login again.';
        }

        // Check for forbidden errors
        if (errorDetails.code === 'FORBIDDEN') {
            errorDetails.isForbidden = true;
            errorDetails.message = 'You do not have permission to perform this action.';
        }

        // Check for validation errors
        if (errorDetails.code === 'BAD_USER_INPUT' || errorDetails.code === 'VALIDATION_ERROR') {
            errorDetails.message = gqlError.message || 'Invalid input provided.';
        }
    }

    // Handle network errors
    if ('networkError' in error && error.networkError) {
        errorDetails.isNetworkError = true;
        const networkError = error.networkError as { statusCode?: number; message?: string };
        errorDetails.statusCode = networkError.statusCode;

        if (networkError.statusCode === 401) {
            errorDetails.isAuthError = true;
            errorDetails.message = 'Authentication failed. Please login again.';
        } else if (networkError.statusCode === 403) {
            errorDetails.isForbidden = true;
            errorDetails.message = 'Access denied.';
        } else if (networkError.statusCode === 500) {
            errorDetails.message = 'Server error. Please try again later.';
        } else if (networkError.statusCode === 503) {
            errorDetails.message = 'Service temporarily unavailable. Please try again later.';
        } else if (!navigator.onLine) {
            errorDetails.message = 'No internet connection. Please check your network.';
        } else {
            errorDetails.message = networkError.message || 'Network error occurred. Please try again.';
        }
    }

    // Fallback for generic errors
    if (!('graphQLErrors' in error) && !('networkError' in error)) {
        errorDetails.message = error.message || errorDetails.message;
    }

    return errorDetails;
};

/**
 * Get a user-friendly error message from any error type
 */
export const getErrorMessage = (error: unknown): string => {
    if (!error) return 'An unknown error occurred';

    if (typeof error === 'string') return error;

    if (error instanceof Error) {
        if ('graphQLErrors' in error || 'networkError' in error) {
            const details = parseGraphQLError(error as ApolloError);
            return details.message;
        }
        return error.message;
    }

    return 'An unexpected error occurred';
};

/**
 * Check if an error requires user logout
 */
export const shouldLogout = (error: ApolloError | Error): boolean => {
    if ('graphQLErrors' in error || 'networkError' in error) {
        const details = parseGraphQLError(error as ApolloError);
        return details.isAuthError;
    }
    return false;
};

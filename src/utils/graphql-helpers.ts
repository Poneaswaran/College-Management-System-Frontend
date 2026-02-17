/**
 * GraphQL Helper Functions
 * Utility functions for handling GraphQL variables and type conversions
 */

/**
 * Ensures a value is converted to an integer for GraphQL Int inputs.
 * Returns undefined if the value is null, undefined, or an empty string.
 * Returns the parsed integer if valid number.
 * Throws error if value is invalid number string (optional).
 * 
 * @param value The input value (string, number, null, or undefined)
 * @returns number or undefined
 */
export const ensureInt = (value: string | number | null | undefined): number | undefined => {
    if (value === null || value === undefined || value === '') {
        return undefined;
    }

    const num = typeof value === 'string' ? parseInt(value, 10) : value;

    if (isNaN(num)) {
        console.warn(`[ensureInt] Invalid integer value encountered: ${value}`);
        return undefined;
    }

    return num;
};

/**
 * Ensures a value is converted to a float/number for GraphQL inputs.
 * 
 * @param value The input value
 * @returns number or undefined
 */
export const ensureFloat = (value: string | number | null | undefined): number | undefined => {
    if (value === null || value === undefined || value === '') {
        return undefined;
    }

    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) {
        console.warn(`[ensureFloat] Invalid float value encountered: ${value}`);
        return undefined;
    }

    return num;
};

/**
 * Helper to ensure ID is passed correctly (as string or number depending on usage)
 * but usually GraphQL ID scalar accepts string or int.
 * However if we specifically need Int for an ID field (which is common in Django/Python backends using Int key),
 * use ensureInt.
 */

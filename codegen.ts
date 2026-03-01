import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: './schema.graphql',
    documents: [
        'src/**/*.{ts,tsx}',
        // Exclude files with pre-existing schema mismatches
        // TODO: Fix these queries to match the current backend schema, then re-include
        '!src/features/exams/**',
        '!src/features/assignments/graphql/**',
        '!src/features/attendance/graphql/**',
        '!src/features/students/graphql/attendance.ts',
    ],
    generates: {
        'src/generated/graphql.ts': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-react-apollo',
            ],
            config: {
                withHooks: true,
                withHOC: false,
                withComponent: false,
                skipTypename: false,
                enumsAsTypes: true,
                scalars: {
                    DateTime: 'string',
                    Date: 'string',
                    Decimal: 'string',
                    JSON: 'Record<string, unknown>',
                    Time: 'string',
                    Upload: 'File',
                },
            },
        },
    },
    ignoreNoDocuments: false,
};

export default config;

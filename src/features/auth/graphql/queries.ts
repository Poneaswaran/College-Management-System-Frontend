import { gql } from 'graphql-tag';

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      registerNumber
      role {
        id
        name
        code
      }
      department {
        id
        name
        code
      }
    }
  }
`;

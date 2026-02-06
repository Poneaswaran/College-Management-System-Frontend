import { gql } from '@apollo/client';
import { client } from '../../lib/graphql';
import api from '../../services/api';
import type { User } from './types';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(
      data: {
        username: $username
        password: $password
      }
    ) {
      accessToken
      refreshToken
      message
      user {
        id
        email
        registerNumber
        role {
          code
        }
      }
    }
  }
`;

export const login = async (credentials: any) => {
    const { data } = await client.mutate({
        mutation: LOGIN_MUTATION,
        variables: {
            username: credentials.username,
            password: credentials.password,
        },
    });

    return {
        data: {
            user: data.login.user,
            token: data.login.accessToken,
        }
    };
};
export const register = (data: any) => api.post<{ user: User, token: string }>('/auth/register', data);

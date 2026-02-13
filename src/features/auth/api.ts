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

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  login: {
    accessToken: string;
    refreshToken: string;
    message: string;
    user: User;
  };
}

export const login = async (credentials: LoginCredentials) => {
  const { data } = await client.mutate<LoginResponse>({
    mutation: LOGIN_MUTATION,
    variables: {
      username: credentials.username,
      password: credentials.password,
    },
  });

  if (!data) {
    throw new Error('No data returned from login mutation');
  }

  return {
    data: {
      user: data.login.user,
      token: data.login.accessToken,
    }
  };
};

const LOGOUT_MUTATION = gql`
  mutation Logout($accessToken: String!) {
    logout(accessToken: $accessToken) {
      success
      message
    }
  }
`;

interface LogoutResponse {
  logout: {
    success: boolean;
    message: string;
  };
}

export const logout = async (accessToken: string) => {
  const { data } = await client.mutate<LogoutResponse>({
    mutation: LOGOUT_MUTATION,
    variables: {
      accessToken,
    },
  });

  if (!data) {
    throw new Error('No data returned from logout mutation');
  }

  return data.logout;
};

interface RegisterData {
  email: string;
  password: string;
  registerNumber: string;
  [key: string]: string;
}

export const register = (data: RegisterData) => api.post<{ user: User, token: string }>('/auth/register', data);

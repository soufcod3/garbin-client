import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($data: UserInput!) {
    createUser(data: $data) {
      id
    }
  }
`;

export const LOGIN = gql`
  mutation Login($data: UserInput!) {
    login(data: $data)
  }
`;

export const GET_LOGGED_USER = gql`
  query LoggedUser {
    loggedUser {
      id
      email
      username
      password
      role
    }
  }
`;
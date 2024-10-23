import { gql } from "@apollo/client";

export const GET_LOGGED_USER = gql`
  query LoggedUser {
    loggedUser {
      id
      email
      username
    }
  }
`;

export const GET_GARMENTS = gql`
  query Garments {
    garments {
      id
      name
      brand
      colors
      category
      outfitIds
      imageUrl
    }
  }
`;

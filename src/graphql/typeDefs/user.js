import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    authUserProfile: User! @isAuth
    authenticateUser(username: String!, password: String!): AuthResp!
  }

  extend type Mutation {
    registerUser(newUser: UserInput!): AuthResp!
  }

  input UserInput {
    avatarImage: String
    username: String!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
  }

  type User {
    avatarImage: String
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    id: ID!
  }

  type AuthResp {
    user: User!
    token: String!
  }
`;

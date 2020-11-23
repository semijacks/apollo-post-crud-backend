import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getAllPosts: [Post!]!
    getPostById(id: ID!): Post!
  }

  extend type Mutation {
    createNewPost(newPost: PostInput!): Post! @isAuth
    deletePostById(id: ID!): PostNotification! @isAuth
    editPostById(updatedPost: PostInput, id: ID!): Post! @isAuth
  }

  input PostInput {
    title: String!
    content: String!
    featuredImage: String
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String
    updatedAt: String
    featuredImage: String
    author: User!
  }

  type PostNotification {
    id: ID!
    message: String!
    success: Boolean
  }
`;

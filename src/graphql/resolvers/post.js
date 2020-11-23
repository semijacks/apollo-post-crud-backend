import post from "../typeDefs/post";
import { ApolloError } from "apollo-server-express";
import {
  newPostValidationRules,
  editPostValidationRules,
} from "../../validators";

export default {
  Query: {
    getAllPosts: async (_, {}, { Post }) => {
      let posts = await Post.find().populate("author");
      return posts;
    },
    getPostById: async (_, { id }, { Post }) => {
      try {
        let post = await Post.findById(id);
        if (!post) {
          throw new Error("Post not found");
        }
        await post.populate("author").execPopulate();
        return post;
      } catch (err) {
        throw new ApolloError(err.message);
      }
    },
  },
  Mutation: {
    createNewPost: async (_, { newPost }, { Post, user }) => {
      await newPostValidationRules.validate(newPost, { abortEarly: false });
      let result = await Post.create({ ...newPost, author: user._id });
      await result.populate("author").execPopulate();
      return result;
    },
    editPostById: async (_, { id, updatedPost }, { Post, user }) => {
      await editPostValidationRules.validate(updatedPost, {
        abortEarly: false,
      });
      try {
        let editedPost = await Post.findOneAndUpdate(
          { _id: id, author: user.id.toString() },
          {
            ...updatedPost,
          },
          {
            new: true,
          }
        );

        if (!editedPost) {
          throw new Error("Unable to edit post");
        }

        return editedPost;
      } catch (err) {
        throw new ApolloError(err.message, 400);
      }
    },
    deletePostById: async (_, { id }, { Post, user }) => {
      try {
        let deletedPost = await Post.findOneAndDelete({
          _id: id,
          author: user.id.toString(),
        });

        if (!deletedPost) {
          throw new Error("Unable to delete post");
        }

        return {
          success: true,
          id: deletedPost.id,
          message: "Your post has been successfully deleted.",
        };
      } catch (err) {
        throw new ApolloError(err.message, 400);
      }
    },
  },
};

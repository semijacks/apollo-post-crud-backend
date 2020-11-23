import { ApolloError } from "apollo-server-express";
import { hash, compare } from "bcryptjs";
import { issueToken, serializeUser } from "../../functions";
import {
  UserRegistrationRules,
  UserAuthenticationRules,
} from "../../validators";

export default {
  Query: {
    authUserProfile: async (_, {}, { user }) => user,
    authenticateUser: async (_, { username, password }, { User }) => {
      await UserAuthenticationRules.validate(
        { username, password },
        { abortEarly: false }
      );
      try {
        //find user by username
        let user = await User.findOne({ username });
        if (!user) {
          throw new ApolloError("username not found.");
        }
        //check for the password
        let isMatch = await compare(password, user.password);
        if (!isMatch) {
          throw new ApolloError("Invalid password.");
        }
        //Serialize user
        user = user.toObject();
        user.id = user._id;
        user = serializeUser(user);

        //issue authentication token
        let token = await issueToken(user);
        return {
          user,
          token,
        };
      } catch (err) {
        throw new ApolloError(err.message, 403);
      }
    },
  },
  Mutation: {
    registerUser: async (_, { newUser }, { User }) => {
      await UserRegistrationRules.validate(newUser, { abortEarly: false });
      try {
        let { username, email } = newUser;
        //First check if the username is already taken
        let user;
        user = await User.findOne({ username });
        if (user) {
          throw new ApolloError("Username is already taken");
        }
        //check if the email is already taken
        user = await User.findOne({ email });
        if (user) {
          throw new ApolloError("Email is already registered");
        }
        //create new user instance
        user = new User(newUser);
        //hash the password
        user.password = await hash(newUser.password, 10);
        //save the user to the database
        let result = await user.save();
        result = result.toObject();
        result.id = result._id;
        result = serializeUser(result);
        //issue the authentication token
        let token = issueToken(result);
        return {
          token,
          user: result,
        };
      } catch (err) {
        throw new ApolloError(err.message, 400);
      }
    },
  },
};

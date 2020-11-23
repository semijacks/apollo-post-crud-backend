import { error, success } from "consola";
import { join } from "path";
import { ApolloServer } from "apollo-server-express";
import { DB, port, IN_PROD } from "./config";
import { typeDefs, resolvers } from "./graphql";
import { schemaDirectives } from "./graphql/directives";
import AuthMiddleware from "./middlewares/auth";
import * as AppModels from "./models";

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

//initialize the express application
const app = express();
app.use(AuthMiddleware);
app.use(bodyParser.json());
app.use(express.static(join(__dirname, "./uploads")));

app.get("/posts", async (req, res) => {
  let { Post } = AppModels;

  let { page, limit } = req.query;

  const myCustomLabels = {
    totalDocs: "postCount",
    docs: "posts",
    limit: "perPage",
    page: "currentPage",
    nextPage: "next",
    prevPage: "prev",
    totalPages: "pageCount",
    pagingCounter: "slNo",
    meta: "paginator",
  };

  const options = {
    page: page || 1,
    limit: limit || 10,
    customLabels: myCustomLabels,
  };

  let posts = await Post.paginate({}, options);
  return res.send(posts);
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  playground: IN_PROD,
  context: ({ req }) => {
    let { isAuth, user } = req;
    return {
      req,
      isAuth,
      user,
      ...AppModels,
    };
  },
});

const startApp = async () => {
  try {
    //connect to mongodb database
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    success({
      message: `successfully connected with database`,
      badge: true,
    });

    //Inject ApolloServer
    server.applyMiddleware({
      app,
    });
    app.listen(port, () =>
      success({
        badge: true,
        message: `server started on port ${port}`,
      })
    );
  } catch (err) {
    error({
      message: err.message,
      badge: true,
    });
  }
};

startApp();

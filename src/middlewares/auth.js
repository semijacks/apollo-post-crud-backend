import { SECRET } from "../config";
import { verify } from "jsonwebtoken";
import { User } from "../models";

const AuthMiddleware = async (req, res, next) => {
  const authHeaders = req.get("Authorization");
  if (!authHeaders) {
    req.isAuth = false;
    return next();
  }
  //extract that token
  let token = authHeaders.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  //Decode token using verify
  let decodedToken;
  try {
    decodedToken = verify(token, SECRET);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  //find user in database
  let authUser = await User.findById(decodedToken.id);
  if (!authUser) {
    req.isAuth = false;
    return next();
  }

  //set req user to the fetched user
  req.user = authUser;
  req.isAuth = true;
  return next();
};

export default AuthMiddleware;

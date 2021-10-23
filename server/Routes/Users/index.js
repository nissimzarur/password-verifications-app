var express = require("express");
const passwordComplexity = require("joi-password-complexity");
const { v4: uuidv4 } = require("uuid");
const { uniqueNamesGenerator, names } = require("unique-names-generator");
const NodeCache = require("node-cache");

var UsersRouter = express.Router();
const usersCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

UsersRouter.post("/saveUserPassword", (req, res) => {
  if (!req.body)
    return res.json({ success: false, errMsg: "No params received." });

  //   var pass = JSON.parse(req.body);
  const f_pass = req.body.first;
  const s_pass = req.body.second;

  if (!f_pass || !s_pass)
    return res.json({ success: false, errMsg: "Missing required params." });

  const passIsStrong = checkIfPasswordIsStrong(f_pass);

  if (!passIsStrong)
    return res.json({ success: false, errMsg: "Password is not strong." });

  if (f_pass != s_pass)
    return res.json({ success: false, errMsg: "Passwords not match." });

  let user = new User(f_pass);
  if (!usersCache.get(user.id)) usersCache.set(user.id, user);

  res.json({ success: true, user: user });
});

const checkIfPasswordIsStrong = (password) => {
  const complexityOptions = {
    min: 5,
    max: 12,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
  };

  const { error } = passwordComplexity(complexityOptions).validate(password);

  if (error) return false;
  return true;
};

class User {
  constructor(password) {
    this.id = uuidv4();
    this.username = uniqueNamesGenerator({
      dictionaries: [names, names],
      length: 2,
    });
    this.password = password;
  }
}

module.exports = UsersRouter;

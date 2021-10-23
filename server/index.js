require("dotenv").config();

// Libraries.
const express = require("express");

const cors = require("cors");

// Routes.
const UsersRouter = require("./Routes/Users");

//App.
const app = express();
app.use(express.json());

const PORT = process.env.PORT ? process.env.PORT : 4000;

app.use(cors());

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

app.use("/users", UsersRouter);

app.get("/", (req, res) => {
  return res.send("OK");
});

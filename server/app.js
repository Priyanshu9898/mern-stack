const express = require("express");
const dotenv = require("dotenv");

const app = express();

dotenv.config({ path: "./config.env" });
require("./DB/conn");

const port = process.env.PORT;

app.use(express.json());
// We link router files to make our route
app.use(require("./router/auth"));

// Middleware
const middleware = (req, res, next) => {
  console.log("Hello My Middleware");
  next();
};

app.get("/", (req, res) => {
  res.send("Hello world from backend!");
});

app.get("/about", middleware, (req, res) => {
  res.send(" about page from backend!");
});
app.get("/contact", (req, res) => {
  res.send(" contact page from backend!");
});
app.get("/login", (req, res) => {
  res.send(" login page from backend!");
});
app.get("/signup", (req, res) => {
  res.send(" signup page from backend!");
});

app.listen(port, () => {
  console.log(`Server is running on ${`http://localhost:${port}/`} `);
});

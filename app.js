const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bodyParser = require('body-parser')
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors")

const routes = require('./api/')

const app = express();

dotenv.config();

const PORT = process.env.PORT || 4001;
const DB_URI = process.env.DBURI;

const store = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: "sessions",
});
app.use(cors());
app.use(
  session({
    httpOnly: false,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store,
    isLoggedIn: false,
  })
);

app.use(bodyParser.json())

routes.startApp(app)

// db start
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(chalk.green("DB Running"));
  })
  .catch((error) => {
    console.log(chalk.red(`DB Connection failed ${error}`));
  });

app.listen(PORT);

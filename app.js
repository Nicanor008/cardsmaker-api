const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const multer = require("multer");
const passport = require("passport");

const path = require("path");

const routes = require("./api/");

const passportSetup = require("./api/users/passport");

const app = express();

dotenv.config();

const PORT = process.env.PORT || 4000;
const DB_URI = process.env.DBURI;

const store = new MongoDBStore({
  uri: DB_URI,
  collection: "sessions",
});
app.use(cors());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store,
    isLoggedIn: false,
  })
);

app.use(bodyParser.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

routes.startApp(app);

// db start
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

mongoose.connection.on("error", (err) => {
  console.log(`failed connect to MongoDB ${err}`);
});

app.listen(PORT);

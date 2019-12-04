let express = require("express");
let mongoose = require("mongoose");
let cors = require("cors");

// Need this to extract the body portion / useable portion of a request stream and put it on req.body
// this makes it easier ot interface.
let bodyParser = require("body-parser");
let dbConfig = require("./database/db");

// Express Route, connect with express
const studentRoute = require("../backend/routes/student.route");

// Connecting mongoDB DatabaseF
mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.db, {
    useNewUrlParser: true
  })
  .then(
    () => {
      console.log("Database sucessfully connected!");
    },
    error => {
      console.log("Could not connect to database : " + error);
    }
  );

const app = express();
// support parsing of the application/json type post data
app.use(bodyParser.json());

// support parsing of application/w-www-form-rurlencoded post data
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());
app.use("/students", studentRoute);

// PORT
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log("Connected to port " + port);
});

// 404 Error
app.use((req, res, next) => {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

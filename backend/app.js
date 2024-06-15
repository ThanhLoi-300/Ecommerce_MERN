const express = require("express");
const ErrorHandler = require("./middleware/errors");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require('./routes/index')

app.use(cors({
  origin: ['https://ecommerce-mern-frontend-fv9k.onrender.com', 'http://localhost:5173'], //
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// // config
// if (process.env.NODE_ENV !== "PRODUCTION") {
//   require("dotenv").config({
//     path: "config/.env",
//   });
// }

// // import routes
routes(app)

// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;
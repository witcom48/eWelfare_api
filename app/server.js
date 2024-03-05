const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
//const morgan = require('morgan');
const xss = require('xss-clean');
const moment = require('moment-timezone');
const helmet = require('helmet');
const router = express.Router()
const app = express();

const user = require('./routes/user.routes')
const benefit = require('./routes/benefit.routes')
const hostran = require('./routes/hostran.routes')


//-- Config
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(xss());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
moment.tz.setDefault('Asia/Bangkok')

// Route for home page
app.get("/home", (req, res) => {
  res.json({ message: "!! RANDOM API" });
});

// setting port to 3000, & listening for requests http request.
app.listen(4000, () => {
  console.log("Server is running on port 4000.");
});

app.use(user)
app.use(benefit)
app.use(hostran)


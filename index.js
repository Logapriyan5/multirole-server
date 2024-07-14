const express = require("express");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const productRoute = require("./routes/productroute");
const userroute = require("./routes/useroute");
const authroute = require("./routes/authroute");
const app = express();
const PORT = process.env.PORT || 8080;

const dbDetail = process.env.DB_DETAIL;
const pgSession = require('connect-pg-simple')(session);

app.use(cors({
   origin: process.env.CLIENT_SITE_PORT,
   methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
   allowedHeaders: ['Content-Type', 'Authorization'],
   credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
   store: new pgSession({
      conString: dbDetail,
      tableName: 'session',
   }),
   secret: process.env.SESS_SECRET,
   resave: false,
   saveUninitialized: false,
   cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false, // Set to false since your backend is not on HTTPS
      httpOnly: true,
      sameSite: 'none'
   }
}));

app.options('*', cors());

app.get("/", (req, res) => {
   res.json("hello world");
});

app.use(productRoute);
app.use(userroute);
app.use(authroute);

app.listen(PORT, () => {
   console.log("Server is running...");
});

const express = require("express");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const productroute = require("./routes/productroute");
const userroute = require("./routes/userroute");
const authRoute = require("./routes/authRoute");
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
   saveUninitialized: true,
   cookie: {
      maxAge: 1000 * 60 * 60,
      secure: true, 
      httpOnly: true,
      sameSite: 'none'
   }
}));

app.options('*', cors());

app.get("/", (req, res) => {
   res.json("hello world");
});

app.use(productroute);
app.use(userroute);
app.use(authRoute);

app.listen(PORT, () => {
   console.log("Server is running...");
});

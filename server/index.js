const express = require("express");
const session = require("express-session");
const passport = require("passport");
const { Strategy } = require("./utilities/local-strategy");
const cron = require("node-cron");
const deleteUnconfirmedUsers = require("./utilities/deleteUnconfirmedUsers");
const updateTrendingTags = require("./utilities/updateTrendingTags");
const MySQLStore = require("express-mysql-session")(session);
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

const db = require("./models");

// Set dbConfig based on JAWSDB_URL or local db config
const dbConfig = process.env.JAWSDB_URL
  ? (() => {
      const url = new URL(process.env.JAWSDB_URL);
      return {
        host: url.hostname,
        port: url.port || 3306,
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1),
      };
    })()
  : {
      host: db.sequelize.config.host,
      port: db.sequelize.config.port || 3306,
      user: db.sequelize.config.username,
      password: db.sequelize.config.password,
      database: db.sequelize.config.database,
    };

console.log(dbConfig);

const sessionStore = new MySQLStore({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user || dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
});

// Configure session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    store: sessionStore,
    resave: false,
    cookie: {
      maxAge: 3600000,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
      httpOnly: true,
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.CLIENT_URL
          : "localhost",
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Delete unconfirmed users and update trending tags every hour
cron.schedule("0 * * * *", () => {
  console.log("Running scheduled tasks...");
  deleteUnconfirmedUsers();
  updateTrendingTags();
});

// Routers
app.use("/users", require("./routes/Users"));
app.use("/posts", require("./routes/Posts"));
app.use("/comments", require("./routes/Comments"));
app.use("/boards", require("./routes/Boards"));
app.use("/tags", require("./routes/Tags"));

// Serve static files from the React app
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

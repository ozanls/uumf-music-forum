const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Strategy } = require('./utilities/local-strategy');
const cron = require('node-cron');
const deleteUnconfirmedUsers = require('./utilities/deleteUnconfirmedUsers');
const updateTrendingTags = require('./utilities/updateTrendingTags');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;
app.use(express.json());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

const db = require('./models')

const dbOptions = {
    host: db.sequelize.config.host,
    port: db.sequelize.config.port || 3306,
    user: db.sequelize.config.username,
    password: db.sequelize.config.password,
    database: db.sequelize.config.database
};

const sessionStore = new MySQLStore(dbOptions);

// Configure session
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    store: sessionStore,
    resave: false,
    cookie: {
        maxAge: 3600000,
        sameSite: 'None'
    }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Delete unconfirmed users and update trending tags every hour
cron.schedule('0 * * * *', () => {
    console.log('Running scheduled tasks...');
    deleteUnconfirmedUsers();
    updateTrendingTags(); 
});

// Routers

    // Users router
    const userRouter = require('./routes/Users');
    app.use('/users', userRouter);

    // Posts router
    const postRouter = require('./routes/Posts');
    app.use('/posts', postRouter);

    // Comments router
    const commentRouter = require('./routes/Comments');
    app.use('/comments', commentRouter);
 
    // Boards router
    const boardRouter = require('./routes/Boards');
    app.use('/boards', boardRouter);

    // Tags router
    const tagRouter = require('./routes/Tags');
    app.use('/tags', tagRouter);

db.sequelize.sync().then(() => {

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })

});


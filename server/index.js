const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Strategy } = require('./strategies/local-strategy');
const MySQLStore = require('express-mysql-session')(session);

const app = express();
const port = 3001;
app.use(express.json());

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
    secret: 'UUMF-fAhcblQRqTkD',
    saveUninitialized: true,
    store: sessionStore,
    resave: false,
    cookie: {
        maxAge: 3600000
    }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

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


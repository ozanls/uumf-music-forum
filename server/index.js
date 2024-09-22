const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

const db = require('./models')

// Routers

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


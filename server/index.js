const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

const db = require('./models')

// Routers
const postRouter = require('./routes/Posts');
app.use('/posts', postRouter);

db.sequelize.sync().then(() => {

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })

});


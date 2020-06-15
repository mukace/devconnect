const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 1000;

const usersRouter = require('./routes/api/userAuth');
const postsRouter = require('./routes/api/posts');
const profileRouter = require('./routes/api/profile');


// Body Parser middleware
app.use(express.json());

// cors middleware
app.use(cors({ origin: 'http://localhost:3000' }));

// DB config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
// mongoose
//     .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
//     .then(() => console.log('MongoDB Connected'))
//     .catch(error => console.log(error));


// Connect to MongoDB
const connectDB = (async () => {
    try {
        await mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true });

        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
})();

// Use Routes
app.use('/api/users', usersRouter);
app.use('/api/profile', profileRouter);
app.use('/api/posts', postsRouter);

app.get('/', (req, res) => res.send('hello'));



app.listen(PORT, () => console.log(`server running on port ${PORT}`));
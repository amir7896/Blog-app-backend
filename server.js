const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();

// ===============
// Routes
// ===============

const authRoute = require('./routes/auth');
const BlogRoute = require('./routes/blogs');

// =====================
// Data Base Connection
// ====================
mongoose.connect('mongodb://localhost:27017/BlogApp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Data Base Connected Successfully!');
});

// =======================
// Session Configuration
// =======================
const sessionConfig = {
    secret: "Thisinnotagoodsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expired: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.use(session(sessionConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:4200' }));


// ======================
// Use Of Routes
// =====================
app.use('/', authRoute);
app.use('/blogs', BlogRoute)

app.get('/', (req,res) => {
    res.send('Welcome To The Blog App')
})


app.listen(3000, () => {
    console.log('Server Start On Port 3000')
})
const express = require('express');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 3000;

// Configure middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// const RedisStore = connectRedis(session)



const redisClient = redis.createClient({
    host: 'localhost', // Replace with your Redis server's host
    port: 6379,        // Replace with your Redis server's port
});

// redisClient.connect();

app.use(
    session({
        secret: 'secet_for_login_#80',
        resave: true,
        saveUninitialized: true,
        store: new RedisStore({ client: redisClient }),
        cookie: { secure: false },
    })
);

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

// In-memory user database (replace with a database in a real application)
const users = [
    {
        username: 'user',
        password: 'password',
    },
];

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    console.log(req.session)
    if (req.session.isAuthenticated) {
        next();
    } else {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
            res.redirect('/login');
        });
    }
}

// app.use(isAuthenticated);

// Routes

// Home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Login page
app.get('/login', (req, res) => {
    console.log("login")
    res.sendFile(__dirname + '/views/login.html');
});

// Handle login form submission
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user by username
    const user = users.find((u) => u.username == username && u.password == password);
    console.log(user)
    if (!user) {
        // Invalid credentials
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
            }
            res.redirect('/login');
        });
    } else {
        // Authentication successful
        
        req.session.isAuthenticated = true;
        res.redirect('/dashboard');
    }
});

// Dashboard page (requires authentication)
app.get('/dashboard',isAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/views/dashboard.html');
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
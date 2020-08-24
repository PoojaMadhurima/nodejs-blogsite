const path=require('path');
const express = require('express');
const app = new express();
app.use(express.static('public'));
const expressEdge = require('express-edge');
app.use(expressEdge.engine);
app.set('views', __dirname + '/views');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
const fileUpload = require("express-fileupload");
app.use(fileUpload());
const storePost = require('./middleware/storePost')
app.use('/posts/store', storePost)
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const mongoStore = connectMongo(expressSession);
app.use(expressSession({
    secret: 'secret', saveUninitialized: true, resave: true}));
const auth = require("./middleware/auth");
const connectFlash = require("connect-flash");
app.use(connectFlash());
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')
const edge = require("edge.js");

const homeController = require('./controllers/home');
const getPostController = require('./controllers/getPost');
const createPostController = require('./controllers/createPost');
const storePostController = require('./controllers/storePost');
const createUserController = require('./controllers/createUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require('./controllers/logout');
const aboutController = require('./controllers/about');
const contactController = require("./controllers/contact");

mongoose.connect('mongodb://localhost:27017/nodejs-blog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))

app.get("/", homeController);
app.get("/post/:id", getPostController);
app.get("/posts/new", auth, createPostController);
app.post("/posts/store", auth, storePostController);
app.get("/auth/login", redirectIfAuthenticated, loginController);
app.post("/users/login", redirectIfAuthenticated, loginUserController);
app.get("/auth/register", redirectIfAuthenticated, createUserController);
app.post("/users/register", redirectIfAuthenticated, storeUserController);
app.get("/auth/logout", redirectIfAuthenticated, logoutController);
app.get("/about", aboutController);
app.get("/contact", contactController);

app.use('*', (req, res, next) => {
    edge.global('auth', req.session.userId)
    next()
});

app.listen(4000, '127.0.0.1', () => {
    console.log('App listening on port 4000')
});

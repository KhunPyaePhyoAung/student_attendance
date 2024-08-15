const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const instructorRouter = require('./router/InstructorRouter');
const viewRouter = require('./router/ViewRouter');
const authRouter = require('./router/AuthRouter');

app.use(express.json());
app.use(express.static(__dirname + '/resource/static'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());

app.use(
    '/api/instructors',
    instructorRouter
);

app.use(
    ['/', '/home'],
    viewRouter
);

app.use(
    ['/api/auth'],
    authRouter
);

module.exports = app;
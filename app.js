const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const instructorRouter = require('./router/InstructorRouter');
const viewRouter = require('./router/ViewRouter');
const homeHtmlPath = path.join(__dirname, 'resource', 'view', 'home.html');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());
app.use

app.use(
    '/api/instructors',
    instructorRouter
);

app.use(
    ['/', '/home'],
    viewRouter
);

module.exports = app;
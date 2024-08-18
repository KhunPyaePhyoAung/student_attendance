const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const userRouter = require('./router/UserRouter');
const studentRouter = require('./router/StudentRouter');
const instructorRouter = require('./router/InstructorRouter');
const subjectRouter = require('./router/SubjectRouter');
const termRouter = require('./router/TermRouter');
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
    '/api/users',
    userRouter
);

app.use(
    '/api/students',
    studentRouter
);

app.use(
    '/api/instructors',
    instructorRouter
);

app.use(
    '/api/subjects',
    subjectRouter
);

app.use(
    '/api/terms',
    termRouter
);

app.use(viewRouter);

app.use(
    ['/api/auth'],
    authRouter
);

module.exports = app;
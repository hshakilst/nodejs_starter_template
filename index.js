const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const expressSession = require('express-session');
const morgan = require('morgan');
const winston = require('./modules/winston');
const mongoose = require('mongoose');
const passport = require('passport');
// const passport_jwt = require('passport-jwt');
// const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();


app.use(morgan('combined', {
    stream: winston.stream
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))
);
require('./modules/passport')(passport);
app.use(express.static('public'));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === 'DEVELOPMENT' ? err : {};

    // add this line to include winston logging
    winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    // render the error page
    res.status(err.status || 500);
    res.render('Internal server error!');
});


app.listen(process.env.PORT, function () {
    console.log('Listening on port ' + process.env.PORT + '...');
});

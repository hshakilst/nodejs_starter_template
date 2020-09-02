const express = require('express');
const router = express.Router();
const appRoot = require('app-root-path');
const User = require(appRoot + '/models/user');

apiRoutes.post('/authenticate', function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.send({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else {
            // Check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // Create token if the password matched and no error was thrown
                    var claims = {
                        sub: user._id,
                        email: user.email,
                        permissions: user.role
                    };
                    var token = jwt.sign(claims, process.env.SECRET, {
                        expiresIn: 86400 // in seconds
                    });
                    res.cookie('jwt', token);
                    res.json({
                        success: true,
                        token: 'JWT ' + token
                    });
                } else {
                    res.send({
                        success: false,
                        message: 'Authentication failed. Passwords did not match.'
                    });
                }
            });
        }
    });
});
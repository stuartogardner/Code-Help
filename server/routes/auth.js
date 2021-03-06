const express = require('express');
const jwt = require('jwt-simple');
const router = express.Router();
const User = require('../models/user');
const config = require('../config');



// sign up route
router.post('/signup', (req, res, next) => {
    const {
        username,
        name,
        password
    } = req.body;

    const user = new User({
        username,
        name,
    });

    User.register(user, password, err => {
        if (err) next(err);
        res.json({
            success: true
        });
    });
});

// log in route

const authenticate = User.authenticate()

router.post('/login', (req, res, next) => {
    const {
        username,
        password
    } = req.body;
    if (username && password) {
        authenticate(username, password, (err, user, failed) => {
            if (err) {
                return next(err)
            }
            if (failed) {
                return res.status(401).json({
                    error: failed.message
                });
            }
            if (user) {
                const payload = {
                    id: user.id,
                };
                const token = jwt.encode(payload, config.jwtSecret)
                res.json({
                    user: {
                        name: user.name,
                        username: user.username,
                        _id: user._id
                    },
                    token,
                });
            }
        });
    } else {
        res.sendStatus(401)
    }
});

module.exports = router;
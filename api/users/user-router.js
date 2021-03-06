const router = require('express').Router();
const Users = require('./user-model');
const { restricted } = require("../auth/auth-middleware.js");

router.get('/', restricted, async (req, res, next) => {
    try {
        const users = await Users.getAll();
        res.status(200).json(users);
    }
    catch (err) {
        next(err)
    }
})

router.get('/:user_id', restricted, async (req, res, next) => {
    try {
        res.status(200).json({ message: '[GET] Get a user with an id' })
    }
    catch (err) {
        next(err)
    }
})

module.exports = router;
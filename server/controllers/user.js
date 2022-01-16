const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.updateProfile = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 12);
    }

    User.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        { new: true }
    )
        .then((user) => {
            if (!user) {
                const error = new Error('User not found.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'User updated.',
                user: user,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteUser = (req, res, next) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(200).json('User has been deleted.');
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

//get single user
exports.getUser = (req, res, next) => {
    User.findById(req.params.id)
        .then((user) => {
            if (!user) {
                const error = new Error('User not found.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: 'User fetched.',
                user: user,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

// get all users
exports.getAllUsers = (req, res, next) => {
    const query = req.query.new;
    const findUsers = query
        ? User.find().sort({ _id: -1 }).limit(5)
        : User.find();
    findUsers
        .then((users) => {
            res.status(200).json({
                message: 'Users fetched.',
                users: users,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

// get user stats
exports.getUserStats = (req, res, next) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    User.aggregate([
        {
            $match: { createdAt: { $gte: lastYear } },
        },
        {
            $project: {
                month: { $month: '$createdAt' },
            },
        },
        {
            $group: {
                _id: '$month',
                total: { $sum: 1 },
            },
        },
    ])
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
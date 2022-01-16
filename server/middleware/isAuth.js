const jwt = require('jsonwebtoken');

const isValidToken = (req, res, next) => {
    const authHeader = req.headers.token || req.get('Authorization');

    if (!authHeader) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SEC);
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }

    if (!decodedToken) {
        const error = new Error('Token is invalid');
        error.statusCode = 401;
        throw error;
    }
    req.user = {
        userId: decodedToken.userId,
        isAdmin: decodedToken.isAdmin,
    };
    next();
};

const isAuth = (req, res, next) => {
    isValidToken(req, res, () => {
        if (req.user.userId === req.params.id || req.user.isAdmin) {
            next();
        } else {
            const error = new Error('You are not allowed to do that!');
            error.statusCode = 403;
            next(error);
        }
    });
};

const verifyAdmin = (req, res, next) => {
    isValidToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            const error = new Error(
                'You are not allowed to do that as you are not admin!'
            );
            error.statusCode = 403;
            next(error);
        }
    });
};

module.exports = {
    isValidToken,
    isAuth,
    verifyAdmin,
};
require('dotenv').config();
const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const verifyUserToken = (req, res, next) => {
    let token = req.headers.authorization;

    try {
        if (token) {
            token = token.split(' ');
            if (token[0] === 'Bearer') {
                const decoded = jwt.verify(token[1], ACCESS_TOKEN_SECRET);
                if (decoded) {
                    req.user = decoded.user;
                    next();
                    return;
                }
            }
        }
        throw new Error('Unauthorized');
    } catch (error) {
        return res.writeHead(302, {
            'Location': '/login'
          }).end();
    }
};

const verifyUserRole = (...allowedRoles) => {
    return (req, res, next) => {
        const roles = [...allowedRoles];
        const match = roles.find(role => role === req.user.role);
        if (!match) {
            return res.status(403).end();
        }
        next();
    };
};

module.exports = {
    verifyUserToken,
    verifyUserRole
};
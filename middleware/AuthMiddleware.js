require('dotenv').config();
const path = require('path');

const viewFolder = path.join(__dirname, '..', 'resource', 'view');
const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const verifyUserToken = (req, res, next) => {
    // let token = req.headers.authorization;
    let token = req.cookies.access_token;

    try {

        if (token) {
            const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
            if (decoded) {
                req.user = decoded.user;
                next();
                return;
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
            let html = path.join(viewFolder, 'unauthorized_page.html');
            return res.sendFile(html);
        }
        next();
    };
};

module.exports = {
    verifyUserToken,
    verifyUserRole
};
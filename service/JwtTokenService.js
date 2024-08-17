require('dotenv').config();
const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = '10d';
const REFRESH_TOKEN_EXPIRES_IN = '1d';

const accessTokenPayload = (user) => {
    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        }
    };
};

const refreshTokenPayload = (user) => {
    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        }
    };
};

const tokenService = {

    signAccessToken: async (user) => {
        const accessToken = jwt.sign(
            accessTokenPayload(user),
            ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
        );
        return accessToken;
    },

    signRefreshToken: async (user) => {
        const refreshToken = jwt.sign(
            refreshTokenPayload(user),
            REFRESH_TOKEN_SECRET,
            {expiresIn: REFRESH_TOKEN_EXPIRES_IN}
        );

        return refreshToken;
    },

    verifyAccessToken: async (token) => {
        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

        return decodedToken;
    },

    verifyRefreshToken: async (token) => {
        const decodedToken = jwt.verify(token, REFRESH_TOKEN_SECRET);
        return decodedToken;
    }
};

module.exports = tokenService;
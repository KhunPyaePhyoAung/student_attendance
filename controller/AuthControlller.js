const authController = ({ authService, userService, tokenService }) => {
    const REFRESH_TOKEN_COOKIE_MAX_AGE = 7 *24 * 60 * 60 * 1000;

    return {
        login: async (req, res) => {
            try {
                const email = req.body.email;
                const password = req.body.password;
                let message = 'Incorrect username or password';
                const user = await authService.loginWithEmailAndPassword(email, password);
                const accessToken = await tokenService.signAccessToken(user);
                const refreshToken = await tokenService.signRefreshToken(user);
                res.cookie('refresh_token', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE});
                res.cookie('access_token', accessToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE});

                return res.status(200).json({
                    status: 200,
                    access_token: accessToken
                });
            } catch (error) {
                if (error.field) {
                    return res.status(200).json({
                        status: 401,
                        error: [
                            {
                                field: error.field,
                                message: error.message
                            }
                        ]
                    });
                }
                return res.status(500).end();
            }
        },

        logout: async (req, res) => {
            try {
                const cookies = req.cookies;
                const refreshToken = cookies.refresh_token;
                const decodedToken = await tokenService.verifyRefreshToken(refreshToken);
                if (await authService.logout(decodedToken.user.email)) {
                    for (let cookie in cookies) {
                        res.clearCookie(cookie);
                    }
                    return res.status(200).json(
                        {
                            status: 204,
                            message: 'Successfully loggouted'
                        }
                    );
                }
                return res.status(200).json(
                    {
                        status: 500
                    }
                );
            } catch (error) {
                return res.status(200).json(
                    {
                        status: 401
                    }
                )
            }
        },

        refresh: async (req, res) => {
            if (req.cookies?.refresh_token) {
                const refreshToken = req.cookies.refresh_token;
                try {
                    const decodedToken = await tokenService.verifyRefreshToken(refreshToken);
                    const user = await userService.findUserByUsername(decodedToken.user.email);
                    if (user) {
                        const accessToken = await tokenService.signAccessToken(user);
                        return res.status(200).json({
                            access_token: accessToken
                        });
                    }
                    
                    return res.status(401).end();
                } catch (error) {
                    console.log(error);
                    return res.status(401).end();
                }
            }

            return res.status(401).end();
        }
    };
};

module.exports = authController;
const path = require('path');

const viewFolder = path.join(__dirname, '..', 'resource', 'view');
const viewController = ({tokenService}) => {

    return {
        home: async (req, res) => {
            const homeHtml = path.join(viewFolder, 'home.html');
            return res.sendFile(homeHtml);
        },

        login: async (req, res) => {
            let token = req.headers.authorization;
            try {
                if (token) {
                    token = token.split(' ');
                    const decodedToken = tokenService.verifyAccessToken(token)
                    if (!decodedToken) {
                        throw new Error('Unauthorized');
                    }
                    const homeHtml = path.join(viewFolder, 'home.html');
                    return res.sendFile(homeHtml);
                }
                throw new Error('Unauthorized');
            } catch (error) {
                const loginHtml = path.join(viewFolder, 'login.html');
                return res.sendFile(loginHtml);
            }
            
        },
    }
}


module.exports = viewController;
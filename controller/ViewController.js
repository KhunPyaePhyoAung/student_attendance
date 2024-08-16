const path = require('path');

const viewFolder = path.join(__dirname, '..', 'resource', 'view');
const viewController = ({tokenService}) => {

    return {
        home: async (req, res) => {
            const homeHtml = path.join(viewFolder, 'home.html');
            return res.sendFile(homeHtml);
        },

        login: async (req, res) => {
            let token = req.cookies.access_token
            try {
                if (token) {
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

        student_registration: (req, res) => {
            const html = path.join(viewFolder, 'student_registration.html');
            return res.sendFile(html);
        },

        instructor_registration: (req, res) => {
            const html = path.join(viewFolder, 'instructor_registration.html');
            return res.sendFile(html);
        },

        students: (req, res) => {
            const html = path.join(viewFolder, 'students.html');
            return res.sendFile(html);
        },
    }
}


module.exports = viewController;
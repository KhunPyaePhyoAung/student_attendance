const path = require('path');

const viewFolder = path.join(__dirname, '..', 'resource', 'view');
const viewController = () => {

    return {
        home: async (req, res) => {
            const homeHtml = path.join(viewFolder, 'home.html');
            res.sendFile(homeHtml);
        },
    }
}


module.exports = viewController;
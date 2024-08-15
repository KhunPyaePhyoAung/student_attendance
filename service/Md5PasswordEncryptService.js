const md5 = require('md5');

const passwordEncryptService = {
    encrypt: (password) => {
        return md5(password);
    },

    match: (password, encrypted) => {
        return encrypted === md5(password);
    }
};

module.exports = passwordEncryptService;
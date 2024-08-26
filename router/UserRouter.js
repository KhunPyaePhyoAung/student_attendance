const express = require('express');
const router = express.Router();
const {
    userController
} = require('../Dependencies');

const authMiddleware = require('../middleware/AuthMiddleware');

router.get(
    '/',
    userController.getAll
)
router.get(
    '/:id(\\d+)',
    userController.findOneById
);

router.get(
    '/email/:email',
    userController.findOneByEmail
)

router.post(
    '/',
    userController.create
);

router.put(
    '/:id(\\d+)',
    userController.update
);

router.delete(
    '/:id(\\d+)',
    userController.delete
);

router.post(
    '/change_password',
    [authMiddleware.verifyUserToken],
    userController.changePassword
);

module.exports = router;
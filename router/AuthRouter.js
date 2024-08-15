const express = require('express');
const router = express.Router();

router.post(
    '/login',
    (req, res) => {
        return res.status(200).json(
            {
                status: 401,
                error: [
                    {
                        field: "email",
                        message: "Email already exist"
                    },
                    {
                        field: "password",
                        message: "Incorrect password"
                    }
                ]
            }
        );
    }
)

module.exports = router;
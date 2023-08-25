const express = require('express');
const router = express.Router();

router.use('/api/v1/users', require('./userRoute'));

module.exports = router;
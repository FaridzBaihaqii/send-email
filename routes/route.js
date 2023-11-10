const router = require('express').Router();

const { signup, getbill } = require('../Controller/app.Controller')

/* HTTP Reqeust */p
router.post('/user/signup', signup);
router.post('/product/getbill', getbill);

module.exports = router;
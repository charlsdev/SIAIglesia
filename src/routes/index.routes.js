const { Router } = require('express');
const router = Router();

const {
   renderLogin,
   renderIndexSec
} = require('../controllers/index.controllers');

router.get('/login', renderLogin);
router.get('/table', renderIndexSec);

module.exports = router;
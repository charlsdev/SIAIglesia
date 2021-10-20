const { Router } = require('express');
const router = Router();

const {
   renderIndex,
   renderLogin,
   renderRegister,
   registerNewUser,
   renderIndexSec,
   searchUsers
} = require('../controllers/index.controllers');

router.get('/', renderIndex);

router.get('/login', renderLogin);
router.get('/register', renderRegister);
router.post('/register', registerNewUser);

router.get('/search', searchUsers);
router.get('/table', renderIndexSec);

module.exports = router;
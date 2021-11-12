const { Router } = require('express');
const router = Router();

const {
   redirectWelcome,
   renderWelcome,
   renderOfrendas,
   getOfrendas
} = require('../controllers/secretaria.controllers');

const {
   isAuthenticated,
   authSecretaria
} = require('../helpers/middlewareSesion');

router.get('/', isAuthenticated, authSecretaria, redirectWelcome);
router.get('/welcome', isAuthenticated, authSecretaria, renderWelcome);
router.get('/ofrendas', isAuthenticated, authSecretaria, renderOfrendas);
router.get('/getOfrendas', isAuthenticated, authSecretaria, getOfrendas);

module.exports = router;
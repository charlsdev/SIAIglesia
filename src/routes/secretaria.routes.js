const { Router } = require('express');
const router = Router();

const {
   redirectWelcome,
   renderWelcome,
   renderOfrendas,
   getOfrendas,
   renderEventos,
   saveEvento,
   deleteEvento,
   searchEvento,
   updateEvento
} = require('../controllers/secretaria.controllers');

const {
   isAuthenticated,
   authSecretaria
} = require('../helpers/middlewareSesion');

router.get('/', isAuthenticated, authSecretaria, redirectWelcome);
router.get('/welcome', isAuthenticated, authSecretaria, renderWelcome);

router.get('/ofrendas', isAuthenticated, authSecretaria, renderOfrendas);
router.get('/getOfrendas', isAuthenticated, authSecretaria, getOfrendas);

router.get('/eventos', isAuthenticated, authSecretaria, renderEventos);
router.post('/saveEvento', isAuthenticated, authSecretaria, saveEvento);
router.post('/deleteEvento', isAuthenticated, authSecretaria, deleteEvento);
router.get('/searchEvento', isAuthenticated, authSecretaria, searchEvento);
router.post('/updateEvento', isAuthenticated, authSecretaria, updateEvento);

module.exports = router;
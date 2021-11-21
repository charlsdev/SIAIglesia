const { Router } = require('express');
const router = Router();

const {
   redirectWelcome,
   renderWelcome,
   renderOfrendas,
   getOfrendas,
   changeEstOf,
   searchDatesOf,
   renderEventos,
   saveEvento,
   deleteEvento,
   searchEvento,
   updateEvento,
   renderBautizo,
   getBautizos,
   saveBautizo
} = require('../controllers/secretaria.controllers');

const {
   isAuthenticated,
   authSecretaria
} = require('../helpers/middlewareSesion');

router.get('/', isAuthenticated, authSecretaria, redirectWelcome);
router.get('/welcome', isAuthenticated, authSecretaria, renderWelcome);

router.get('/ofrendas', isAuthenticated, authSecretaria, renderOfrendas);
router.get('/getOfrendas', isAuthenticated, authSecretaria, getOfrendas);
router.post('/changeEstOf', isAuthenticated, authSecretaria, changeEstOf);
router.get('/searchDatesOf', isAuthenticated, authSecretaria, searchDatesOf);

router.get('/eventos', isAuthenticated, authSecretaria, renderEventos);
router.post('/saveEvento', isAuthenticated, authSecretaria, saveEvento);
router.post('/deleteEvento', isAuthenticated, authSecretaria, deleteEvento);
router.get('/searchEvento', isAuthenticated, authSecretaria, searchEvento);
router.post('/updateEvento', isAuthenticated, authSecretaria, updateEvento);

router.get('/bautizos', isAuthenticated, authSecretaria, renderBautizo);
router.get('/getBautizos', isAuthenticated, authSecretaria, getBautizos);
router.post('/saveBautizo', isAuthenticated, authSecretaria, saveBautizo);

module.exports = router;
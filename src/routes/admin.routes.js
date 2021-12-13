const { Router } = require('express');
const router = Router();

const path = require('path');
const multer = require('multer');
const uploadEvents = multer({
   dest: path.join(__dirname, '../public/temp')
});

const {
   redirectWelcome,
   renderWelcome,

   renderProfile,
   photoProfile,
   dataProfile,

   renderPassword,
   changePassword
} = require('../controllers/admin.controllers');

const {
   isAuthenticated,
   authAdministrador
} = require('../helpers/middlewareSesion');

router.get('/', isAuthenticated, authAdministrador, redirectWelcome);
router.get('/welcome', isAuthenticated, authAdministrador, renderWelcome);

router.get('/profile', isAuthenticated, authAdministrador, renderProfile);
router.post('/profile', isAuthenticated, authAdministrador, uploadEvents.single('photo'), photoProfile);
router.post('/profileData', isAuthenticated, authAdministrador, dataProfile);

router.get('/password', isAuthenticated, authAdministrador, renderPassword);
router.post('/password', isAuthenticated, authAdministrador, changePassword);

module.exports = router;
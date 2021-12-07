const { Router } = require('express');
const router = Router();

const path = require('path');
const multer = require('multer');
const uploadEvents = multer({
   dest: path.join(__dirname, '../public/events/temp')
});

const {
   redirectWelcome,
   renderWelcome,
   renderProfile,

   renderOfrendas,
   getOfrendas,
   changeEstOf,
   searchDatesOf,

   renderEventos,
   saveEvento,
   deleteEvento,
   searchEvento,
   updateEvento,
   saveEventoFile,

   renderBautizo,
   getBautizos,
   saveBautizo,
   searchBautizo,
   updateBautizo,
   deleteBautizo,
   downloadPDFBautizo,

   renderComunion,
   getComuniones,
   saveComunion,
   searchComunion,
   updateComunion,
   deleteComunion,
   downloadPDFComunion,

   renderConfirmacion,
   getConfirmaciones,
   saveConfirmacion,
   searchConfirmacion,
   updateConfirmacion,
   deleteConfirmacion,
   downloadPDFConfirmacion,

   renderMatrimonio,
   getMatrimonios,
   saveMatrimonio,
   searchMatrimonio,
   updateMatrimonio,
   deleteMatrimonio,
   downloadPDFMatrimonio
} = require('../controllers/secretaria.controllers');

const {
   isAuthenticated,
   authSecretaria
} = require('../helpers/middlewareSesion');

router.get('/', isAuthenticated, authSecretaria, redirectWelcome);
router.get('/welcome', isAuthenticated, authSecretaria, renderWelcome);
router.get('/profile', isAuthenticated, authSecretaria, renderProfile);

router.get('/ofrendas', isAuthenticated, authSecretaria, renderOfrendas);
router.get('/getOfrendas', isAuthenticated, authSecretaria, getOfrendas);
router.post('/changeEstOf', isAuthenticated, authSecretaria, changeEstOf);
router.get('/searchDatesOf', isAuthenticated, authSecretaria, searchDatesOf);

router.get('/eventos', isAuthenticated, authSecretaria, renderEventos);
router.post('/saveEvento', isAuthenticated, authSecretaria, saveEvento);
router.post('/deleteEvento', isAuthenticated, authSecretaria, deleteEvento);
router.get('/searchEvento', isAuthenticated, authSecretaria, searchEvento);
router.post('/updateEvento', isAuthenticated, authSecretaria, updateEvento);
router.post('/saveEventoFile', isAuthenticated, authSecretaria, uploadEvents.single('file_events'), saveEventoFile);

router.get('/bautizos', isAuthenticated, authSecretaria, renderBautizo);
router.get('/getBautizos', isAuthenticated, authSecretaria, getBautizos);
router.post('/saveBautizo', isAuthenticated, authSecretaria, saveBautizo);
router.get('/searchBautizo', isAuthenticated, authSecretaria, searchBautizo);
router.post('/updateBautizo', isAuthenticated, authSecretaria, updateBautizo);
router.post('/deleteBautizo', isAuthenticated, authSecretaria, deleteBautizo);
router.get('/downloadPDFBautizo/:idBau', isAuthenticated, authSecretaria, downloadPDFBautizo);

router.get('/comuniones', isAuthenticated, authSecretaria, renderComunion);
router.get('/getComuniones', isAuthenticated, authSecretaria, getComuniones);
router.post('/saveComunion', isAuthenticated, authSecretaria, saveComunion);
router.get('/searchComunion', isAuthenticated, authSecretaria, searchComunion);
router.post('/updateComunion', isAuthenticated, authSecretaria, updateComunion);
router.post('/deleteComunion', isAuthenticated, authSecretaria, deleteComunion);
router.get('/downloadPDFComunion/:idBau', isAuthenticated, authSecretaria, downloadPDFComunion);

router.get('/confirmaciones', isAuthenticated, authSecretaria, renderConfirmacion);
router.get('/getConfirmaciones', isAuthenticated, authSecretaria, getConfirmaciones);
router.post('/saveConfirmacion', isAuthenticated, authSecretaria, saveConfirmacion);
router.get('/searchConfirmacion', isAuthenticated, authSecretaria, searchConfirmacion);
router.post('/updateConfirmacion', isAuthenticated, authSecretaria, updateConfirmacion);
router.post('/deleteConfirmacion', isAuthenticated, authSecretaria, deleteConfirmacion);
router.get('/downloadPDFConfirmacion/:idBau', isAuthenticated, authSecretaria, downloadPDFConfirmacion);

router.get('/matrimonios', isAuthenticated, authSecretaria, renderMatrimonio);
router.get('/getMatrimonios', isAuthenticated, authSecretaria, getMatrimonios);
router.post('/saveMatrimonio', isAuthenticated, authSecretaria, saveMatrimonio);
router.get('/searchMatrimonio', isAuthenticated, authSecretaria, searchMatrimonio);
router.post('/updateMatrimonio', isAuthenticated, authSecretaria, updateMatrimonio);
router.post('/deleteMatrimonio', isAuthenticated, authSecretaria, deleteMatrimonio);
router.get('/downloadPDFMatrimonio/:idBau', isAuthenticated, authSecretaria, downloadPDFMatrimonio);

module.exports = router;
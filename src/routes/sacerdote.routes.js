const { Router } = require('express');
const router = Router();

const path = require('path');
const multer = require('multer');
const uploadEvents = multer({
   // Esta ruta es relativa
   dest: path.join(__dirname, '../public/temp')
});

const {
   redirectWelcome,
   renderWelcome,
   
   renderProfile,
   photoProfile,
   dataProfile,
   
   renderPassword,
   changePassword,

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
} = require('../controllers/sacerdote.controllers');

const {
   isAuthenticated,
   authSacerdote
} = require('../helpers/middlewareSesion');

router.get('/', isAuthenticated, authSacerdote, redirectWelcome);
router.get('/welcome', isAuthenticated, authSacerdote, renderWelcome);

router.get('/profile', isAuthenticated, authSacerdote, renderProfile);
router.post('/profile', isAuthenticated, authSacerdote, uploadEvents.single('photo'), photoProfile);
router.post('/profileData', isAuthenticated, authSacerdote, dataProfile);

router.get('/password', isAuthenticated, authSacerdote, renderPassword);
router.post('/password', isAuthenticated, authSacerdote, changePassword);

router.get('/ofrendas', isAuthenticated, authSacerdote, renderOfrendas);
router.get('/getOfrendas', isAuthenticated, authSacerdote, getOfrendas);
router.post('/changeEstOf', isAuthenticated, authSacerdote, changeEstOf);
router.get('/searchDatesOf', isAuthenticated, authSacerdote, searchDatesOf);

router.get('/eventos', isAuthenticated, authSacerdote, renderEventos);
router.post('/saveEvento', isAuthenticated, authSacerdote, saveEvento);
router.post('/deleteEvento', isAuthenticated, authSacerdote, deleteEvento);
router.get('/searchEvento', isAuthenticated, authSacerdote, searchEvento);
router.post('/updateEvento', isAuthenticated, authSacerdote, updateEvento);
router.post('/saveEventoFile', isAuthenticated, authSacerdote, uploadEvents.single('file_events'), saveEventoFile);

router.get('/bautizos', isAuthenticated, authSacerdote, renderBautizo);
router.get('/getBautizos', isAuthenticated, authSacerdote, getBautizos);
router.post('/saveBautizo', isAuthenticated, authSacerdote, saveBautizo);
router.get('/searchBautizo', isAuthenticated, authSacerdote, searchBautizo);
router.post('/updateBautizo', isAuthenticated, authSacerdote, updateBautizo);
router.post('/deleteBautizo', isAuthenticated, authSacerdote, deleteBautizo);
router.get('/downloadPDFBautizo/:idBau', isAuthenticated, authSacerdote, downloadPDFBautizo);

router.get('/comuniones', isAuthenticated, authSacerdote, renderComunion);
router.get('/getComuniones', isAuthenticated, authSacerdote, getComuniones);
router.post('/saveComunion', isAuthenticated, authSacerdote, saveComunion);
router.get('/searchComunion', isAuthenticated, authSacerdote, searchComunion);
router.post('/updateComunion', isAuthenticated, authSacerdote, updateComunion);
router.post('/deleteComunion', isAuthenticated, authSacerdote, deleteComunion);
router.get('/downloadPDFComunion/:idBau', isAuthenticated, authSacerdote, downloadPDFComunion);

router.get('/confirmaciones', isAuthenticated, authSacerdote, renderConfirmacion);
router.get('/getConfirmaciones', isAuthenticated, authSacerdote, getConfirmaciones);
router.post('/saveConfirmacion', isAuthenticated, authSacerdote, saveConfirmacion);
router.get('/searchConfirmacion', isAuthenticated, authSacerdote, searchConfirmacion);
router.post('/updateConfirmacion', isAuthenticated, authSacerdote, updateConfirmacion);
router.post('/deleteConfirmacion', isAuthenticated, authSacerdote, deleteConfirmacion);
router.get('/downloadPDFConfirmacion/:idBau', isAuthenticated, authSacerdote, downloadPDFConfirmacion);

router.get('/matrimonios', isAuthenticated, authSacerdote, renderMatrimonio);
router.get('/getMatrimonios', isAuthenticated, authSacerdote, getMatrimonios);
router.post('/saveMatrimonio', isAuthenticated, authSacerdote, saveMatrimonio);
router.get('/searchMatrimonio', isAuthenticated, authSacerdote, searchMatrimonio);
router.post('/updateMatrimonio', isAuthenticated, authSacerdote, updateMatrimonio);
router.post('/deleteMatrimonio', isAuthenticated, authSacerdote, deleteMatrimonio);
router.get('/downloadPDFMatrimonio/:idBau', isAuthenticated, authSacerdote, downloadPDFMatrimonio);

module.exports = router;
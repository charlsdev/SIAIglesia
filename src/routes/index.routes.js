const { Router } = require('express');
const router = Router();

const path = require('path');
const multer = require('multer');
const uploadComprobante = multer({
   dest: path.join(__dirname, '../public/comprobantes/temp')
});

const {
   renderIndex,
   renderLogin,
   userLogin,
   verificationSesion,
   renderRegister,
   registerNewUser,
   renderHistory,
   renderContacts,
   renderGalery,
   renderOfrendas,
   saveOfrendas,

   exitLogout,
   

   searchUsers
} = require('../controllers/index.controllers');

const {
   isAuthenticated,
   isNotAuthenticated
} = require('../helpers/middlewareSesion');

router.get('/', renderIndex);

router.get('/login', isNotAuthenticated, renderLogin);
router.post('/login', isNotAuthenticated, userLogin);

router.get('/register', renderRegister);
router.post('/register', registerNewUser);

router.get('/history', renderHistory);
router.get('/galery', renderGalery);
router.get('/contacts', renderContacts);
router.get('/ofrendas', renderOfrendas);
router.post('/ofrendas', uploadComprobante.single('comprobanteOf'), saveOfrendas);

router.get('/verification', isAuthenticated, verificationSesion);





router.get('/exit', exitLogout);





router.get('/search', searchUsers);

module.exports = router;
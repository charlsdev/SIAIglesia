const { Router } = require('express');
const router = Router();

const path = require('path');
const multer = require('multer');
const uploadComprobante = multer({
   dest: path.join(__dirname, '../public/comprobantes/temp')
});                        // Nombre del input [photoProfile]

const {
   renderIndex,
   renderLogin,
   userLogin,
   renderRegister,
   registerNewUser,
   renderHistory,
   renderContacts,
   renderGalery,
   renderOfrendas,
   saveOfrendas,

   exitLogout,

   renderIndexSec,
   searchUsers
} = require('../controllers/index.controllers');

router.get('/', renderIndex);

router.get('/login', renderLogin);
router.post('/login', userLogin);
router.get('/register', renderRegister);
router.post('/register', registerNewUser);

router.get('/history', renderHistory);
router.get('/galery', renderGalery);
router.get('/contacts', renderContacts);
router.get('/ofrendas', renderOfrendas);
router.post('/ofrendas', uploadComprobante.single('comprobanteOf'), saveOfrendas);


router.get('/exit', exitLogout);

router.get('/search', searchUsers);
router.get('/table', renderIndexSec);

module.exports = router;
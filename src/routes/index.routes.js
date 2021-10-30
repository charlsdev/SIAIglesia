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
   renderRegister,
   registerNewUser,
   renderHistory,
   renderContacts,
   renderGalery,
   renderOfrendas,
   saveOfrendas,

   renderIndexSec,
   searchUsers
} = require('../controllers/index.controllers');

router.get('/', renderIndex);

router.get('/login', renderLogin);
router.get('/register', renderRegister);
router.post('/register', registerNewUser);

router.get('/history', renderHistory);
router.get('/galery', renderGalery);
router.get('/contacts', renderContacts);
router.get('/ofrendas', renderOfrendas);
router.post('/ofrendas', uploadComprobante.single('comprobanteOf'), saveOfrendas);

router.get('/search', searchUsers);
router.get('/table', renderIndexSec);

module.exports = router;
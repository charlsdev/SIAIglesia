const indexControllers = {};

const connectionDB = require('../database');
const encryptPass = require('../helpers/encryptPass');

indexControllers.renderIndex = async (req, res) => {
   res.render('index');
};

indexControllers.renderLogin = async (req, res) => {
   res.render('login');
};

indexControllers.renderRegister = async (req, res) => {
   res.render('register');
};

indexControllers.registerNewUser = async (req, res) => {
   const errors = [];

   const {
      cedula,
      apellidos,
      nombres,
      fech_nacimiento,
      genero,
      telefono,
      email,
      privilegio,
      password,
      conf_password,
      estado
   } = req.body;

   var cedulaN = cedula.trim(),
      apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      fech_nacimientoN = fech_nacimiento.trim(),
      generoN = genero.trim(),
      telefonoN = telefono.trim(),
      emailN = email.trim(),
      privilegioN = privilegio.trim(),
      passwordN = password.trim(),
      conf_passwordN = conf_password.trim(),
      estadoN = estado.trim();

   if (cedulaN == '' || apellidosN == '' || nombresN == '' || fech_nacimientoN == '' || generoN == undefined || telefonoN == '' || emailN == '' || privilegioN == undefined || passwordN == '' || conf_passwordN == '' || estadoN == undefined) {
      errors.push({
         title: 'Campos vacios', 
         info: 'danger', 
         text: 'Los campos no pueden ir vacíos o con espacios...'});
   }

   if (password != conf_password) {
      errors.push({
         title: 'Contraseñas no coinciden', 
         info: 'danger', 
         text: 'Las contraseñas no coinciden...'
      });
   }

   if (errors.length > 0) {
      res.render('register', {
         errors,
         cedulaN,
         apellidosN,
         nombresN,
         fech_nacimientoN,
         generoN,
         telefonoN,
         emailN,
         privilegioN,
         passwordN,
         conf_passwordN,
         estadoN,
      });
   } else {
      const reviewUser = await connectionDB.query('SELECT cedula FROM usuarios WHERE cedula = ?', cedulaN);
      //console.log(reviewUser);

      if (reviewUser.length > 0) {
         req.flash('info_msg', 'La cedula del usuario ya esta en uso...');
         res.redirect('/register');
      } else {
         const newUser = {
            cedula: cedulaN,
            apellidos: apellidosN,
            nombres: nombresN,
            fechNacimiento: fech_nacimientoN,
            genero: generoN,
            telefono: telefonoN,
            email: emailN,
            password: passwordN,
            privilegio: privilegioN,
            estado: estadoN,
            photoProfile: 'profile.svg'
         };
         //console.log(newUser);
   
         newUser.password = await encryptPass.encryptPassword(password);
         //console.log(newUser);
   
         const userSave = await connectionDB.query('INSERT INTO usuarios set ?', [newUser]);
         //console.log(userSave);

         if (userSave) {
            req.flash('success_msg', 'Usuario registrado con éxito...');
            res.redirect('/register');
         } else {
            req.flash('error_msg', 'No se ha podido registrar al usuario...');
            res.redirect('/register');
         }
      }
   }
};

indexControllers.renderHistory = async (req, res) => {
   res.render('history');
};

indexControllers.renderGalery = async (req, res) => {
   res.render('galery');
};

indexControllers.renderContacts = async (req, res) => {
   res.render('contacts');
};





indexControllers.searchUsers = async (req, res) => {
   const users = await connectionDB.query('SELECT * FROM usuarios');

   res.json({
      users
   });
};

indexControllers.renderIndexSec = async (req, res) => {
   res.render('secretaria/index');
};

module.exports = indexControllers;
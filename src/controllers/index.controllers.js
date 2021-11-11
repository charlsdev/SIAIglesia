const { nanoid, customAlphabet } = require('nanoid');
const passport = require('passport');
const path = require('path');
const fse = require('fs-extra');
const moment = require('moment');
moment.locale('es');

const indexControllers = {};

const connectionDB = require('../database');
const encryptPass = require('../helpers/encryptPass');

const {
   cedulaVal,
   emailVer
} = require('../helpers/validations');

indexControllers.renderIndex = async (req, res) => {
   res.render('index');
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
         text: 'Los campos no pueden ir vacíos o con espacios...'
      });
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

indexControllers.renderOfrendas = async (req, res) => {
   let nowFecha = moment()
      .format('YYYY-MM-DD');

   res.render('ofrendas', {
      nowFecha
   });
};

indexControllers.saveOfrendas = async (req, res) => {
   const errors = [], 
      nanoID = customAlphabet('0123456789abcdefghijklmnñopqrstuvwxyz', 18);

   let nowFecha = moment()
      .format('YYYY-MM-DD');

   const {
      tipIntencion,
      fechaOf,
      horaOf,
      nameOf,
      montoOf,
      cedula,
      apellidos,
      nombres,
      telefono,
      direccion,
      email
   } = req.body;

   var tipIntencionV = tipIntencion,
      fechaOfV = (fechaOf) ? fechaOf.trim() : 'xxx',
      horaOfV = (horaOf) ? horaOf.trim() : 'xxx',
      nameOfV = (nameOf) ? nameOf.trim() : 'xxx',
      montoOfV = montoOf.trim(),
      cedulaV = cedula.trim(),
      apellidosV = apellidos.trim(),
      nombresV = nombres.trim(),
      telefonoV = telefono.trim(),
      direccionV = direccion.trim(),
      emailV = email.trim();

   if (tipIntencionV == undefined || fechaOfV == '' || horaOfV == undefined || nameOfV == '' || montoOfV == '' || cedulaV == '' || apellidosV == '' || nombresV == '' || telefonoV == '' || direccionV == '' || emailV == '') {
      errors.push({
         title: 'Campos vacios', 
         info: 'danger', 
         text: 'Los campos no pueden ir vacíos o con espacios...'
      });
   } else {
      if (!cedulaVal(cedulaV)) {
         errors.push({
            title: 'Cédula incorrecta', 
            info: 'danger', 
            text: 'La cédula proporcionada es incorrecta o no válida...'
         });
      }

      if (!emailVer(emailV)) {
         errors.push({
            title: 'Correo incorrecto', 
            info: 'danger', 
            text: 'El correo proporcionado es incorrecto o no válido...'
         });
      }
   }

   if (errors.length > 0) {
      if (req.file) {
         const tempPathFiles = req.file.path;
         await fse.unlink(tempPathFiles);   
      }

      res.render('ofrendas', {
         errors,
         nowFecha
      });
   } else {
      const idComp = `Comprobante - ${nanoid(12)}`;

      const extFiles = path.extname(req.file.originalname).toLowerCase();
      // const nameFiles = path.basename(req.file.originalname, extFiles);
      const nameEndFiles = `${idComp}${extFiles}`;
      const destinationFiles = path.resolve(`src/public/comprobantes/${nameEndFiles}`);
      const tempPathFiles = req.file.path;
      
      try {
         await fse.copy(tempPathFiles, destinationFiles);

         let newOfrenda, reviewID, idOfrenda;

         const ID = async () => {
            // idOfrenda = `COP - ${nanoid(12)}`;
            idOfrenda = `60${nanoID()}`;

            reviewID = await connectionDB.query('SELECT idOfrenda FROM ofrendas WHERE idOfrenda = ?', idOfrenda);

            if (reviewID.length > 0) {
               ID();
            } else {
               if (tipIntencionV == 'Ofrenda') {
                  newOfrenda = {
                     idOfrenda:  idOfrenda,
                     tipItencion:  tipIntencionV,
                     montoOf:  montoOfV,
                     cedula:  cedulaV,
                     apellidos:  apellidosV,
                     nombres:  nombresV,
                     telefono:  telefonoV,
                     dirección:  direccionV,
                     email:  emailV,
                     comprobanteOf: nameEndFiles,
                     estado: 'Aceptado'
                  };
               } else {
                  newOfrenda = {
                     idOfrenda:  idOfrenda,
                     tipItencion:  tipIntencionV,
                     fechaOf:  fechaOfV,
                     horaOf:  horaOfV,
                     nameOf:  nameOfV,
                     montoOf:  montoOfV,
                     cedula:  cedulaV,
                     apellidos:  apellidosV,
                     nombres:  nombresV,
                     telefono:  telefonoV,
                     dirección:  direccionV,
                     email:  emailV,
                     comprobanteOf: nameEndFiles,
                     estado: 'Pendiente'
                  };
               }
      
               const saveOfrenda = await connectionDB.query('INSERT INTO ofrendas set ?', [newOfrenda]);
               console.log(saveOfrenda);
      
               if (saveOfrenda) {
                  req.flash('success_msg', 'Ofrenda registrada con éxito...');
                  res.redirect('/ofrendas');
               } else {
                  req.flash('error_msg', 'No se ha podido registrar su ofrenda...');
                  res.redirect('/ofrendas');
               }
            }
         };

         ID();
      } catch (e) {
         console.log(e);
         req.flash('error_msg', '¡Upsss! Error interno x_x, vuelva a subir su ofrenda...');
         res.redirect('/ofrendas');
      }

      await fse.unlink(tempPathFiles);
   }
};

indexControllers.renderLogin = async (req, res) => {
   res.render('login');
};

indexControllers.userLogin = passport.authenticate('local.login', {
   failureRedirect: '/login',
   successRedirect: '/verification',
   badRequestMessage: 'Credenciales incorrectas!!!',
   failureFlash: true
});


indexControllers.verificationSesion = (req, res) => {
   const privilegioUser = req.user.privilegio;
   
   if (privilegioUser == 'Secretaria') {
      res.redirect('/s');
   } else {
      if (privilegioUser == 'Sacerdote') {
         res.redirect('/c');
      } else {
         if (privilegioUser == 'Administrador') {
            res.redirect('/a');
         } else {
            req.flash('error_msg', '¡Upsss! No posees los permisos necesarios para realizar esta acción...');
            res.redirect('/login');
         }
      }
   }
};




indexControllers.exitLogout = (req, res) => {
   req.logout();
   req.flash('warning_msg', 'Sesión cerrada. Vuelva pronto!');
   res.redirect('/login');
};





indexControllers.searchUsers = async (req, res) => {
   const users = await connectionDB.query('SELECT * FROM usuarios');

   res.json({
      users
   });
};

module.exports = indexControllers;
const { nanoid } = require('nanoid');
const path = require('path');
const fse = require('fs-extra');
const moment = require('moment');
moment.locale('es');
const adminControllers = {};

const connectionDB = require('../database');

const {
   encryptPassword,
   matchPassword
} = require('../helpers/encryptPass');

const {
   // cedulaVal,
   numbersVer,
   spaceLetersVer,
   // verNumberAndLetters,
   emailVer
} = require('../helpers/validations');

adminControllers.redirectWelcome = async (req, res) => {
   res.redirect('/a/welcome');
};

adminControllers.renderWelcome = async (req, res) => {
   var h = new Date().getHours(),
      m = new Date().getMinutes(),
      s = new Date().getSeconds();

   const {
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      photoProfile,
   } = req.user;

   let est, admin, sace, secre;

   est = (estado == 'Enabled') ? true : false;

   try {
      admin = await connectionDB.query(`SELECT 
                                          COUNT(cedula) AS numOF 
                                       FROM usuarios 
                                       WHERE privilegio = 'Administrador'`);
      admin = admin[0].numOF;

      sace = await connectionDB.query(`SELECT 
                                          COUNT(cedula) AS numOF 
                                       FROM usuarios 
                                       WHERE privilegio = 'Sacerdote'`);
      sace = sace[0].numOF;

      secre = await connectionDB.query(`SELECT 
                                          COUNT(cedula) AS numOF 
                                       FROM usuarios 
                                       WHERE privilegio = 'Secretaria'`);
      secre = secre[0].numOF;
   } catch (e) {
      console.log(e);
   }

   res.render('admin/welcome', {
      h, m, s,
      cedula, apellidos, nombres, privilegio, estado, photoProfile,
      est, admin, sace, secre
   });
};

adminControllers.renderProfile = async (req, res) => {
   const {
      cedula,
      apellidos,
      nombres,
      fechNacimiento,
      genero,
      telefono,
      email,
      privilegio,
      estado,
      photoProfile
   } = req.user;

   let est = (estado == 'Enabled') ? true : false;

   res.render('admin/profile', { 
      cedula, apellidos, nombres, fechNacimiento, genero, telefono, email, privilegio, estado, photoProfile,
      est
   });
};

adminControllers.photoProfile = async (req, res) => {
   if (!req.file) {
      if (req.file) {
         const tempPathFiles = req.file.path;
         await fse.unlink(tempPathFiles);   
      }

      req.flash('warning_msg', 'No se puede enviar imagenes vacias...');
      res.redirect('/a/profile');
   } else {
      try {
         const nameIMG = `${nanoid(20)}`;

         const extFiles = path.extname(req.file.originalname).toLowerCase();
         
         if (extFiles === '.jpg' || extFiles === '.jpeg' || extFiles === '.png') {
            const nameEndFiles = `${nameIMG}${extFiles}`;
            const destinationFiles = path.resolve(`src/public/profile/${nameEndFiles}`);
            const tempPathFiles = req.file.path;
            
            await fse.copy(tempPathFiles, destinationFiles);
            
            const imgID = async () => {

               const reviewIMG = await connectionDB.query(`SELECT photoProfile
                                                         FROM usuarios
                                                         WHERE photoProfile = ?`, nameEndFiles);
               // console.log(reviewIMG);

               if (reviewIMG.length > 0) {
                  imgID();
               } else {
                  const photoNew = {
                     photoProfile: nameEndFiles
                  };

                  const saveImage = await connectionDB.query(`UPDATE usuarios 
                                                            SET ?
                                                            WHERE cedula = ?`, [photoNew, req.user.cedula]);
                  // console.log(saveImage);
      
                  if (saveImage.affectedRows > 0) {
                     req.flash('success_msg', 'Imagen de perfil actualizada con éxito...');
                     res.redirect('/a/profile');
                  } else {
                     req.flash('error_msg', '¡Uppsss! No se ha podido actualizar la imagen de perfil...');
                     res.redirect('/a/profile');
                  }
               }
            };

            imgID();

            await fse.unlink(tempPathFiles);
         } else {
            if (req.file) {
               const tempPathFiles = req.file.path;
               await fse.unlink(tempPathFiles);   
            }
   
            req.flash('info_msg', '¡Uppsss! Extensión de imagen no válida.');
            res.redirect('/a/profile');
         }
         
      } catch (e) {
         console.log(e);
            
         if (req.file) {
            const tempPathFiles = req.file.path;
            await fse.unlink(tempPathFiles);   
         }

         req.flash('error_msg', '¡Uppsss! Error inesperado, inténtalo más luego x_x.');
         res.redirect('/a/profile');
      }
   }
};

adminControllers.dataProfile = async (req, res) => {
   const {
      apellidos,
      nombres,
      fech_nacimiento,
      genero,
      telefono,
      email
   } = req.body;

   let errors = 0;

   let apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      fech_nacimientoN = fech_nacimiento.trim(),
      generoN = genero.trim(),
      telefonoN = telefono.trim(),
      emailN = email.trim();

   if (
      apellidosN === '',
      nombresN === '',
      fech_nacimientoN === '',
      generoN === '',
      telefonoN === '',
      emailN === ''
   ) {
      res.json({
         res: 'icon',
         icon: 'info',
         tittle: 'CAMPOS VACIOS',
         description: 'Los campos no pueden ir vacios o con espacios.'
      });
   } else {
      errors += (!spaceLetersVer(apellidosN)) ? 1 : 0;
      errors += (!spaceLetersVer(nombresN)) ? 1 : 0;
      errors += (!moment(fech_nacimientoN).isValid()) ? 1 : 0;
      errors += (!spaceLetersVer(generoN)) ? 1 : 0;
      errors += (!numbersVer(telefonoN)) ? 1 : 0;
      errors += (!emailVer(emailN)) ? 1 : 0;

      if (errors > 0) {
         res.json({
            res: 'icon',
            icon: 'error',
            tittle: 'DATOS INCORRECTOS',
            description: 'Los tipos de datos solicitados y enviados son incorrectos.'
         });
      } else {
         try {
            const updateDataUser = {
               apellidos: apellidos,
               nombres: nombres,
               fechNacimiento: fech_nacimiento,
               genero: genero,
               telefono: telefono,
               email: email
            };

            const updateUser = await connectionDB.query(`UPDATE usuarios
                                                         SET ?
                                                         WHERE cedula = ?`, [updateDataUser, req.user.cedula]);
            console.log(updateUser);

            if (updateUser.affectedRows > 0) {
               res.json({
                  res: 'img',
                  icon: '/img/SMMIglesia.png',
                  tittle: 'DATOS ACTUALIZADOS',
                  description: 'Los datos personales han sido actualizados.'
               });
            } else {
               res.json({
                  res: 'icon',
                  tittle: 'DATOS NO ACTUALIZADOS',
                  icon: 'error',
                  description: 'Upss! No se ha podido actualizar los datos.'
               });
            }
         } catch (e) {
            console.log(e);
            res.json({
               res: 'icon',
               tittle: 'SERVER ERROR',
               icon: 'error',
               description: 'Upss! Error interno x_x. Intentelo más luego.'
            });
         }
      }
   }
};

adminControllers.renderPassword = async (req, res) => {
   const {
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      photoProfile,
   } = req.user;

   let nowFecha = moment()
         .format('YYYY-MM-DD'),
      est = (estado == 'Enabled') ? true : false;

   res.render('admin/password', {
      cedula, apellidos, nombres, privilegio, estado, photoProfile,
      est, nowFecha
   });
};

adminControllers.changePassword = async (req, res) => {
   const errors = [];

   const {
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      photoProfile,
   } = req.user;

   let nowFecha = moment()
         .format('YYYY-MM-DD'),
      est = (estado == 'Enabled') ? true : false;

   const {
      passAntigua,
      passNew,
      passNewConf
   } = req.body;

   let passAntiguaN = passAntigua.trim(),
      passNewN = passNew.trim(),
      passNewConfN = passNewConf.trim();

   if (
      passAntiguaN === '' ||
      passNewN === '' ||
      passNewConfN === ''
   ) {
      errors.push({
         title: 'Campos vacios', 
         info: 'danger', 
         text: 'Los campos no pueden ir vacíos o con espacios...'
      });
   }

   if (
      passNewN != passNewConfN
   ) {
      errors.push({
         title: 'Contraseña no coincide', 
         info: 'warning', 
         text: 'La nueva contraseña no coincide con la confirmada...'
      });
   }

   if (errors.length > 0) {
      res.render('admin/password', {
         cedula, apellidos, nombres, privilegio, estado, photoProfile,
         est, nowFecha,
         errors,
         passAntigua,
         passNew,
         passNewConf
      });
   } else {
      try {
         const usersData = await connectionDB.query(`SELECT * 
                                                      FROM usuarios 
                                                      WHERE cedula = ?`, req.user.cedula);
         // console.log(usersData[0]);

         const comparePass = await matchPassword(passNew, usersData[0].password);
         // console.log(comparePass);

         if (comparePass) {
            errors.push({
               title: 'Contraseña iguales', 
               info: 'info', 
               text: 'La nueva contraseña debe de ser diferente a la actual...'
            });
         } else {
            const comparePassAnt = await matchPassword(passAntiguaN, usersData[0].password);
            // console.log(comparePassAnt);

            if (!comparePassAnt) {
               errors.push({
                  title: 'Contraseña incorrecta', 
                  info: 'info', 
                  text: 'La contraseña actual no coincide o es incorrecta...'
               });
            }
         }

         if (errors.length > 0) {
            res.render('admin/password', {
               cedula, apellidos, nombres, privilegio, estado, photoProfile,
               est, nowFecha,
               errors,
               passAntigua,
               passNew,
               passNewConf
            });
         } else {
            const passNewEncrypt = await encryptPassword(passNew);
            // console.log(passNewEncrypt);

            const updatePassUser = await connectionDB.query(`UPDATE usuarios
                                                            SET password = ?
                                                            WHERE cedula = ?`, [passNewEncrypt, req.user.cedula]);
            // console.log(updatePassUser);

            if (updatePassUser.affectedRows > 0) {
               req.flash('success_msg', '!Contraseña cambiada¡ Vuelva a iniciar sesión con la nueva contraseña...');
               req.logout();
               res.redirect('/login');
            } else {
               req.flash('error_msg', '!Upsss¡ No se ha podido cambiar la contraseña...');
               res.redirect('/a/password');
            }
         }
      } catch (e) {
         req.flash('error_msg', '!Upsss¡ No se ha podido cambiar la contraseña...');
         res.redirect('/a/password');
      }
   }
};

module.exports = adminControllers;
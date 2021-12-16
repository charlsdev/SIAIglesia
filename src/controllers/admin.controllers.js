const { nanoid } = require('nanoid');
const nodemailer = require('nodemailer');
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
   cedulaVal,
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

adminControllers.renderServices = async (req, res) => {
   const {
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      photoProfile,
   } = req.user;

   let /*nowFecha = moment()
         .format('YYYY-MM-DD'),*/
      est = (estado == 'Enabled') ? true : false;
   
   res.render('admin/services', {
      cedula, apellidos, nombres, privilegio, estado, photoProfile,
      est,
   });
};

adminControllers.searchUsers = async (req, res) => {
   let usersFind;

   try {
      usersFind = await connectionDB.query(` SELECT
                                                cedula, apellidos, nombres, email, privilegio, estado
                                             FROM usuarios
                                             WHERE cedula != ?`, req.user.cedula);
      
      res.json(usersFind);
   } catch (e) {
      console.log(e);
   }
};

adminControllers.saveNewUser = async (req, res) => {
   const {
      cedula,
      apellidos,
      nombres,
      fech_nacimiento,
      genero,
      telefono,
      email,
      privilegio
   } = req.body;

   let errors = 0,
      transporte, 
      info,
      cedulaN = cedula.trim(),
      apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      fech_nacimientoN = fech_nacimiento.trim(),
      generoN = genero.trim(),
      telefonoN = telefono.trim(),
      emailN = email.trim(),
      privilegioN = privilegio.trim();

   if (
      cedulaN === '' || 
      apellidosN === '' || 
      nombresN === '' || 
      fech_nacimientoN === '' || 
      generoN === '' || 
      telefonoN === '' || 
      emailN === '' || 
      privilegioN === ''
   ) {
      res.json({
         res: 'icon',
         icon: 'info',
         tittle: 'CAMPOS VACIOS',
         description: 'Los campos no pueden ir vacios o con espacios.'
      });
   } else {
      errors += (!cedulaVal(cedulaN)) ? 1 : 0;
      errors += (!spaceLetersVer(apellidosN)) ? 1 : 0;
      errors += (!spaceLetersVer(nombresN)) ? 1 : 0;
      errors += (!moment(fech_nacimientoN).isValid()) ? 1 : 0;
      errors += (!spaceLetersVer(generoN)) ? 1 : 0;
      errors += (!numbersVer(telefonoN)) ? 1 : 0;
      errors += (!emailVer(emailN)) ? 1 : 0;
      errors += (!spaceLetersVer(privilegioN)) ? 1 : 0;

      if (errors > 0) {
         res.json({
            res: 'icon',
            icon: 'error',
            tittle: 'DATOS INCORRECTOS',
            description: 'Los tipos de datos solicitados y enviados son incorrectos.'
         });
      } else {
         try {
            const reviewUser = await connectionDB.query(`SELECT cedula 
                                                         FROM usuarios 
                                                         WHERE cedula = ?`, cedulaN);
            // console.log(reviewUser);

            if (reviewUser.length > 0) {
               res.json({
                  res: 'icon',
                  tittle: 'USUARIO YA REGISTRADO',
                  icon: 'info',
                  description: 'El usuario con la cédula a registrar ya se encuentra en el sistema.'
               });
            } else {
               let passEncrypt = await encryptPassword(cedulaN);

               const newUser = {
                  cedula: cedulaN,
                  apellidos: apellidosN,
                  nombres: nombresN,
                  fechNacimiento: fech_nacimientoN,
                  genero: generoN,
                  telefono: telefonoN,
                  email: emailN,
                  password: passEncrypt,
                  privilegio: privilegioN,
                  estado: 'Enabled',
                  photoProfile: 'profile.svg'
               };

               const userSave = await connectionDB.query(`INSERT 
                                                         INTO usuarios
                                                         SET ?`, [newUser]);
               // console.log(userSave);

               if (userSave.affectedRows === 1) {
                  try {
                     transporte = nodemailer.createTransport({
                        host: 'mail.privateemail.com',
                        port: 587,
                        secure: false,
                        auth: {
                           user: `${process.env.userMail}`,
                           pass: `${process.env.passMail}`
                        },
                        tls: {
                           rejectUnauthorized: false
                        }
                     });
                  
                     info = await transporte.sendMail({
                        from: `Santa María Madre <${process.env.userMail}>`,
                        to: `${emailN}`,
                        subject: 'Registro exitoso',
                        html: require('../templates/emails/newUser.tpl')({
                           nameUser: `${nombresN} ${apellidosN}`,
                           passNew: `${cedulaN}`
                        })
                     });
   
                     console.log(info.response);
                  }
                  catch (e) {
                     console.log(e);
                  }

                  res.json({
                     res: 'img',
                     icon: '/img/SMMIglesia.png',
                     tittle: 'USUARIO REGISTRADO',
                     description: 'Se ha registrado un nuevo usuario con éxito.'
                  });
               } else {
                  res.json({
                     res: 'icon',
                     tittle: 'USUARIO NO REGISTRADO',
                     icon: 'error',
                     description: 'Upss! No se ha podido registrar al nuevo usuario.'
                  });
               }
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

adminControllers.searchOneUser = async (req, res) => {
   const {
      cedula
   } = req.query;

   let cedulaN = cedula.trim();

   if (
      cedulaN === ''
   ) {
      res.json({
         res: 'icon',
         icon: 'info',
         tittle: 'CAMPOS VACIOS',
         description: 'Los campos no pueden ir vacios o con espacios.'
      });
   } else {
      if (!cedulaVal(cedulaN)) {
         res.json({
            res: 'icon',
            icon: 'error',
            tittle: 'CÉDULA INCORRECTA',
            description: 'La cédula es incorrecta o no válida.'
         });
      } else {
         const searchData = await connectionDB.query(`SELECT
                                                         cedula, apellidos, nombres, privilegio, fechNacimiento, genero, telefono, email, estado
                                                      FROM usuarios 
                                                      WHERE cedula = ?`, cedulaN);
         // console.log(searchData);

         if (searchData.length > 0) {
            res.json({
               res: 'data',
               searchData: searchData[0]
            });
         } else {
            res.json({
               res: 'icon',
               icon: 'error',
               tittle: 'USUARIO NO ENCONTRADO',
               description: 'El usuario no se encuntra registrado en el sistema.'
            });
         }
      }
   }
};

adminControllers.updateUser = async (req, res) => {
   const {
      cedula,
      apellidos,
      nombres,
      fech_nacimiento,
      genero,
      telefono,
      email,
      privilegio
   } = req.body;

   let errors = 0,
      cedulaN = cedula.trim(),
      apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      fech_nacimientoN = fech_nacimiento.trim(),
      generoN = genero.trim(),
      telefonoN = telefono.trim(),
      emailN = email.trim(),
      privilegioN = privilegio.trim();

   if (
      cedulaN === '' || 
      apellidosN === '' || 
      nombresN === '' || 
      fech_nacimientoN === '' || 
      generoN === '' || 
      telefonoN === '' || 
      emailN === '' || 
      privilegioN === ''
   ) {
      res.json({
         res: 'icon',
         icon: 'info',
         tittle: 'CAMPOS VACIOS',
         description: 'Los campos no pueden ir vacios o con espacios.'
      });
   } else {
      errors += (!cedulaVal(cedulaN)) ? 1 : 0;
      errors += (!spaceLetersVer(apellidosN)) ? 1 : 0;
      errors += (!spaceLetersVer(nombresN)) ? 1 : 0;
      errors += (!moment(fech_nacimientoN).isValid()) ? 1 : 0;
      errors += (!spaceLetersVer(generoN)) ? 1 : 0;
      errors += (!numbersVer(telefonoN)) ? 1 : 0;
      errors += (!emailVer(emailN)) ? 1 : 0;
      errors += (!spaceLetersVer(privilegioN)) ? 1 : 0;

      if (errors > 0) {
         res.json({
            res: 'icon',
            icon: 'error',
            tittle: 'DATOS INCORRECTOS',
            description: 'Los tipos de datos solicitados y enviados son incorrectos.'
         });
      } else {
         try {
            const updateUser = {
               apellidos: apellidosN,
               nombres: nombresN,
               fechNacimiento: fech_nacimientoN,
               genero: generoN,
               telefono: telefonoN,
               email: emailN,
               privilegio: privilegioN
            };

            const userUpdate = await connectionDB.query(`UPDATE usuarios 
                                                         SET ?
                                                         WHERE cedula = ?`, [updateUser, cedulaN]);
            // console.log(userUpdate);

            if (userUpdate.affectedRows > 0) {
               res.json({
                  res: 'img',
                  icon: '/img/SMMIglesia.png',
                  tittle: 'USUARIO ACTUALIZADO',
                  description: 'Se ha actualizado los datos del usuario con éxito.'
               });
            } else {
               res.json({
                  res: 'icon',
                  tittle: 'USUARIO NO ACTUALIZADO',
                  icon: 'error',
                  description: 'Upss! No se ha podido actualizar los datos del usuario.'
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

adminControllers.generatePassword = async (req, res) => {
   const {
      cedula
   } = req.body;

   let errors = 0,
      transporte, 
      info,
      cedulaN = cedula.trim();

   if (
      cedulaN === ''
   ) {
      res.json({
         res: 'icon',
         icon: 'info',
         tittle: 'CAMPOS VACIOS',
         description: 'Los campos no pueden ir vacios o con espacios.'
      });
   } else {
      errors += (!cedulaVal(cedulaN)) ? 1 : 0;

      if (errors > 0) {
         res.json({
            res: 'icon',
            icon: 'error',
            tittle: 'CÉDULA INCORRECTA',
            description: 'Cédula incorrecta o no válida.'
         });
      } else {
         try {
            const reviewUser = await connectionDB.query(`SELECT * 
                                                         FROM usuarios 
                                                         WHERE cedula = ?`, cedulaN);
            // console.log(reviewUser);

            if (reviewUser.length > 0) {
               const passwordG = `SMMIglesia/${nanoid(10)}`;
               let passEncrypt = await encryptPassword(passwordG);

               const updatePass = {
                  password: passEncrypt
               };

               const saveNewPass = await connectionDB.query(`UPDATE usuarios 
                                                            SET ?
                                                            WHERE cedula = ?`, [updatePass, cedulaN]);
               // console.log(saveNewPass);

               if (saveNewPass.affectedRows > 0) {
                  try {
                     transporte = nodemailer.createTransport({
                        host: 'mail.privateemail.com',
                        port: 587,
                        secure: false,
                        auth: {
                           user: `${process.env.userMail}`,
                           pass: `${process.env.passMail}`
                        },
                        tls: {
                           rejectUnauthorized: false
                        }
                     });
                  
                     info = await transporte.sendMail({
                        from: `Santa María Madre <${process.env.userMail}>`,
                        to: `${reviewUser[0].email}`,
                        subject: 'Contraseña generada',
                        html: require('../templates/emails/newPassword.tpl')({
                           nameUser: `${reviewUser[0].nombres} ${reviewUser[0].apellidos}`,
                           passNew: `${passwordG}`
                        })
                     });
   
                     console.log(info.response);
                  }
                  catch (e) {
                     console.log(e);
                  }

                  res.json({
                     res: 'img',
                     icon: '/img/SMMIglesia.png',
                     tittle: 'CONTRASEÑA GENERADA',
                     description: 'Se ha generado la nueva contraseña con éxito.'
                  });
               } else {
                  res.json({
                     res: 'icon',
                     tittle: 'CONTRASEÑA NO GENERADA',
                     icon: 'error',
                     description: 'Upss! No se ha podido generar la nueva contraseña.'
                  });
               }
               
            } else {
               res.json({
                  res: 'icon',
                  tittle: 'USUARIO NO ENCONTRADO',
                  icon: 'info',
                  description: 'El usuario no se encuentra registrado dentro del sistema.'
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

adminControllers.changeEstado = async (req, res) => {
   const {
      cedula
   } = req.body;

   let errors = 0,
      transporte, 
      info,
      cedulaN = cedula.trim();

   if (
      cedulaN === ''
   ) {
      res.json({
         res: 'icon',
         icon: 'info',
         tittle: 'CAMPOS VACIOS',
         description: 'Los campos no pueden ir vacios o con espacios.'
      });
   } else {
      errors += (!cedulaVal(cedulaN)) ? 1 : 0;

      if (errors > 0) {
         res.json({
            res: 'icon',
            icon: 'error',
            tittle: 'CÉDULA INCORRECTA',
            description: 'Cédula incorrecta o no válida.'
         });
      } else {
         try {
            const reviewUser = await connectionDB.query(`SELECT * 
                                                         FROM usuarios 
                                                         WHERE cedula = ?`, cedulaN);
            // console.log(reviewUser);

            if (reviewUser.length > 0) {
               const newEstado = 
                  (reviewUser[0].estado === 'Enabled')
                     ? 'Disabled'
                     : 'Enabled';
               
               const estadoSend = 
                     (reviewUser[0].estado === 'Enabled')
                        ? 'Desactivada'
                        : 'Activada';

               const updateEst = {
                  estado: newEstado
               };

               const saveNewEst = await connectionDB.query(`UPDATE usuarios 
                                                            SET ?
                                                            WHERE cedula = ?`, [updateEst, cedulaN]);
               // console.log(saveNewEst);

               if (saveNewEst.affectedRows > 0) {
                  try {
                     transporte = nodemailer.createTransport({
                        host: 'mail.privateemail.com',
                        port: 587,
                        secure: false,
                        auth: {
                           user: `${process.env.userMail}`,
                           pass: `${process.env.passMail}`
                        },
                        tls: {
                           rejectUnauthorized: false
                        }
                     });
                  
                     info = await transporte.sendMail({
                        from: `Santa María Madre <${process.env.userMail}>`,
                        to: `${reviewUser[0].email}`,
                        subject: `Cuenta ${estadoSend}`,
                        html: require('../templates/emails/changeEstado.tpl')({
                           nameUser: `${reviewUser[0].nombres} ${reviewUser[0].apellidos}`,
                           estadoNew: `${estadoSend}`
                        })
                     });
   
                     console.log(info.response);
                  }
                  catch (e) {
                     console.log(e);
                  }

                  res.json({
                     res: 'img',
                     icon: '/img/SMMIglesia.png',
                     tittle: `CUENTA ${estadoSend.toUpperCase()}`,
                     description: `La cuenta de <b>${reviewUser[0].nombres} ${reviewUser[0].apellidos}</b> ha sido <b>${estadoSend}</b>.`
                  });
               } else {
                  res.json({
                     res: 'icon',
                     tittle: 'CONTRASEÑA NO GENERADA',
                     icon: 'error',
                     description: 'Upss! No se ha podido generar la nueva contraseña.'
                  });
               }
               
            } else {
               res.json({
                  res: 'icon',
                  tittle: 'SERVER ERROR',
                  icon: 'error',
                  description: 'Upss! Error interno x_x. Intentelo más luego.'
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
const { nanoid } = require('nanoid');
const nodemailer = require('nodemailer');
const path = require('path');
const fse = require('fs-extra');
const pdf = require('pdf-creator-node');
const configPDF  = require('../helpers/optionsPDF');
const moment = require('moment');
moment.locale('es');

const secretariaControllers = {};

const connectionDB = require('../database');

const {
   encryptPassword,
   matchPassword
} = require('../helpers/encryptPass');

const {
   cedulaVal,
   numbersVer,
   spaceLetersVer,
   verNumberAndLetters,
   emailVer
} = require('../helpers/validations');

secretariaControllers.redirectWelcome = async (req, res) => {
   res.redirect('/s/welcome');
};

secretariaControllers.renderWelcome = async (req, res) => {
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

   let est, ofr, bau, comu, conf, mat;

   est = (estado == 'Enabled') ? true : false;

   try {
      ofr = await connectionDB.query('SELECT COUNT(idOfrenda) AS numOF FROM ofrendas');
      ofr = ofr[0].numOF;

      bau = await connectionDB.query('SELECT COUNT(cedula) AS numOF FROM bautizo');
      bau = bau[0].numOF;

      comu = await connectionDB.query('SELECT COUNT(cedula) AS numOF FROM comunion');
      comu = comu[0].numOF;

      conf = await connectionDB.query('SELECT COUNT(cedula) AS numOF FROM confirmacion');
      conf = conf[0].numOF;

      mat = await connectionDB.query('SELECT COUNT(_id) AS numOF FROM matrimonio');
      mat = mat[0].numOF;
   } catch (e) {
      console.log(e);
   }

   res.render('secretaria/welcome', {
      h, m, s,
      cedula, apellidos, nombres, privilegio, estado, photoProfile,
      est, ofr, bau, comu, conf, mat
   });
};

secretariaControllers.renderProfile = async (req, res) => {
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

   res.render('secretaria/profile', { 
      cedula, apellidos, nombres, fechNacimiento, genero, telefono, email, privilegio, estado, photoProfile,
      est
   });
};

secretariaControllers.photoProfile = async (req, res) => {
   if (!req.file) {
      if (req.file) {
         const tempPathFiles = req.file.path;
         await fse.unlink(tempPathFiles);   
      }

      req.flash('warning_msg', 'No se puede enviar imagenes vacias...');
      res.redirect('/s/prgfile');
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
                     res.redirect('/s/profile');
                  } else {
                     req.flash('error_msg', '¡Uppsss! No se ha podido actualizar la imagen de perfil...');
                     res.redirect('/s/profile');
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
            res.redirect('/s/profile');
         }
         
      } catch (e) {
         console.log(e);
            
         if (req.file) {
            const tempPathFiles = req.file.path;
            await fse.unlink(tempPathFiles);   
         }

         req.flash('error_msg', '¡Uppsss! Error inesperado, inténtalo más luego x_x.');
         res.redirect('/s/profile');
      }
   }
};

secretariaControllers.dataProfile = async (req, res) => {
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

secretariaControllers.renderPassword = async (req, res) => {
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

   res.render('secretaria/password', {
      cedula, apellidos, nombres, privilegio, estado, photoProfile,
      est, nowFecha
   });
};

secretariaControllers.changePassword = async (req, res) => {
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
      res.render('secretaria/password', {
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
            res.render('secretaria/password', {
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
               res.redirect('/s/password');
            }
         }
      } catch (e) {
         req.flash('error_msg', '!Upsss¡ No se ha podido cambiar la contraseña...');
         res.redirect('/s/password');
      }
   }
};

secretariaControllers.renderOfrendas = async (req, res) => {
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

   res.render('secretaria/ofrendas', {
      cedula, apellidos, nombres, privilegio, estado, photoProfile,
      est, nowFecha
   });
};

secretariaControllers.getOfrendas = async (req, res) => {
   let searchOfrendas;

   try {
      searchOfrendas = await connectionDB
         .query(` SELECT 
                        idOfrenda, tipItencion, fechaOf, cedula, apellidos, nombres, telefono, estado
                  FROM ofrendas 
                  #WHERE tipItencion = "Ofrenda"
                  #ORDER BY fechaOf DESC
                  ORDER BY fechaOf ASC`);

      res.send(searchOfrendas);
   } catch (e) {
      console.log(e);
   }
};

secretariaControllers.changeEstOf = async (req, res) => {
   const {
      idOf,
      value
   } = req.body;

   let ID = idOf.trim(),
      estadoCh = value.trim(),
      estadoOf, changeEST, transporte, info;

   const estado = {
      'Aceptado': 'Aceptado',
      'No aceptado': 'No aceptado',
      // 'Pendiente': 'Pendiente',
      'Eliminar': 'Eliminada',
   };

   estadoCh = estado[estadoCh] || '';

   if (ID === '' || estadoCh === '') {
      res.json({
         tittle: 'CAMPOS VACÍOS',
         icon: 'info',
         description: 'Los campos no pueden ir vacíos o con espacios'
      });
   } else {
      try {
         const resultEs = await connectionDB.query(`SELECT *
                                                      FROM ofrendas
                                                      WHERE idOfrenda = ?`, ID);
         // console.log(resultEs[0]);

         if (resultEs[0].estado === 'Aceptado') {
            res.json({
               tittle: 'INTENCIÓN YA ACEPTADA',
               icon: '/img/SMMIglesia.png',
               description: 'La ofrenda o intención no se ha podido modificar porque ya ha sido <b style="text-transform: uppercase;">Aceptada</b>.'
            });
         } else {
            if (estadoCh === 'Eliminada') 
            {
               estadoOf = await connectionDB.query(`DELETE
                                                      FROM ofrendas
                                                      WHERE idOfrenda = ?`, ID);
                     
            } else {
               changeEST = await connectionDB.query(`UPDATE ofrendas
                                                         SET estado = ?
                                                         WHERE idOfrenda = ?`, [estadoCh, ID]);
            }
         
            if (estadoOf) {
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
                     to: resultEs[0].email,
                     subject: `Ofrenda o intención "${estadoCh}"`,
                     html: require('../templates/emails/ofrendas.tpl')({
                        nameUser: `${resultEs[0].nombres} ${resultEs[0].apellidos}`,
                        tipIntencion: resultEs[0].tipItencion,
                        aNameInt: resultEs[0].nameOf,
                        fechaInt: moment(resultEs[0].fechaOf).format('ll'),
                        horaInt: resultEs[0].horaOf,
                        estadoIn: estadoCh,
                     })
                  });
   
                  console.log(info.response);
               }
               catch (e) {
                  console.log(e);
               }

               res.json({
                  tittle: 'INTENCIÓN ELIMINADA',
                  icon: '/img/SMMIglesia.png',
                  description: 'La ofrenda o intención ha sido eliminada con éxito.'
               });
            } else {                  
               if (changeEST) {
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
                        from: `SMM Iglesia <${process.env.userMail}>`,
                        to: resultEs[0].email,
                        subject: `Ofrenda o intención "${estadoCh}"`,
                        html: require('../templates/emails/ofrendas.tpl')({
                           nameUser: `${resultEs[0].nombres} ${resultEs[0].apellidos}`,
                           tipIntencion: resultEs[0].tipItencion,
                           aNameInt: resultEs[0].nameOf,
                           fechaInt: moment(resultEs[0].fechaOf).format('ll'),
                           horaInt: resultEs[0].horaOf,
                           estadoInt: estadoCh,
                        })
                     });
      
                     console.log(info.response);
                  }
                  catch (e) {
                     console.log(e);
                  }

                  res.json({
                     tittle: 'INTENCIÓN ACTUALIZADA',
                     icon: '/img/SMMIglesia.png',
                     description: `El estado de la intencion ha cambiado a <b style="text-transform: uppercase;">${estadoCh}</b>.`
                  });
               } else {
                  res.json({
                     tittle: 'SERVER ERROR',
                     icon: 'error',
                     description: 'Upss! No se ha podido cambiar el estado de la ofrenda.'
                  });
               }
            }
         }
      } catch (e) {
         console.log(e);
         res.json({
            tittle: 'SERVER ERROR',
            icon: 'error',
            description: 'Upss! Error interno x_x. Intentelo más luego.'
         });
      }
   }
};

secretariaControllers.searchDatesOf = async (req, res) => {
   const {
      idOf
   } = req.query;

   let ID = idOf.trim();

   if (ID === '') {
      res.json({
         res: 'empty',
         tittle: 'CAMPOS VACÍOS',
         icon: 'info',
         description: 'Los campos no pueden ir vacíos o con espacios'
      });
   } else {
      try {
         const dateOF = await connectionDB.query(` SELECT * 
                                                   FROM ofrendas 
                                                   WHERE idOfrenda = ?`, [ID]);

         if (dateOF.length > 0) {
            res.json({
               res: 'data',
               data: dateOF[0]
            });
         } else {
            res.json({
               res: 'empty',
               tittle: 'OFRENDA NO ENCONTRADA',
               icon: 'warning',
               description: 'La petición no ha sido encontrada, verifique el ID.'
            });                              
         }
      } catch (e) {
         console.log(e);
         res.json({
            res: 'empty',
            tittle: 'SERVER ERROR',
            icon: 'error',
            description: 'Upss! No se ha podido cambiar el estado de la ofrenda.'
         });
      }
   }
};

secretariaControllers.renderEventos = async (req, res) => {
   const {
      cedula,
      apellidos,
      nombres,
      privilegio,
      estado,
      photoProfile,
   } = req.user;

   let listEvents,
      nowFecha = moment()
         .format('YYYY-MM-DD'),
      est = (estado == 'Enabled') ? true : false;

   try {
      listEvents = await connectionDB.query(`SELECT * 
                                             FROM eventos
                                             ORDER BY fecha ASC`);
   } catch (e) {
      console.log(e);
      req.flash('error_msg', 'No se ha podido cargar el contenido...');
      res.redirect('/s/welcome');
   }

   res.render('secretaria/eventos', {
      cedula, apellidos, nombres, privilegio, estado, photoProfile,
      est, nowFecha,
      listEvents
   });
};

secretariaControllers.saveEvento = async (req, res) => {
   const {
      colorEv,
      fechaEv,
      tittleEv,
      descriptionEv
   } = req.body;

   var colorEvents = colorEv.trim(),
      fechaEvents = fechaEv.trim(),
      tittleEvents = tittleEv.trim(),
      descriptionEvents = descriptionEv.trim();

   if (fechaEvents == '' || tittleEvents == '' || descriptionEvents == '' || colorEvents == '') {
      res.json({
         res: 'icon',
         tittle: 'CAMPOS VACÍOS',
         icon: 'info',
         description: 'Los campos no pueden ir vacíos o con espacios'
      });
   } else {
      const newEvents = {
         color: colorEvents,
         fecha: fechaEvents,
         tittle: tittleEvents,
         descripcion: descriptionEvents,
         images: 'notImage.png',
         cedUser: req.user.cedula
      };

      try {
         const saveEvents = await connectionDB.query('INSERT INTO eventos SET ?', [newEvents]);
         // console.log(saveEvents);

         if (saveEvents.affectedRows === 1) {
            res.json({
               res: 'img',
               tittle: 'EVENTO PUBLICADO',
               icon: '/img/SMMIglesia.png',
               description: 'El evento ha sido guardado y publicado con éxito.'
            });
         } else {
            res.json({
               res: 'icon',
               tittle: 'SERVER ERROR',
               icon: 'error',
               description: 'Upss! No se ha podido guardar el evento.'
            });
         }
      } catch (error) {
         res.json({
            res: 'icon',
            tittle: 'SERVER ERROR',
            icon: 'error',
            description: 'Upss! Error interno x_x. Intentelo más luego.'
         });
      }
   }
};

secretariaControllers.deleteEvento = async (req, res) => {
   const {
      idEvent
   } = req.body;
   
   var idEv = idEvent.trim();

   if (idEvent == '') {
      res.json({
         res: 'icon',
         tittle: 'CAMPOS VACÍOS',
         icon: 'info',
         description: 'Los campos no pueden ir vacíos o con espacios'
      });
   } else {
      try {
         const deleteEven = await connectionDB.query(`DELETE 
                                                      FROM eventos 
                                                      WHERE ID = ?`, idEv);
         // console.log(deleteEven);

         if (deleteEven.affectedRows === 1) {
            res.json({
               res: 'img',
               tittle: 'EVENTO ELIMINADO',
               icon: '/img/SMMIglesia.png',
               description: 'El evento ha sido eliminado con éxito.'
            });
         } else {
            res.json({
               res: 'icon',
               tittle: 'ERROR DELETE',
               icon: 'error',
               description: 'Upss! No se ha podido eliminar el evento.'
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
};

secretariaControllers.searchEvento = async (req, res) => {
   const {
      idEvent
   } = req.query;

   try {
      const resEvent = await connectionDB.query(`SELECT * 
                                                FROM eventos 
                                                WHERE id = ?`, idEvent);
      // console.log(resEvent[0]);
      
      if (resEvent) {
         res.json({
            res: 'data',
            data: resEvent[0]
         });
      } else {
         res.json({
            res: 'not data',
            tittle: 'EVENTO NO ENCONTRADO',
            icon: 'info',
            description: 'Upss! El evento a buscar no existe.'
         });
      }
   } catch (e) {
      console.log(e);
      res.json({
         res: 'not data',
         tittle: 'SERVER ERROR',
         icon: 'error',
         description: 'Upss! Error interno x_x. Intentelo más luego.'
      });
   }
};

secretariaControllers.updateEvento = async (req, res) => {
   const {
      idEv,
      colorEv,
      fechaEv,
      tittleEv,
      descriptionEv
   } = req.body;

   var idEvents = idEv.trim(),
      colorEvents = colorEv.trim(),
      fechaEvents = fechaEv.trim(),
      tittleEvents = tittleEv.trim(),
      descriptionEvents = descriptionEv.trim();

   if (idEvents === '' || fechaEvents === '' || tittleEvents === '' || descriptionEvents === '' || colorEvents === '') {
      res.json({
         res: 'icon',
         tittle: 'CAMPOS VACÍOS',
         icon: 'info',
         description: 'Los campos no pueden ir vacíos o con espacios'
      });
   } else {
      const updateEvents = {
         color: colorEvents,
         fecha: fechaEvents,
         tittle: tittleEvents,
         descripcion: descriptionEvents,
         // images: 'notImage.png',
         cedUser: req.user.cedula
      };

      try {
         const saveEvents = await connectionDB.query(`UPDATE eventos 
                                                      SET ?
                                                      WHERE id = ?`, [updateEvents, idEvents]);
         // console.log(saveEvents);

         if (saveEvents.affectedRows === 1) {
            res.json({
               res: 'img',
               tittle: 'EVENTO ACTUALIZADO',
               icon: '/img/SMMIglesia.png',
               description: 'El evento ha sido actualizado y publicado con éxito.'
            });
         } else {
            res.json({
               res: 'icon',
               tittle: 'SERVER ERROR',
               icon: 'error',
               description: 'Upss! No se ha podido actualizar el evento.'
            });
         }
      } catch (error) {
         res.json({
            res: 'icon',
            tittle: 'SERVER ERROR',
            icon: 'error',
            description: 'Upss! Error interno x_x. Intentelo más luego.'
         });
      }
   }
};

secretariaControllers.saveEventoFile = async (req, res) => {
   const {
      id_events
   } = req.body;

   let ID = id_events.trim();

   if (ID === '') {
      if (req.file) {
         const tempPathFiles = req.file.path;
         await fse.unlink(tempPathFiles);   
      }

      req.flash('warning_msg', 'Los campos no pueden vacios o con espacios...');
      res.redirect('/s/eventos');
   } else {
      if (!numbersVer(ID)) {
         if (req.file) {
            const tempPathFiles = req.file.path;
            await fse.unlink(tempPathFiles);   
         }

         req.flash('error_msg', 'Tipo de dato incorrecto...');
         res.redirect('/s/eventos');
      } else {
         try {
            const searchOf = await connectionDB.query(`SELECT id
                                                      FROM eventos
                                                      WHERE id = ?`, [ID]);
            // console.log(searchOf);

            if (searchOf.length > 0) {
               const nameIMG = `${nanoid(12)}`;

               const extFiles = path.extname(req.file.originalname).toLowerCase();
               
               if (extFiles === '.jpg' || extFiles === '.jpeg' || extFiles === '.png') {
                  const nameEndFiles = `${nameIMG}${extFiles}`;
                  const destinationFiles = path.resolve(`src/public/events/${nameEndFiles}`);
                  const tempPathFiles = req.file.path;
               
                  await fse.copy(tempPathFiles, destinationFiles);
               
                  const imgID = async () => {

                     const reviewIMG = await connectionDB.query(`SELECT images
                                                               FROM eventos
                                                               WHERE images = ?`, nameEndFiles);
                     // console.log(reviewIMG);

                     if (reviewIMG.length > 0) {
                        imgID();
                     } else {
                        const nameFileNew = {
                           images: nameEndFiles
                        };

                        const saveImage = await connectionDB.query(`UPDATE eventos 
                                                                  SET ?
                                                                  WHERE id = ?`, [nameFileNew, ID]);
                        // console.log(saveImage);
      
                        if (saveImage.affectedRows > 0) {
                           req.flash('success_msg', 'Imagen publicada con éxito...');
                           res.redirect('/s/eventos');
                        } else {
                           req.flash('error_msg', '¡Uppsss! No se ha podido guardar la imagen del evento...');
                           res.redirect('/s/eventos');
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
                  res.redirect('/s/eventos');
               }
            } else {
               if (req.file) {
                  const tempPathFiles = req.file.path;
                  await fse.unlink(tempPathFiles);   
               }

               req.flash('info_msg', '¡Uppsss! Evento no encontrado.');
               res.redirect('/s/eventos');
            }
         } catch (e) {
            console.log(e);
            
            if (req.file) {
               const tempPathFiles = req.file.path;
               await fse.unlink(tempPathFiles);   
            }

            req.flash('error_msg', '¡Uppsss! Error inesperado, inténtalo más luego x_x.');
            res.redirect('/s/eventos');
         }
      }
   }
};

secretariaControllers.renderBautizo = async (req, res) => {
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
   
   res.render('secretaria/bautizo', {
      cedula, apellidos, nombres, privilegio, estado, photoProfile,
      est,
   });
};

secretariaControllers.getBautizos = async (req, res) => {
   let listBautizos;

   try {
      listBautizos = await connectionDB.query(` SELECT 
                                                      cedula, apellidos, nombres, fechaBautizo,nameSacerdote, anioRParroquial, tomoRParroquial, paginaRParroquial, numeroRParroquial
                                                FROM bautizo`);

      res.json(
         listBautizos
      );
   } catch (e) {
      console.log(e);
   }
};

secretariaControllers.saveBautizo = async (req, res) => {
   const {
      cedula,
      dateBautizo,
      apellidos,
      nombres,
      homeNacimiento,
      dateNacimiento,
      nameFather,
      nameMother,
      namePadrino,
      nameMadrina,
      nameSacerdote,
      anioParroquia,
      tomoParroquia,
      pageParroquia,
      numeroParroquia,
      ciudadRCivil,
      numeroRCivil,
      tomoRCivil,
      pageRCivil,
      numActaRCivil
   } = req.body;

   let errors = 0,
      cedulaN = cedula.trim(),
      dateBautizoN = dateBautizo.trim(),
      apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      homeNacimientoN = homeNacimiento.trim(),
      dateNacimientoN = dateNacimiento.trim(),
      nameFatherN = nameFather.trim(),
      nameMotherN = nameMother.trim(),
      namePadrinoN = namePadrino.trim(),
      nameMadrinaN = nameMadrina.trim(),
      nameSacerdoteN = nameSacerdote.trim(),
      anioParroquiaN = anioParroquia.trim(),
      tomoParroquiaN = tomoParroquia.trim(),
      pageParroquiaN = pageParroquia.trim(),
      numeroParroquiaN = numeroParroquia.trim(),
      ciudadRCivilN = ciudadRCivil.trim(),
      numeroRCivilN = numeroRCivil.trim(),
      tomoRCivilN = tomoRCivil.trim(),
      pageRCivilN = pageRCivil.trim(),
      numActaRCivilN = numActaRCivil.trim();

   if (
      cedulaN === '' || 
      dateBautizoN === '' || 
      apellidosN === '' || 
      nombresN === '' || 
      homeNacimientoN === '' || 
      dateNacimientoN === '' || 
      nameFatherN === '' || 
      nameMotherN === '' || 
      namePadrinoN === '' || 
      nameMadrinaN === '' || 
      nameSacerdoteN === '' || 
      anioParroquiaN === '' || 
      tomoParroquiaN === '' || 
      pageParroquiaN === '' || 
      numeroParroquiaN === '' || 
      ciudadRCivilN === '' || 
      numeroRCivilN === '' || 
      tomoRCivilN === '' || 
      pageRCivilN === '' || 
      numActaRCivilN === ''
   ) {
      res.json({
         res: 'icon',
         icon: 'info',
         tittle: 'CAMPOS VACIOS',
         description: 'Los campos no pueden ir vacios o con espacios.'
      });
   } else {
      errors += (!cedulaVal(cedulaN)) ? 1 : 0;
      errors += (!moment(dateBautizoN).isValid()) ? 1 : 0;
      errors += (!spaceLetersVer(apellidosN)) ? 1 : 0;
      errors += (!spaceLetersVer(nombresN)) ? 1 : 0;
      errors += (!verNumberAndLetters(homeNacimientoN)) ? 1 : 0;
      errors += (!moment(dateNacimientoN).isValid()) ? 1 : 0;
      errors += (!spaceLetersVer(nameFatherN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMotherN)) ? 1 : 0;
      errors += (!spaceLetersVer(namePadrinoN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMadrinaN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameSacerdoteN)) ? 1 : 0;
      errors += (!numbersVer(anioParroquiaN)) ? 1 : 0;
      errors += (!numbersVer(tomoParroquiaN)) ? 1 : 0;
      errors += (!numbersVer(pageParroquiaN)) ? 1 : 0;
      errors += (!numbersVer(numeroParroquiaN)) ? 1 : 0;
      errors += (!verNumberAndLetters(ciudadRCivilN)) ? 1 : 0;
      errors += (!numbersVer(numeroRCivilN)) ? 1 : 0;
      errors += (!numbersVer(tomoRCivilN)) ? 1 : 0;
      errors += (!numbersVer(pageRCivilN)) ? 1 : 0;
      errors += (!numbersVer(numActaRCivilN)) ? 1 : 0;

      if (errors > 0) {
         res.json({
            res: 'icon',
            icon: 'error',
            tittle: 'DATOS INCORRECTOS',
            description: 'Los tipos de datos solicitados y enviados son incorrectos.'
         });
      } else {
         try {
            const searchData = await connectionDB.query(`SELECT *
                                                         FROM bautizo
                                                         WHERE cedula = ?`, cedulaN);

            if (searchData.length > 0) {
               res.json({
                  res: 'icon',
                  tittle: 'ACTA YA REGISTRADA',
                  icon: 'info',
                  description: 'Upss! Ya existe una acta con esa cédula, no podrá registrarla nuevamente.'
               });
            } else {
               const newBautizo = {
                  cedula: cedulaN,
                  apellidos: apellidosN,
                  nombres: nombresN,
                  lugarNacimiento: homeNacimientoN,
                  fechaNacimiento: dateNacimientoN,
                  namePadre: nameFatherN,
                  nameMadre: nameMotherN,
                  namePadrino: namePadrinoN,
                  nameMadrina: nameMadrinaN,
                  nameSacerdote: nameSacerdoteN,
                  fechaBautizo: dateBautizoN,
                  anioRParroquial: anioParroquiaN,
                  tomoRParroquial: tomoParroquiaN,
                  paginaRParroquial: pageParroquiaN,
                  numeroRParroquial: numeroParroquiaN,
                  ciudadRCivil: ciudadRCivilN,
                  numeroRCivil: numeroRCivilN,
                  tomoRCivil: tomoRCivilN,
                  paginaRCivil: pageRCivilN,
                  numeroActaRCivil: numActaRCivilN,
                  idCedula: req.user.cedula
               };
   
               const saveBautizo = await connectionDB.query(`INSERT INTO bautizo 
                                                               SET ?`, [newBautizo]);
               // console.log(saveBautizo);
   
               if (saveBautizo.affectedRows === 1) {
                  res.json({
                     res: 'img',
                     icon: '/img/SMMIglesia.png',
                     tittle: 'DATOS CORRECTOS',
                     description: 'Se ha guardado con éxito los datos del bautizo.'
                  });
               } else {
                  res.json({
                     res: 'icon',
                     tittle: 'DATOS NO GUARDADOS',
                     icon: 'error',
                     description: 'Upss! No se ha guardado los datos en la DB.'
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

secretariaControllers.searchBautizo = async (req, res) => {
   const {
      cedula
   } = req.query;

   let DNI = cedula.trim();

   if (DNI === '') {
      res.json({
         res: 'notData',
         icon: 'info',
         tittle: 'CAMPOS VACIOS',
         description: 'Los campos no pueden ir vacios o con espacios.'
      });
   } else {
      try {
         const searchData = await connectionDB.query(`SELECT *
                                                      FROM bautizo
                                                      WHERE cedula = ?`, DNI);

         if (searchData.length > 0) {
            res.json({
               res: 'data',
               searchData: searchData[0]
            });
         } else {
            res.json({
               res: 'notData',
               tittle: 'ACTA NO ENCONTRADA',
               icon: 'error',
               description: 'Upss! No existe ningún registro con ese ID.'
            });                                      
         }
      } catch (e) {
         console.log(e);
         res.json({
            res: 'notData',
            tittle: 'SERVER ERROR',
            icon: 'error',
            description: 'Upss! Error interno x_x. Intentelo más luego.'
         });
      }
   }
};

secretariaControllers.updateBautizo = async (req, res) => {
   const {
      cedula,
      apellidos,
      nombres,
      homeNacimiento,
      dateNacimiento,
      nameFather,
      nameMother,
      namePadrino,
      nameMadrina,
      nameSacerdote,
      dateBautizo,
      anioParroquia,
      tomoParroquia,
      pageParroquia,
      numeroParroquia,
      ciudadRCivil,
      numeroRCivil,
      tomoRCivil,
      pageRCivil,
      numActaRCivil
   } = req.body;

   let errors = 0,
      cedulaN = cedula.trim(),
      apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      homeNacimientoN = homeNacimiento.trim(),
      dateNacimientoN = dateNacimiento.trim(),
      nameFatherN = nameFather.trim(),
      nameMotherN = nameMother.trim(),
      namePadrinoN = namePadrino.trim(),
      nameMadrinaN = nameMadrina.trim(),
      nameSacerdoteN = nameSacerdote.trim(),
      dateBautizoN = dateBautizo.trim(),
      anioParroquiaN = anioParroquia.trim(),
      tomoParroquiaN = tomoParroquia.trim(),
      pageParroquiaN = pageParroquia.trim(),
      numeroParroquiaN = numeroParroquia.trim(),
      ciudadRCivilN = ciudadRCivil.trim(),
      numeroRCivilN = numeroRCivil.trim(),
      tomoRCivilN = tomoRCivil.trim(),
      pageRCivilN = pageRCivil.trim(),
      numActaRCivilN = numActaRCivil.trim();

   if (
      cedulaN === '' || 
      apellidosN === '' || 
      nombresN === '' || 
      homeNacimientoN === '' || 
      dateNacimientoN === '' || 
      nameFatherN === '' || 
      nameMotherN === '' || 
      namePadrinoN === '' || 
      nameMadrinaN === '' || 
      nameSacerdoteN === '' || 
      dateBautizoN === '' || 
      anioParroquiaN === '' || 
      tomoParroquiaN === '' || 
      pageParroquiaN === '' || 
      numeroParroquiaN === '' || 
      ciudadRCivilN === '' || 
      numeroRCivilN === '' || 
      tomoRCivilN === '' || 
      pageRCivilN === '' || 
      numActaRCivilN === ''
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
      errors += (!verNumberAndLetters(homeNacimientoN)) ? 1 : 0;
      errors += (!moment(dateNacimientoN).isValid()) ? 1 : 0;
      errors += (!spaceLetersVer(nameFatherN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMotherN)) ? 1 : 0;
      errors += (!spaceLetersVer(namePadrinoN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMadrinaN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameSacerdoteN)) ? 1 : 0;
      errors += (!moment(dateBautizoN).isValid()) ? 1 : 0;
      errors += (!numbersVer(anioParroquiaN)) ? 1 : 0;
      errors += (!numbersVer(tomoParroquiaN)) ? 1 : 0;
      errors += (!numbersVer(pageParroquiaN)) ? 1 : 0;
      errors += (!numbersVer(numeroParroquiaN)) ? 1 : 0;
      errors += (!verNumberAndLetters(ciudadRCivilN)) ? 1 : 0;
      errors += (!numbersVer(numeroRCivilN)) ? 1 : 0;
      errors += (!numbersVer(tomoRCivilN)) ? 1 : 0;
      errors += (!numbersVer(pageRCivilN)) ? 1 : 0;
      errors += (!numbersVer(numActaRCivilN)) ? 1 : 0;

      if (errors > 0) {
         res.json({
            res: 'icon',
            icon: 'error',
            tittle: 'DATOS INCORRECTOS',
            description: 'Los tipos de datos solicitados y enviados son incorrectos.'
         });
      } else {
         try {
            const searchData = await connectionDB.query(`SELECT *
                                                         FROM bautizo
                                                         WHERE cedula = ?`, cedulaN);

            if (searchData.length > 0) {
               const updateBautizo = {
                  apellidos: apellidosN,
                  nombres: nombresN,
                  lugarNacimiento: homeNacimientoN,
                  fechaNacimiento: dateNacimientoN,
                  namePadre: nameFatherN,
                  nameMadre: nameMotherN,
                  namePadrino: namePadrinoN,
                  nameMadrina: nameMadrinaN,
                  nameSacerdote: nameSacerdoteN,
                  fechaBautizo: dateBautizoN,
                  anioRParroquial: anioParroquiaN,
                  tomoRParroquial: tomoParroquiaN,
                  paginaRParroquial: pageParroquiaN,
                  numeroRParroquial: numeroParroquiaN,
                  ciudadRCivil: ciudadRCivilN,
                  numeroRCivil: numeroRCivilN,
                  tomoRCivil: tomoRCivilN,
                  paginaRCivil: pageRCivilN,
                  numeroActaRCivil: numActaRCivilN,
                  idCedula: req.user.cedula
               };
   
               const updateSaveBau = await connectionDB.query(`UPDATE bautizo 
                                                               SET ?
                                                               WHERE cedula = ?`, [updateBautizo, cedulaN]);
               // console.log(updateSaveBau);
   
               if (updateSaveBau.affectedRows === 1) {
                  res.json({
                     res: 'img',
                     icon: '/img/SMMIglesia.png',
                     tittle: 'DATOS ACTUALIZADOS',
                     description: 'Los datos de la acta han sido actualizados con éxito.'
                  });
               } else {
                  res.json({
                     res: 'icon',
                     tittle: 'DATOS NO ACTUALIZADOS',
                     icon: 'error',
                     description: 'Upss! No se ha podido actualizar los datos de la acta.'
                  });
               }
            } else {
               res.json({
                  res: 'icon',
                  tittle: 'ACTA NO ENCONTRADA',
                  icon: 'error',
                  description: 'Upss! No existe ningún registro con esa cédula.'
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

secretariaControllers.deleteBautizo = async (req, res) => {
   const {
      cedula
   } = req.body;

   let errors = 0,
      DNI = cedula.trim();

   if (
      DNI === ''
   ) {
      res.json({
         res: 'icon',
         icon: 'info',
         tittle: 'CAMPOS VACIOS',
         description: 'Los campos no pueden ir vacios o con espacios.'
      });
   } else {
      errors += (!cedulaVal(DNI)) ? 1 : 0;

      if (errors > 0) {
         res.json({
            res: 'icon',
            icon: 'error',
            tittle: 'DATOS INCORRECTOS',
            description: 'Los tipos de datos solicitados y enviados son incorrectos.'
         });
      } else {
         try {
   
            const deleteBautizo = await connectionDB.query(`DELETE 
                                                            FROM bautizo 
                                                            WHERE cedula = ?`, DNI);
            // console.log(deleteBautizo);
   
            if (deleteBautizo.affectedRows === 1) {
               res.json({
                  res: 'img',
                  icon: '/img/SMMIglesia.png',
                  tittle: 'ACTA ELIMINADA',
                  description: 'Se ha eliminado el acta con éxito.'
               });
            } else {
               res.json({
                  res: 'icon',
                  tittle: 'ACTA NO ELIMINADA',
                  icon: 'error',
                  description: 'Upss! No se ha podido eliminar la acta seleccionada.'
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

secretariaControllers.downloadPDFBautizo = async (req, res) => {
   let errors = 0,
      idBauN = req.params.idBau.trim();

   if (
      idBauN === ''
   ) {
      req.flash('danger_msg', 'Los campos no pueden ir vacíos o con espacios...');
      res.redirect('/s/bautizos');
   } else {
      errors += (!cedulaVal(idBauN)) ? 1 : 0;

      if (errors > 0) {
         req.flash('danger_msg', 'Los tipos de datos solicitados y enviados son incorrectos.');
         res.redirect('/s/bautizos');
      } else {
         try {
   
            const dataBautizo = await connectionDB.query(`SELECT *
                                                         FROM bautizo
                                                         WHERE cedula = ?`, idBauN);
            // console.log(dataBautizo);
   
            if (!dataBautizo) {
               req.flash('danger_msg', 'La acta con el ID solicitado no existe.');
               res.redirect('/s/bautizos');
            } else {
               try {
                  const html = fse.readFileSync(path.join(__dirname, '../templates/docs/bautizo.html'), 'utf-8');

                  const paramsHTML = {
                     cedula: dataBautizo[0].cedula.toUpperCase(),
                     apellidos: dataBautizo[0].apellidos.toUpperCase(),
                     nombres: dataBautizo[0].nombres.toUpperCase(),
                     lugarNacimiento: dataBautizo[0].lugarNacimiento.replace(/\b\w/g, l => l.toUpperCase()),
                     fechaNacimiento: moment(dataBautizo[0].fechaNacimiento).format('LL'),
                     namePadre: dataBautizo[0].namePadre.toUpperCase(),
                     nameMadre: dataBautizo[0].nameMadre.toUpperCase(),
                     namePadrino: dataBautizo[0].namePadrino.toUpperCase(),
                     nameMadrina: dataBautizo[0].nameMadrina.toUpperCase(),
                     nameSacerdote: dataBautizo[0].nameSacerdote.toUpperCase(),
                     fechaBautizo: moment(dataBautizo[0].fechaBautizo).format('LL'),
                     anioRParroquial: dataBautizo[0].anioRParroquial,
                     tomoRParroquial: dataBautizo[0].tomoRParroquial,
                     paginaRParroquial: dataBautizo[0].paginaRParroquial,
                     numeroRParroquial: dataBautizo[0].numeroRParroquial,
                     ciudadRCivil: dataBautizo[0].ciudadRCivil.toUpperCase(),
                     numeroRCivil: dataBautizo[0].numeroRCivil,
                     tomoRCivil: dataBautizo[0].tomoRCivil,
                     paginaRCivil: dataBautizo[0].paginaRCivil,
                     numeroActaRCivil: dataBautizo[0].numeroActaRCivil,
                     nameSacerdoteNow: process.env.nameSacerdoteNow,
                     dateNow: moment().format('LL')
                  };

                  const filename = `${dataBautizo[0].apellidos} ${dataBautizo[0].nombres} - ${moment().format('MMM D, YYYY').replace(/\b\w/g, l => l.toUpperCase())}.pdf`;

                  const document = {
                     html: html,
                     data: {
                        data: paramsHTML
                     },
                     path: path.join(__dirname, '../actas/') + filename
                  };

                  await pdf.create(document, configPDF);

                  var data = path.join(__dirname, '../actas/' + filename);
                  res.download(data, filename);

               } catch (e) {
                  console.log(e);
               }
            }
         } catch (e) {
            console.log(e);
            req.flash('danger_msg', 'Upss! Error interno x_x. Intentelo más luego.');
            res.redirect('/s/bautizos');
         }
      }
   }
};

secretariaControllers.renderComunion = async (req, res) => {
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
   
   res.render('secretaria/comunion', {
      cedula, apellidos, nombres, privilegio, estado, photoProfile,
      est,
   });
};

secretariaControllers.getComuniones = async (req, res) => {
   let listComuniones;

   try {
      listComuniones = await connectionDB.query(` SELECT 
                                                      cedula, apellidos, nombres, anioSacramento, nameCatequista
                                                FROM comunion`);

      res.json(
         listComuniones
      );
   } catch (e) {
      console.log(e);
   }
};

secretariaControllers.saveComunion = async (req, res) => {
   const {
      cedula,
      apellidos,
      nombres,
      anioSacramento,
      nameFather,
      nameMother,
      namePadrino,
      nameMadrina,
      nameCatequista
   } = req.body;

   let errors = 0,
      cedulaN = cedula.trim(),
      apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      anioSacramentoN = anioSacramento.trim(),
      nameFatherN = nameFather.trim(),
      nameMotherN = nameMother.trim(),
      namePadrinoN = namePadrino.trim(),
      nameMadrinaN = nameMadrina.trim(),
      nameCatequistaN = nameCatequista.trim();

   if (
      cedulaN === '' || 
      apellidosN === '' || 
      nombresN === '' || 
      anioSacramentoN === '' || 
      nameFatherN === '' || 
      nameMotherN === '' || 
      namePadrinoN === '' || 
      nameMadrinaN === '' || 
      nameCatequistaN === ''
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
      errors += (!numbersVer(anioSacramentoN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameFatherN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMotherN)) ? 1 : 0;
      errors += (!spaceLetersVer(namePadrinoN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMadrinaN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameCatequistaN)) ? 1 : 0;

      if (errors > 0) {
         res.json({
            res: 'icon',
            icon: 'error',
            tittle: 'DATOS INCORRECTOS',
            description: 'Los tipos de datos solicitados y enviados son incorrectos.'
         });
      } else {
         try {
            const verActaCom = await connectionDB.query(`SELECT cedula
                                                         FROM comunion
                                                         WHERE cedula = ?`, [cedulaN]);
            // console.log(verActaCom);

            if (verActaCom.length > 0) {
               res.json({
                  res: 'icon',
                  icon: 'error',
                  tittle: 'ACTA YA REGISTRADA',
                  description: 'El acta a ingresar ya ha sido ingresada.'
               });
            } else {
               const newComunion = {
                  cedula: cedulaN,
                  apellidos: apellidosN,
                  nombres: nombresN,
                  anioSacramento: anioSacramentoN,
                  namePadre: nameFatherN,
                  nameMadre: nameMotherN,
                  namePadrino: namePadrinoN,
                  nameMadrina: nameMadrinaN,
                  nameCatequista: nameCatequistaN,
                  idCedula: req.user.cedula
               };
   
               const saveComunion = await connectionDB.query(`INSERT 
                                                               INTO comunion 
                                                               SET ?`, [newComunion]);
               // console.log(saveComunion);
   
               if (saveComunion.affectedRows === 1) {
                  res.json({
                     res: 'img',
                     icon: '/img/SMMIglesia.png',
                     tittle: 'DATOS CORRECTOS',
                     description: 'Se ha guardado con éxito los datos de comunión.'
                  });
               } else {
                  res.json({
                     res: 'icon',
                     tittle: 'DATOS NO GUARDADOS',
                     icon: 'error',
                     description: 'Upss! No se ha guardado los datos en la DB.'
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

secretariaControllers.searchComunion = async (req, res) => {
   const {
      cedula
   } = req.query;

   let ID = cedula.trim();

   if (ID === '') {
      res.json({
         res: 'notData',
         icon: 'info',
         tittle: 'CAMPOS VACIOS',
         description: 'Los campos no pueden ir vacios o con espacios.'
      });
   } else {
      try {
         const searchData = await connectionDB.query(`SELECT *
                                                      FROM comunion
                                                      WHERE cedula = ?`, ID);

         if (searchData.length > 0) {
            res.json({
               res: 'data',
               searchData: searchData[0]
            });
         } else {
            res.json({
               res: 'notData',
               tittle: 'ACTA NO ENCONTRADA',
               icon: 'error',
               description: 'Upss! No existe ningún registro con esa cédula.'
            });                                      
         }
      } catch (e) {
         console.log(e);
         res.json({
            res: 'notData',
            tittle: 'SERVER ERROR',
            icon: 'error',
            description: 'Upss! Error interno x_x. Intentelo más luego.'
         });
      }
   }
};

secretariaControllers.updateComunion = async (req, res) => {
   const {
      cedula,
      apellidos,
      nombres,
      anioSacramento,
      nameFather,
      nameMother,
      namePadrino,
      nameMadrina,
      nameCatequista
   } = req.body;

   let errors = 0,
      cedulaN = cedula.trim(),
      apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      anioSacramentoN = anioSacramento.trim(),
      nameFatherN = nameFather.trim(),
      nameMotherN = nameMother.trim(),
      namePadrinoN = namePadrino.trim(),
      nameMadrinaN = nameMadrina.trim(),
      nameCatequistaN = nameCatequista.trim();

   if (
      cedulaN === '' || 
      apellidosN === '' || 
      nombresN === '' || 
      anioSacramentoN === '' || 
      nameFatherN === '' || 
      nameMotherN === '' || 
      namePadrinoN === '' || 
      nameMadrinaN === '' || 
      nameCatequistaN === ''
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
      errors += (!numbersVer(anioSacramentoN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameFatherN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMotherN)) ? 1 : 0;
      errors += (!spaceLetersVer(namePadrinoN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMadrinaN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameCatequistaN)) ? 1 : 0;

      if (errors > 0) {
         res.json({
            res: 'icon',
            icon: 'error',
            tittle: 'DATOS INCORRECTOS',
            description: 'Los tipos de datos solicitados y enviados son incorrectos.'
         });
      } else {
         try {
            const searchData = await connectionDB.query(`SELECT *
                                                         FROM comunion
                                                         WHERE cedula = ?`, cedulaN);

            if (searchData.length > 0) {
               const updateComunion = {
                  apellidos: apellidosN,
                  nombres: nombresN,
                  anioSacramento: anioSacramentoN,
                  namePadre: nameFatherN,
                  nameMadre: nameMotherN,
                  namePadrino: namePadrinoN,
                  nameMadrina: nameMadrinaN,
                  nameCatequista: nameCatequistaN,
                  idCedula: req.user.cedula
               };
   
               const updateSaveCom = await connectionDB.query(`UPDATE comunion 
                                                               SET ?
                                                               WHERE cedula = ?`, [updateComunion, cedulaN]);
               // console.log(updateSaveCom);
   
               if (updateSaveCom.affectedRows === 1) {
                  res.json({
                     res: 'img',
                     icon: '/img/SMMIglesia.png',
                     tittle: 'DATOS ACTUALIZADOS',
                     description: 'Los datos de la acta han sido actualizados con éxito.'
                  });
               } else {
                  res.json({
                     res: 'icon',
                     tittle: 'DATOS NO ACTUALIZADOS',
                     icon: 'error',
                     description: 'Upss! No se ha podido actualizar los datos de la acta.'
                  });
               }
            } else {
               res.json({
                  res: 'icon',
                  tittle: 'ACTA NO ENCONTRADA',
                  icon: 'error',
                  description: 'Upss! No existe ningún registro con esa cédula.'
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

secretariaControllers.deleteComunion = async (req, res) => {
   const {
      cedula
   } = req.body;

   let errors = 0,
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
            tittle: 'DATOS INCORRECTOS',
            description: 'Los tipos de datos solicitados y enviados son incorrectos.'
         });
      } else {
         try {
   
            const deleteComunion = await connectionDB.query(`DELETE 
                                                            FROM comunion 
                                                            WHERE cedula = ?`, cedulaN);
            // console.log(deleteComunion);
   
            if (deleteComunion.affectedRows === 1) {
               res.json({
                  res: 'img',
                  icon: '/img/SMMIglesia.png',
                  tittle: 'ACTA ELIMINADA',
                  description: 'Se ha eliminado el acta de comunión con éxito.'
               });
            } else {
               res.json({
                  res: 'icon',
                  tittle: 'ACTA NO ELIMINADA',
                  icon: 'error',
                  description: 'Upss! No se ha podido eliminar la acta seleccionada.'
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

secretariaControllers.downloadPDFComunion = async (req, res) => {
   let errors = 0,
      idBauN = req.params.idBau.trim();

   if (
      idBauN === ''
   ) {
      req.flash('danger_msg', 'Los campos no pueden ir vacíos o con espacios...');
      res.redirect('/s/comuniones');
   } else {
      errors += (!cedulaVal(idBauN)) ? 1 : 0;

      if (errors > 0) {
         req.flash('danger_msg', 'Los tipos de datos solicitados y enviados son incorrectos.');
         res.redirect('/s/comuniones');
      } else {
         try {
   
            const dataComunion = await connectionDB.query(`SELECT *
                                                         FROM comunion
                                                         WHERE cedula = ?`, idBauN);
            // console.log(dataComunion);
   
            if (!dataComunion) {
               req.flash('danger_msg', 'La acta con el ID solicitado no existe.');
               res.redirect('/s/bautizos');
            } else {
               try {
                  const html = fse.readFileSync(path.join(__dirname, '../templates/docs/comunion.html'), 'utf-8');

                  const paramsHTML = {
                     cedula: dataComunion[0].cedula.toUpperCase(),
                     apellidos: dataComunion[0].apellidos.toUpperCase(),
                     nombres: dataComunion[0].nombres.toUpperCase(),
                     namePadre: dataComunion[0].namePadre.toUpperCase(),
                     nameMadre: dataComunion[0].nameMadre.toUpperCase(),
                     namePadrino: dataComunion[0].namePadrino.toUpperCase(),
                     nameMadrina: dataComunion[0].nameMadrina.toUpperCase(),
                     nameCatequista: dataComunion[0].nameCatequista.toUpperCase(),
                     anioSacramento: dataComunion[0].anioSacramento,
                     nameSacerdoteNow: process.env.nameSacerdoteNow,
                     dateNow: moment().format('LL')
                  };

                  const filename = `${dataComunion[0].apellidos} ${dataComunion[0].nombres} - ${moment().format('MMM D, YYYY').replace(/\b\w/g, l => l.toUpperCase())}.pdf`;

                  const document = {
                     html: html,
                     data: {
                        data: paramsHTML
                     },
                     path: path.join(__dirname, '../actas/') + filename
                  };

                  await pdf.create(document, configPDF);

                  var data = path.join(__dirname, '../actas/' + filename);
                  res.download(data, filename);

               } catch (e) {
                  console.log(e);
               }
            }
         } catch (e) {
            console.log(e);
            req.flash('danger_msg', 'Upss! Error interno x_x. Intentelo más luego.');
            res.redirect('/s/comuniones');
         }
      }
   }
};

secretariaControllers.renderConfirmacion = async (req, res) => {
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
   
   res.render('secretaria/confirmacion', {
      cedula, apellidos, nombres, privilegio, estado, photoProfile,
      est,
   });
};

secretariaControllers.getConfirmaciones = async (req, res) => {
   let listConfirmacion;

   try {
      listConfirmacion = await connectionDB.query(` SELECT 
                                                      cedula, apellidos, nombres, anioSacramento, nameMonsenior
                                                   FROM confirmacion`);

      res.json(
         listConfirmacion
      );
   } catch (e) {
      console.log(e);
   }
};

secretariaControllers.saveConfirmacion = async (req, res) => {
   const {
      cedula,
      apellidos,
      nombres,
      anioSacramento,
      namePadrino,
      nameMadrina,
      nameMonsenior,
      nameTemplo
   } = req.body;

   let errors = 0,
      cedulaN = cedula.trim(),
      apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      anioSacramentoN = anioSacramento.trim(),
      namePadrinoN = namePadrino.trim(),
      nameMadrinaN = nameMadrina.trim(),
      nameMonseniorN = nameMonsenior.trim(),
      nameTemploN = nameTemplo.trim();

   if (
      cedulaN === '' || 
      apellidosN === '' || 
      nombresN === '' || 
      anioSacramentoN === '' || 
      namePadrinoN === '' || 
      nameMadrinaN === '' || 
      nameMonseniorN === '' || 
      nameTemploN === ''
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
      errors += (!numbersVer(anioSacramentoN)) ? 1 : 0;
      errors += (!spaceLetersVer(namePadrinoN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMadrinaN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMonseniorN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameTemploN)) ? 1 : 0;

      if (errors > 0) {
         res.json({
            res: 'icon',
            icon: 'error',
            tittle: 'DATOS INCORRECTOS',
            description: 'Los tipos de datos solicitados y enviados son incorrectos.'
         });
      } else {
         try {
            const verActaCon = await connectionDB.query(`SELECT cedula
                                                         FROM confirmacion
                                                         WHERE cedula = ?`, [cedulaN]);
            // console.log(verActaCon);

            if (verActaCon.length > 0) {
               res.json({
                  res: 'icon',
                  icon: 'error',
                  tittle: 'ACTA YA REGISTRADA',
                  description: 'El acta a ingresar ya ha sido registrada.'
               });
            } else {
               const newConfirmacion = {
                  cedula: cedulaN,
                  apellidos: apellidosN,
                  nombres: nombresN,
                  anioSacramento: anioSacramentoN,
                  namePadrino: namePadrinoN,
                  nameMadrina: nameMadrinaN,
                  nameMonsenior: nameMonseniorN,
                  temploComunion: nameTemploN,
                  idCedula: req.user.cedula
               };
   
               const saveConfirmacion = await connectionDB.query(`INSERT 
                                                                  INTO confirmacion 
                                                                  SET ?`, [newConfirmacion]);
               // console.log(saveConfirmacion);
   
               if (saveConfirmacion.affectedRows === 1) {
                  res.json({
                     res: 'img',
                     icon: '/img/SMMIglesia.png',
                     tittle: 'DATOS CORRECTOS',
                     description: 'Se ha guardado con éxito los datos de la confirmación.'
                  });
               } else {
                  res.json({
                     res: 'icon',
                     tittle: 'DATOS NO GUARDADOS',
                     icon: 'error',
                     description: 'Upss! No se ha guardado los datos en la DB.'
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

secretariaControllers.searchConfirmacion = async (req, res) => {
   const {
      cedula
   } = req.query;

   let ID = cedula.trim();

   if (ID === '') {
      res.json({
         res: 'notData',
         icon: 'info',
         tittle: 'CAMPOS VACIOS',
         description: 'Los campos no pueden ir vacios o con espacios.'
      });
   } else {
      try {
         const searchData = await connectionDB.query(`SELECT *
                                                      FROM confirmacion
                                                      WHERE cedula = ?`, ID);

         if (searchData.length > 0) {
            res.json({
               res: 'data',
               searchData: searchData[0]
            });
         } else {
            res.json({
               res: 'notData',
               tittle: 'ACTA NO ENCONTRADA',
               icon: 'error',
               description: 'Upss! No existe ningún registro con esa cédula.'
            });                                      
         }
      } catch (e) {
         console.log(e);
         res.json({
            res: 'notData',
            tittle: 'SERVER ERROR',
            icon: 'error',
            description: 'Upss! Error interno x_x. Intentelo más luego.'
         });
      }
   }
};

secretariaControllers.updateConfirmacion = async (req, res) => {
   const {
      cedula,
      apellidos,
      nombres,
      anioSacramento,
      namePadrino,
      nameMadrina,
      nameMonsenior,
      nameTemplo
   } = req.body;

   let errors = 0,
      cedulaN = cedula.trim(),
      apellidosN = apellidos.trim(),
      nombresN = nombres.trim(),
      anioSacramentoN = anioSacramento.trim(),
      namePadrinoN = namePadrino.trim(),
      nameMadrinaN = nameMadrina.trim(),
      nameMonseniorN = nameMonsenior.trim(),
      nameTemploN = nameTemplo.trim();

   if (
      cedulaN === '' || 
      apellidosN === '' || 
      nombresN === '' || 
      anioSacramentoN === '' ||  
      namePadrinoN === '' || 
      nameMadrinaN === '' || 
      nameMonseniorN === '' || 
      nameTemploN === ''
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
      errors += (!numbersVer(anioSacramentoN)) ? 1 : 0;
      errors += (!spaceLetersVer(namePadrinoN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMadrinaN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMonseniorN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameTemploN)) ? 1 : 0;

      if (errors > 0) {
         res.json({
            res: 'icon',
            icon: 'error',
            tittle: 'DATOS INCORRECTOS',
            description: 'Los tipos de datos solicitados y enviados son incorrectos.'
         });
      } else {
         try {
            const searchData = await connectionDB.query(`SELECT *
                                                         FROM confirmacion
                                                         WHERE cedula = ?`, cedulaN);

            if (searchData.length > 0) {
               const updateConfirmacion = {
                  apellidos: apellidosN,
                  nombres: nombresN,
                  anioSacramento: anioSacramentoN,
                  namePadrino: namePadrinoN,
                  nameMadrina: nameMadrinaN,
                  nameMonsenior: nameMonseniorN,
                  temploComunion: nameTemploN,
                  idCedula: req.user.cedula
               };
   
               const updateSaveCon = await connectionDB.query(`UPDATE confirmacion 
                                                               SET ?
                                                               WHERE cedula = ?`, [updateConfirmacion, cedulaN]);
               // console.log(updateSaveCon);
   
               if (updateSaveCon.affectedRows === 1) {
                  res.json({
                     res: 'img',
                     icon: '/img/SMMIglesia.png',
                     tittle: 'DATOS ACTUALIZADOS',
                     description: 'Los datos de la acta han sido actualizados con éxito.'
                  });
               } else {
                  res.json({
                     res: 'icon',
                     tittle: 'DATOS NO ACTUALIZADOS',
                     icon: 'error',
                     description: 'Upss! No se ha podido actualizar los datos de la acta.'
                  });
               }
            } else {
               res.json({
                  res: 'icon',
                  tittle: 'ACTA NO ENCONTRADA',
                  icon: 'error',
                  description: 'Upss! No existe ningún registro con esa cédula.'
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

secretariaControllers.deleteConfirmacion = async (req, res) => {
   const {
      cedula
   } = req.body;

   let errors = 0,
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
            tittle: 'DATOS INCORRECTOS',
            description: 'Los tipos de datos solicitados y enviados son incorrectos.'
         });
      } else {
         try {
   
            const deleteConfirmacion = await connectionDB.query(`DELETE 
                                                            FROM confirmacion 
                                                            WHERE cedula = ?`, cedulaN);
            // console.log(deleteConfirmacion);
   
            if (deleteConfirmacion.affectedRows === 1) {
               res.json({
                  res: 'img',
                  icon: '/img/SMMIglesia.png',
                  tittle: 'ACTA ELIMINADA',
                  description: 'Se ha eliminado el acta de confirmación con éxito.'
               });
            } else {
               res.json({
                  res: 'icon',
                  tittle: 'ACTA NO ELIMINADA',
                  icon: 'error',
                  description: 'Upss! No se ha podido eliminar la acta seleccionada.'
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

secretariaControllers.downloadPDFConfirmacion = async (req, res) => {
   let errors = 0,
      idBauN = req.params.idBau.trim();

   if (
      idBauN === ''
   ) {
      req.flash('danger_msg', 'Los campos no pueden ir vacíos o con espacios...');
      res.redirect('/s/comuniones');
   } else {
      errors += (!cedulaVal(idBauN)) ? 1 : 0;

      if (errors > 0) {
         req.flash('danger_msg', 'Los tipos de datos solicitados y enviados son incorrectos.');
         res.redirect('/s/confirmaciones');
      } else {
         try {
   
            const dataConfirmacion = await connectionDB.query(`SELECT *
                                                         FROM confirmacion
                                                         WHERE cedula = ?`, idBauN);
            // console.log(dataConfirmacion);
   
            if (!dataConfirmacion) {
               req.flash('danger_msg', 'La acta con el ID solicitado no existe.');
               res.redirect('/s/confirmaciones');
            } else {
               try {
                  const html = fse.readFileSync(path.join(__dirname, '../templates/docs/confirmacion.html'), 'utf-8');

                  const paramsHTML = {
                     cedula: dataConfirmacion[0].cedula.toUpperCase(),
                     apellidos: dataConfirmacion[0].apellidos.toUpperCase(),
                     nombres: dataConfirmacion[0].nombres.toUpperCase(),
                     namePadrino: dataConfirmacion[0].namePadrino.toUpperCase(),
                     nameMadrina: dataConfirmacion[0].nameMadrina.toUpperCase(),
                     nameMonsenior: dataConfirmacion[0].nameMonsenior.toUpperCase(),
                     anioSacramento: dataConfirmacion[0].anioSacramento.toUpperCase(),
                     temploComunion: dataConfirmacion[0].temploComunion.toUpperCase(),
                     nameSacerdoteNow: process.env.nameSacerdoteNow,
                     dateNow: moment().format('LL')
                  };

                  const filename = `${dataConfirmacion[0].apellidos} ${dataConfirmacion[0].nombres} - ${moment().format('MMM D, YYYY').replace(/\b\w/g, l => l.toUpperCase())}.pdf`;

                  const document = {
                     html: html,
                     data: {
                        data: paramsHTML
                     },
                     path: path.join(__dirname, '../actas/') + filename
                  };

                  await pdf.create(document, configPDF);

                  var data = path.join(__dirname, '../actas/' + filename);
                  res.download(data, filename);

               } catch (e) {
                  console.log(e);
               }
            }
         } catch (e) {
            console.log(e);
            req.flash('danger_msg', 'Upss! Error interno x_x. Intentelo más luego.');
            res.redirect('/s/confirmaciones');
         }
      }
   }
};

secretariaControllers.renderMatrimonio = async (req, res) => {
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
   
   res.render('secretaria/matrimonio', {
      cedula, apellidos, nombres, privilegio, estado, photoProfile,
      est,
   });
};

secretariaControllers.getMatrimonios = async (req, res) => {
   let listMatrimonios;

   try {
      listMatrimonios = await connectionDB.query(` SELECT 
                                                      _id, nameEsposo, nameEsposa, fechaMatrimonio, nameSacerdote
                                                   FROM matrimonio`);

      res.json(
         listMatrimonios
      );
   } catch (e) {
      console.log(e);
   }
};

secretariaControllers.saveMatrimonio = async (req, res) => {
   const {
      fechaMatrimonio,
      nameSacerdote,
      nameEsposo,
      namePadreEsposo,
      nameMadreEsposo,
      nameEsposa,
      namePadreEsposa,
      nameMadreEsposa,
      namePadrino,
      nameMadrina,
      ciudadRCivil,
      anioRCivil,
      tomoRCivil,
      pageRCivil,
      numActaRCivil
   } = req.body;

   let errors = 0,
      fechaMatrimonioN = fechaMatrimonio.trim(),
      nameSacerdoteN = nameSacerdote.trim(),
      nameEsposoN = nameEsposo.trim(),
      namePadreEsposoN = namePadreEsposo.trim(),
      nameMadreEsposoN = nameMadreEsposo.trim(),
      nameEsposaN = nameEsposa.trim(),
      namePadreEsposaN = namePadreEsposa.trim(),
      nameMadreEsposaN = nameMadreEsposa.trim(),
      namePadrinoN = namePadrino.trim(),
      nameMadrinaN = nameMadrina.trim(),
      ciudadRCivilN = ciudadRCivil.trim(),
      anioRCivilN = anioRCivil.trim(),
      tomoRCivilN = tomoRCivil.trim(),
      pageRCivilN = pageRCivil.trim(),
      numeroActaRCivilN = numActaRCivil.trim();

   if (
      fechaMatrimonioN === '' || 
      nameSacerdoteN === '' || 
      nameEsposoN === '' || 
      namePadreEsposoN === '' || 
      nameMadreEsposoN === '' || 
      nameEsposaN === '' || 
      namePadreEsposaN === '' || 
      nameMadreEsposaN === '' || 
      namePadrinoN === '' || 
      nameMadrinaN === '' || 
      ciudadRCivilN === '' || 
      anioRCivilN === '' || 
      tomoRCivilN === '' || 
      pageRCivilN === '' || 
      numeroActaRCivilN === ''
   ) {
      res.json({
         res: 'icon',
         icon: 'info',
         tittle: 'CAMPOS VACIOS',
         description: 'Los campos no pueden ir vacios o con espacios.'
      });
   } else {
      errors += (!moment(fechaMatrimonioN).isValid()) ? 1 : 0;
      errors += (!spaceLetersVer(nameSacerdoteN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameEsposoN)) ? 1 : 0;
      errors += (!spaceLetersVer(namePadreEsposoN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMadreEsposoN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameEsposaN)) ? 1 : 0;
      errors += (!spaceLetersVer(namePadreEsposaN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMadreEsposaN)) ? 1 : 0;
      errors += (!spaceLetersVer(namePadrinoN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMadrinaN)) ? 1 : 0;
      errors += (!verNumberAndLetters(ciudadRCivil)) ? 1 : 0;
      errors += (!numbersVer(anioRCivilN)) ? 1 : 0;
      errors += (!numbersVer(tomoRCivilN)) ? 1 : 0;
      errors += (!numbersVer(pageRCivilN)) ? 1 : 0;
      errors += (!numbersVer(numeroActaRCivilN)) ? 1 : 0;

      if (errors > 0) {
         res.json({
            res: 'icon',
            icon: 'error',
            tittle: 'DATOS INCORRECTOS',
            description: 'Los tipos de datos solicitados y enviados son incorrectos.'
         });
      } else {
         try {
            const newMatrimonio = {
               fechaMatrimonio: fechaMatrimonioN,
               nameSacerdote: nameSacerdoteN,
               nameEsposo: nameEsposoN,
               namePadreEsposo: namePadreEsposoN,
               nameMadreEsposo: nameMadreEsposoN,
               nameEsposa: nameEsposaN,
               namePadreEsposa: namePadreEsposaN,
               nameMadreEsposa: nameMadreEsposaN,
               namePadrino: namePadrinoN,
               nameMadrina: nameMadrinaN,
               ciudadRCivil: ciudadRCivil,
               anioRCivil: anioRCivilN,
               tomoRCivil: tomoRCivilN,
               paginaRCivil: pageRCivilN,
               numeroActaRCivil: numeroActaRCivilN,
               idCedula: req.user.cedula
            };

            const saveMatrimonio = await connectionDB.query(`INSERT INTO matrimonio 
                                                            SET ?`, [newMatrimonio]);
            // console.log(saveMatrimonio);

            if (saveMatrimonio.affectedRows === 1) {
               res.json({
                  res: 'img',
                  icon: '/img/SMMIglesia.png',
                  tittle: 'DATOS CORRECTOS',
                  description: 'Se ha guardado con éxito los datos del matrimonio.'
               });
            } else {
               res.json({
                  res: 'icon',
                  tittle: 'DATOS NO GUARDADOS',
                  icon: 'error',
                  description: 'Upss! No se ha guardado los datos en la DB.'
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

secretariaControllers.searchMatrimonio = async (req, res) => {
   const {
      id
   } = req.query;

   let ID = id.trim();

   if (ID === '') {
      res.json({
         res: 'notData',
         icon: 'info',
         tittle: 'CAMPOS VACIOS',
         description: 'Los campos no pueden ir vacios o con espacios.'
      });
   } else {
      try {
         const searchData = await connectionDB.query(`SELECT *
                                                      FROM matrimonio
                                                      WHERE _id = ?`, ID);

         if (searchData.length > 0) {
            res.json({
               res: 'data',
               searchData: searchData[0]
            });
         } else {
            res.json({
               res: 'notData',
               tittle: 'ACTA NO ENCONTRADA',
               icon: 'error',
               description: 'Upss! No existe ningún registro con ese ID.'
            });                                      
         }
      } catch (e) {
         console.log(e);
         res.json({
            res: 'notData',
            tittle: 'SERVER ERROR',
            icon: 'error',
            description: 'Upss! Error interno x_x. Intentelo más luego.'
         });
      }
   }
};

secretariaControllers.updateMatrimonio = async (req, res) => {
   const {
      id,
      fechaMatrimonio,
      nameSacerdote,
      nameEsposo,
      namePadreEsposo,
      nameMadreEsposo,
      nameEsposa,
      namePadreEsposa,
      nameMadreEsposa,
      namePadrino,
      nameMadrina,
      ciudadRCivil,
      anioRCivil,
      tomoRCivil,
      pageRCivil,
      numActaRCivil
   } = req.body;

   let errors = 0,
      idN = id.trim(),
      fechaMatrimonioN = fechaMatrimonio.trim(),
      nameSacerdoteN = nameSacerdote.trim(),
      nameEsposoN = nameEsposo.trim(),
      namePadreEsposoN = namePadreEsposo.trim(),
      nameMadreEsposoN = nameMadreEsposo.trim(),
      nameEsposaN = nameEsposa.trim(),
      namePadreEsposaN = namePadreEsposa.trim(),
      nameMadreEsposaN = nameMadreEsposa.trim(),
      namePadrinoN = namePadrino.trim(),
      nameMadrinaN = nameMadrina.trim(),
      ciudadRCivilN = ciudadRCivil.trim(),
      anioRCivilN = anioRCivil.trim(),
      tomoRCivilN = tomoRCivil.trim(),
      pageRCivilN = pageRCivil.trim(),
      numeroActaRCivilN = numActaRCivil.trim();

   if (
      idN === '' || 
      fechaMatrimonioN === '' || 
      nameSacerdoteN === '' || 
      nameEsposoN === '' || 
      namePadreEsposoN === '' || 
      nameMadreEsposoN === '' || 
      nameEsposaN === '' || 
      namePadreEsposaN === '' || 
      nameMadreEsposaN === '' || 
      namePadrinoN === '' || 
      nameMadrinaN === '' || 
      ciudadRCivilN === '' || 
      anioRCivilN === '' || 
      tomoRCivilN === '' || 
      pageRCivilN === '' || 
      numeroActaRCivilN === ''
   ) {
      res.json({
         res: 'icon',
         icon: 'info',
         tittle: 'CAMPOS VACIOS',
         description: 'Los campos no pueden ir vacios o con espacios.'
      });
   } else {
      errors += (!moment(fechaMatrimonioN).isValid()) ? 1 : 0;
      errors += (!spaceLetersVer(nameSacerdoteN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameEsposoN)) ? 1 : 0;
      errors += (!spaceLetersVer(namePadreEsposoN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMadreEsposoN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameEsposaN)) ? 1 : 0;
      errors += (!spaceLetersVer(namePadreEsposaN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMadreEsposaN)) ? 1 : 0;
      errors += (!spaceLetersVer(namePadrinoN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMadrinaN)) ? 1 : 0;
      errors += (!verNumberAndLetters(ciudadRCivil)) ? 1 : 0;
      errors += (!numbersVer(anioRCivilN)) ? 1 : 0;
      errors += (!numbersVer(tomoRCivilN)) ? 1 : 0;
      errors += (!numbersVer(pageRCivilN)) ? 1 : 0;
      errors += (!numbersVer(numeroActaRCivilN)) ? 1 : 0;

      if (errors > 0) {
         res.json({
            res: 'icon',
            icon: 'error',
            tittle: 'DATOS INCORRECTOS',
            description: 'Los tipos de datos solicitados y enviados son incorrectos.'
         });
      } else {
         try {
            const searchData = await connectionDB.query(`SELECT *
                                                         FROM matrimonio
                                                         WHERE _id = ?`, idN);

            if (searchData.length > 0) {
               const updateMatrimonio = {
                  fechaMatrimonio: fechaMatrimonioN,
                  nameSacerdote: nameSacerdoteN,
                  nameEsposo: nameEsposoN,
                  namePadreEsposo: namePadreEsposoN,
                  nameMadreEsposo: nameMadreEsposoN,
                  nameEsposa: nameEsposaN,
                  namePadreEsposa: namePadreEsposaN,
                  nameMadreEsposa: nameMadreEsposaN,
                  namePadrino: namePadrinoN,
                  nameMadrina: nameMadrinaN,
                  ciudadRCivil: ciudadRCivil,
                  anioRCivil: anioRCivilN,
                  tomoRCivil: tomoRCivilN,
                  paginaRCivil: pageRCivilN,
                  numeroActaRCivil: numeroActaRCivilN,
                  idCedula: req.user.cedula
               };
   
               const updateSaveMat = await connectionDB.query(`UPDATE matrimonio 
                                                               SET ?
                                                               WHERE _id = ?`, [updateMatrimonio, idN]);
               // console.log(updateSaveMat);
   
               if (updateSaveMat.affectedRows === 1) {
                  res.json({
                     res: 'img',
                     icon: '/img/SMMIglesia.png',
                     tittle: 'DATOS ACTUALIZADOS',
                     description: 'Los datos de la acta han sido actualizados con éxito.'
                  });
               } else {
                  res.json({
                     res: 'icon',
                     tittle: 'DATOS NO ACTUALIZADOS',
                     icon: 'error',
                     description: 'Upss! No se ha podido actualizar los datos de la acta.'
                  });
               }
            } else {
               res.json({
                  res: 'icon',
                  tittle: 'ACTA NO ENCONTRADA',
                  icon: 'error',
                  description: 'Upss! No existe ningún registro con ese ID.'
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

secretariaControllers.deleteMatrimonio = async (req, res) => {
   const {
      id
   } = req.body;

   let errors = 0,
      idN = id.trim();

   if (
      idN === ''
   ) {
      res.json({
         res: 'icon',
         icon: 'info',
         tittle: 'CAMPOS VACIOS',
         description: 'Los campos no pueden ir vacios o con espacios.'
      });
   } else {
      errors += (!numbersVer(idN)) ? 1 : 0;

      if (errors > 0) {
         res.json({
            res: 'icon',
            icon: 'error',
            tittle: 'DATOS INCORRECTOS',
            description: 'Los tipos de datos solicitados y enviados son incorrectos.'
         });
      } else {
         try {
   
            const deleteMatrimono = await connectionDB.query(`DELETE 
                                                            FROM matrimonio 
                                                            WHERE _id = ?`, idN);
            // console.log(deleteMatrimono);
   
            if (deleteMatrimono.affectedRows === 1) {
               res.json({
                  res: 'img',
                  icon: '/img/SMMIglesia.png',
                  tittle: 'ACTA ELIMINADA',
                  description: 'Se ha eliminado el acta de matrimonio con éxito.'
               });
            } else {
               res.json({
                  res: 'icon',
                  tittle: 'ACTA NO ELIMINADA',
                  icon: 'error',
                  description: 'Upss! No se ha podido eliminar el acta seleccionada.'
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

secretariaControllers.downloadPDFMatrimonio = async (req, res) => {
   let errors = 0,
      idBauN = req.params.idBau.trim();

   if (
      idBauN === ''
   ) {
      req.flash('danger_msg', 'Los campos no pueden ir vacíos o con espacios...');
      res.redirect('/s/comuniones');
   } else {
      errors += (!numbersVer(idBauN)) ? 1 : 0;

      if (errors > 0) {
         req.flash('danger_msg', 'Los tipos de datos solicitados y enviados son incorrectos.');
         res.redirect('/s/matrimonios');
      } else {
         try {
   
            const dataMatrimonio = await connectionDB.query(`SELECT *
                                                         FROM matrimonio
                                                         WHERE _id = ?`, idBauN);
            // console.log(dataMatrimonio);
   
            if (!dataMatrimonio) {
               req.flash('danger_msg', 'La acta con el ID solicitado no existe.');
               res.redirect('/s/matrimonios');
            } else {
               try {
                  const html = fse.readFileSync(path.join(__dirname, '../templates/docs/matrimonio.html'), 'utf-8');

                  const paramsHTML = {
                     fechaMatrimonio: moment(dataMatrimonio[0].fechaMatrimonio).format('LL'),
                     nameSacerdote: dataMatrimonio[0].nameSacerdote.toUpperCase(),
                     nameEsposo: dataMatrimonio[0].nameEsposo.toUpperCase(),
                     namePadreEsposo: dataMatrimonio[0].namePadreEsposo.toUpperCase(),
                     nameMadreEsposo: dataMatrimonio[0].nameMadreEsposo.toUpperCase(),
                     nameEsposa: dataMatrimonio[0].nameEsposa.toUpperCase(),
                     namePadreEsposa: dataMatrimonio[0].namePadreEsposa.toUpperCase(),
                     nameMadreEsposa: dataMatrimonio[0].nameMadreEsposa.toUpperCase(),
                     namePadrino: dataMatrimonio[0].namePadrino.toUpperCase(),
                     nameMadrina: dataMatrimonio[0].nameMadrina.toUpperCase(),
                     ciudadRCivil: dataMatrimonio[0].ciudadRCivil.replace(/\b\w/g, l => l.toUpperCase()),
                     anioRCivil: dataMatrimonio[0].anioRCivil,
                     tomoRCivil: dataMatrimonio[0].tomoRCivil,
                     paginaRCivil: dataMatrimonio[0].paginaRCivil,
                     numeroActaRCivil: dataMatrimonio[0].numeroActaRCivil,
                     nameSacerdoteNow: process.env.nameSacerdoteNow,
                     dateNow: moment().format('LL')
                  };

                  const filename = `${dataMatrimonio[0].nameEsposo} y ${dataMatrimonio[0].nameEsposa} - ${moment().format('MMM D, YYYY').replace(/\b\w/g, l => l.toUpperCase())}.pdf`;

                  const document = {
                     html: html,
                     data: {
                        data: paramsHTML
                     },
                     path: path.join(__dirname, '../actas/') + filename
                  };

                  await pdf.create(document, configPDF);

                  var data = path.join(__dirname, '../actas/' + filename);
                  res.download(data, filename);

               } catch (e) {
                  console.log(e);
               }
            }
         } catch (e) {
            console.log(e);
            req.flash('danger_msg', 'Upss! Error interno x_x. Intentelo más luego.');
            res.redirect('/s/matrimonios');
         }
      }
   }
};

module.exports = secretariaControllers;
const nodemailer = require('nodemailer');
const moment = require('moment');
moment.locale('es');

const secretariaControllers = {};

const connectionDB = require('../database');

const {
   cedulaVal,
   emailVer,
   numbersVer,
   spaceLetersVer
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

      bau = await connectionDB.query('SELECT COUNT(_id) AS numOF FROM bautizo');
      bau = bau[0].numOF;

      comu = await connectionDB.query('SELECT COUNT(_id) AS numOF FROM comunion');
      comu = comu[0].numOF;

      conf = await connectionDB.query('SELECT COUNT(_id) AS numOF FROM confirmacion');
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
      descriptionEv
   } = req.body;

   var colorEvents = colorEv.trim(),
      fechaEvents = fechaEv.trim(),
      descriptionEvents = descriptionEv.trim();

   if (fechaEvents == '' || descriptionEvents == '' || colorEvents == '') {
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
         descripcion: descriptionEvents,
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
         const deleteEven = await connectionDB.query('DELETE FROM eventos WHERE ID = ?', idEv);
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
      const resEvent = await connectionDB.query(`  SELECT * 
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
      descriptionEv
   } = req.body;

   var idEvents = idEv.trim(),
      colorEvents = colorEv.trim(),
      fechaEvents = fechaEv.trim(),
      descriptionEvents = descriptionEv.trim();

   if (idEvents == '' || fechaEvents == '' || descriptionEvents == '' || colorEvents == '') {
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
         descripcion: descriptionEvents,
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
                                                      _id, apellidos, nombres, fechaNacimiento,nameSacerdote, anioRParroquial, tomoRParroquial, paginaRParroquial, numeroRParroquial
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
      errors += (!spaceLetersVer(apellidosN)) ? 1 : 0;
      errors += (!spaceLetersVer(nombresN)) ? 1 : 0;
      errors += (!spaceLetersVer(homeNacimientoN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameFatherN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMotherN)) ? 1 : 0;
      errors += (!spaceLetersVer(namePadrinoN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameMadrinaN)) ? 1 : 0;
      errors += (!spaceLetersVer(nameSacerdoteN)) ? 1 : 0;
      errors += (!numbersVer(anioParroquiaN)) ? 1 : 0;
      errors += (!numbersVer(tomoParroquiaN)) ? 1 : 0;
      errors += (!numbersVer(pageParroquiaN)) ? 1 : 0;
      errors += (!numbersVer(numeroParroquiaN)) ? 1 : 0;
      errors += (!spaceLetersVer(ciudadRCivilN)) ? 1 : 0;
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
            const newBautizo = {
               apellidos: apellidosN,
               nombres: nombresN,
               lugarNacimiento: homeNacimientoN,
               fechaNacimiento: dateNacimientoN,
               namePadre: nameFatherN,
               nameMadre: nameMotherN,
               namePadrino: namePadrinoN,
               nameMadrina: nameMadrinaN,
               nameSacerdote: nameSacerdoteN,
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

module.exports = secretariaControllers;
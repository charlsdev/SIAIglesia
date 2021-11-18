const moment = require('moment');
moment.locale('es');

const secretariaControllers = {};

const connectionDB = require('../database');

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
      estadoOf, changeEST;

   const estado = {
      'Aceptado': 'Aceptado',
      'No aceptado': 'No aceptado',
      'Pendiente': 'Pendiente',
      'Eliminar': 'Eliminar',
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
         (estadoCh === 'Eliminar')
            ? estadoOf = await connectionDB.query(`DELETE
                                                FROM ofrendas
                                                WHERE idOfrenda = ?`, ID)
            : changeEST = await connectionDB.query(`UPDATE ofrendas
                                                SET estado = ?
                                                WHERE idOfrenda = ?`, [estadoCh, ID]);

         (estadoOf)
            ? res.json({
               tittle: 'INTENCIÓN ELIMINADA',
               icon: '/img/SMMIglesia.png',
               description: 'La ofrenda o intención ha sido eliminada con éxito.'
            })
            : (changeEST)
               ? res.json({
                  tittle: 'INTENCIÓN ACTUALIZADA',
                  icon: '/img/SMMIglesia.png',
                  description: `El estado de la intencion ha cambiado a <b>${estadoCh}</b>.`
               })
               : res.json({
                  tittle: 'SERVER ERROR',
                  icon: 'error',
                  description: 'Upss! No se ha podido cambiar el estado de la ofrenda.'
               });
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

         if (saveEvents) {
            res.json({
               tittle: 'EVENTO PUBLICADO',
               icon: '/img/SMMIglesia.png',
               description: 'El evento ha sido guardado y publicado con éxito.'
            });
         } else {
            res.json({
               tittle: 'SERVER ERROR',
               icon: 'error',
               description: 'Upss! No se ha podido guardar el evento.'
            });
         }
      } catch (error) {
         res.json({
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
         tittle: 'CAMPOS VACÍOS',
         icon: 'info',
         description: 'Los campos no pueden ir vacíos o con espacios'
      });
   } else {
      try {
         const deleteEven = await connectionDB.query('DELETE FROM eventos WHERE ID = ?', idEv);
         // console.log(deleteEven);

         if (deleteEven) {
            res.json({
               tittle: 'EVENTO ELIMINADO',
               icon: '/img/SMMIglesia.png',
               description: 'El evento ha sido eliminado con éxito.'
            });
         } else {
            res.json({
               tittle: 'ERROR DELETE',
               icon: 'error',
               description: 'Upss! No se ha podido eliminar el evento.'
            });
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

secretariaControllers.searchEvento = async (req, res) => {
   const {
      idEvent
   } = req.query;

   try {
      const resEvent = await connectionDB.query(`  SELECT * 
                                                   FROM eventos 
                                                   WHERE id = ?`, idEvent);
      console.log(resEvent[0]);
      
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
         console.log(saveEvents);

         if (saveEvents) {
            res.json({
               tittle: 'EVENTO ACTUALIZADO',
               icon: '/img/SMMIglesia.png',
               description: 'El evento ha sido actualizado y publicado con éxito.'
            });
         } else {
            res.json({
               tittle: 'SERVER ERROR',
               icon: 'error',
               description: 'Upss! No se ha podido actualizar el evento.'
            });
         }
      } catch (error) {
         res.json({
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

module.exports = secretariaControllers;
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

   let est = (estado == 'Enabled') ? true : false;

   res.render('secretaria/ofrendas', {
      cedula, apellidos, nombres, privilegio, estado, photoProfile,
      est
   });
};

secretariaControllers.getOfrendas = async (req, res) => {
   let searchOfrendas;

   try {
      searchOfrendas = await connectionDB
         .query(` SELECT *
                  FROM ofrendas 
                  WHERE tipItencion = "Ofrenda"
                  ORDER BY fechaOf DESC`);

      res.send(searchOfrendas);
   } catch (e) {
      console.log(e);
   }
};

module.exports = secretariaControllers;
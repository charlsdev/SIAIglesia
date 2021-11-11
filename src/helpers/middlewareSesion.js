const helpersMidle = {};

helpersMidle.isAuthenticated = (req, res, next) => {
   if (req.isAuthenticated()) {
      return next();
   }

   req.flash('warning_msg', 'No estas autorizado. Inicia sesión...');
   res.redirect('/login');
};

helpersMidle.isNotAuthenticated = (req, res, next) => {
   if (!req.isAuthenticated()) {
      return next();
   }
   
   res.redirect('/verification');
};

helpersMidle.authSecretaria = (req, res, next) => {
   if (req.user.privilegio == 'Secretaria') {
      return next();
   }

   res.redirect('/verification');
};

helpersMidle.authSacerdote = (req, res, next) => {
   if (req.user.privilegio == 'Sacerdote') {
      return next();
   }

   res.redirect('/verification');
};

helpersMidle.authAdministrador = (req, res, next) => {
   if (req.user.privilegio == 'Administrador') {
      return next();
   }

   res.redirect('/verification');
};

module.exports = helpersMidle;
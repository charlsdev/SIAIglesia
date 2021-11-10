const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const connectionDB = require('../database');
const helpers = require('../helpers/encryptPass');

passport.use('local.login', new localStrategy({
   usernameField: 'username',
   passwordField: 'password',
   passReqToCallback: true
}, async (req, username, password, done) => {
   const userVer = await connectionDB.query('SELECT * FROM usuarios WHERE cedula = ?', [username]);
   
   if (userVer.length > 0) {
      const user = userVer[0];
      const validPassword = await helpers.matchPassword(password, user.password);

      if (validPassword) {
         if (user.estado == 'Disabled') {
            return done(null, false, { message: '¡Usuario desactivado! Comuniquese con el administrador del sitema...'});
         } else {
            return done(null, user);
         }
      } else {
         return done(null, false, { message: 'Usuario y/o contraseña incorrectas...'});
      }
   } else {
      return done(null, false, { message: 'Usuario y/o contraseña incorrectas...'});
   }
}));

passport.serializeUser((user, done) => {
   done(null, user.cedula);
});

passport.deserializeUser(async (cedula, done) => {
   const user = await connectionDB.query('SELECT * FROM usuarios WHERE cedula = ?', [cedula]);
   done(null, user[0]);
});
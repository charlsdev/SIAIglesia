const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

//Inicializaciones
const app = express();
require('./config/passport');

//Configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
   extname: '.hbs',
   layoutsDir: path.join(app.get('views'), 'layouts'),
   partialsDir: path.join(app.get('views'), 'partials'),
   helpers: require('./helpers/timeagoFormat'),
   defaultLayout: 'main'
}));

app.set('view engine', '.hbs');

//Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());                           //Interpreta los JSON que lleguen a mi aplicación
app.use(express.urlencoded({extended: false}));    //Para poder interpretar los datos de los form
app.use(methodOverride('_method'));
app.use(session({
   secret: 'SSMIglesia/BRYPwn41_210',
   resave: true,
   saveUninitialized: true,
   cookie: {
      secure: false,
      // maxAge: 365 * 24 * 60 * 60 * 1000
      maxAge: null
   }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Variables globales
app.use((req, res, next) => {   
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.warning_msg = req.flash('warning_msg');
   res.locals.info_msg = req.flash('info_msg');
   res.locals.error = req.flash('error');

   // En caso de no haber ninguna alerta
   res.locals.user = req.user || null;
   next();
});

//Rutas
app.use(require('./routes/index.routes'));
// app.use('/e', require('./routes/estudiantes.routes'));

//Archivos estáticos
app.use(express.static(path.join(__dirname + '/public')));

// Error 404 - Not Found
app.get('*', (req, res) => {
   res.status(404).render('404');
});

module.exports = app;
const indexControllers = {};

indexControllers.renderLogin = async (req, res) => {
   res.render('login');
};

indexControllers.renderIndexSec = async (req, res) => {
   res.render('secretaria/index');
};

module.exports = indexControllers;
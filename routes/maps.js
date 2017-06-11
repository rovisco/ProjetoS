exports.home = function(req, res) {
   res.render('maps/home', { user: req.user });
};


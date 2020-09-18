var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	//Flash message for not being an admin
	//req.flash()
	res.redirect("/login");
}

module.exports = middlewareObj;
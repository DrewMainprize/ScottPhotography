var bodyParser 			= require("body-parser"),
	mongoose 			= require("mongoose"),
	express				= require("express"),
	app 				= express(),
	methodOverride 		= require("method-override"),
	expressSanitizer 	= require("express-sanitizer"),
	fs					= require("fs"),
	busboy				= require("connect-busboy");
	path 				= require("path");
	Photo				= require("./models/photo");
	User				= require("./models/user");
	passport			= require("passport");
	LocalStrategy 		= require("passport-local");
	middleware			= require("./middleware/middle");
//App config

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(busboy());

//Busboy Init
const serveIndex = require('serve-index'); 
app.use('/files', serveIndex(path.join(__dirname, '/files')));

//Mongo Init
mongoose.connect("mongodb+srv://Drew:Nodatabreach@scottphotography.cibpf.mongodb.net/<dbname>?retryWrites=true&w=majority", 
				 {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});



//Passport Config
app.use(require("express-session")({
	secret: "decc dinsodi dingdong aaaa scam",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





//============ ROUTES ===============


//Landing
app.get("/", function(req, res){
	res.render("landing");
});

//Contact
app.get("/contact", function(req, res){
	res.render("contact");
});

//Photos
app.get("/photos", function(req, res){
	Photo.find({}, function(err, allPhotos){
		if(err){
			console.log(err);
		} else {
			res.render("photoPage", {photos: allPhotos});
		}
	}).sort({_id: -1});
});

//New Photo
app.get("/admin", middleware.isLoggedIn, function(req, res){
	res.render("dashboard");
});

//Create photo
app.post("/photos", middleware.isLoggedIn, function (req, res) {
	var fstream;
	req.pipe(req.busboy);
	req.busboy.on("file", function(fieldname, file, filename){
		console.log("Uploading: " + filename);
		var photoPath = "visuals/" + filename;
		fstream = fs.createWriteStream(__dirname + "/public/" + photoPath);
		console.log(photoPath);
		file.pipe(fstream);
		
		//Create new photo in DB
		var newPhoto = {filePath: photoPath}
		Photo.create(newPhoto, function(err, newlyCreated){
			if(err){
				console.log(err);
			}
		});
		
		fstream.on("close", function(){
			res.redirect("back");
		});
	});
});

//Show Photo
app.get("/photos/:id", function(req, res){
	
});

//Videos
app.get("/videos", function(req, res){
	res.render("videoPage");
});

//Auth Routes

//Show Login Form
app.get("/login", function(req, res){
	res.render("login");
});

//Handle Login Logic
app.post("/login", passport.authenticate("local", 
		{
		 	successRedirect: "/admin",
			failureRedirect: "/login"
		}), function(req, res){
});

//Logout route
app.get("/logout", function(req, res){
	console.log("Successfully logged out");
	req.logout();
	res.redirect("/photos");
});


//Listening route
const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
	console.log("ScottPhoto server running on port ${ PORT }");
});
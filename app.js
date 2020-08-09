var bodyParser 			= require("body-parser"),
	mongoose 			= require("mongoose"),
	express				= require("express"),
	moment 				= require("moment");
	app 				= express();
	methodOverride 		= require("method-override");
	expressSanitizer 	= require("express-sanitizer");
	

//App config

mongoose.connect("mongodb+srv://ProjAdmin:StevenJohn@scottvantuyl.cibpf.mongodb.net/scottPhoto?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

//mongoose.connect("mongodb://localhost:27017/scottPhoto", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//Mongoose/model config
var photoSchema = new mongoose.Schema({
	image: String,
	created: {type: Date, default: Date.now},
	location: String,
	category: String
});


var Photo = mongoose.model("Photo", photoSchema);

/*
Photo.create({
	caption: "DB Connectivity Test",
	image: "stylesheets/images/landing.jpg"
});
*/

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
	Photo.find({}, function(err, photos){
		if(err){
			console.log(err);
		}else{
			res.render("photoPage", {photos: photos});
		}
	});
});

//New Photo
app.get("/photos/new", function(req, res){
	res.render("newPhoto");
});

//Create Photo
app.post("/photos", function(req, res){
	Photo.create(req.body.photo, function(err, newPhoto){
		req.body.photo.caption = req.sanitize(req.body.photo.caption);
		if(err){
			res.render("newPhoto");
		}else{
			res.redirect("/photos");
		}
	});
});


//Show Photo
app.get("/photos/:id", function(req, res){
	Photo.findById(req.params.id, function(err, foundPhoto){
		if(err){
			res.redirect("/photos");
		}else{
			res.render("showPhoto", {photo: foundPhoto});
		}
	});
});

//New Video
app.get("/videos", function(req, res){
	res.render("videoPage");
});

//Listening route
app.listen("3000", function(){
	console.log("ScottPhoto server is running");
});